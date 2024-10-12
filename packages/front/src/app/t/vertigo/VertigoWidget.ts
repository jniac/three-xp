import { calculateExponentialDecay } from 'some-utils-ts/math/misc/exponential-decay'
import { BoxGeometry, BufferAttribute, BufferGeometry, Camera, Color, ColorRepresentation, ConeGeometry, Group, LatheGeometry, Mesh, Raycaster, ShaderMaterial, Vector2, Vector3 } from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { mergeGeometries, mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

enum Part {
  BOX = 0,
  POSITIVE_X,
  NEGATIVE_X,
  POSITIVE_Y,
  NEGATIVE_Y,
  POSITIVE_Z,
  NEGATIVE_Z,
}

const vertexShader = /* glsl */ `
uniform vec3 uColors[7];
uniform float uOpacity[7];
uniform vec3 uHoverColor;
uniform float uHoverOpacity[7];

attribute float aPartId;

varying vec3 vWorldNormal;
varying vec3 vPosition;
varying vec3 vColor;
varying float vOpacity;
varying float vHoverOpacity;

void main() {
  vWorldNormal = mat3(modelMatrix) * normal;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  vColor = uColors[int(aPartId)];
  vOpacity = uOpacity[int(aPartId)];
  vHoverOpacity = uHoverOpacity[int(aPartId)];
}
`

const fragmentShader = /* glsl */ `
varying vec3 vWorldNormal;
varying vec3 vPosition;
varying vec3 vColor;
varying float vOpacity;
varying float vHoverOpacity;

uniform vec3 uSunPosition;
uniform float uLuminosity;
uniform vec3 uHoverColor;

float clamp01(float x) {
  return x < 0.0 ? 0.0 : x > 1.0 ? 1.0 : x;
}

float inverseLerp(float a, float b, float x) {
  return clamp01((x - a) / (b - a));
}

void main() {
  vec3 lightDirection = normalize(uSunPosition);
  float light = dot(vWorldNormal, lightDirection) * 0.5 + 0.5;
  light = pow(light, 2.0);
  
  float minLuminosity = max(pow(vHoverOpacity, 1.0 / 3.0) * 0.85, uLuminosity);
  light = mix(minLuminosity, 1.0, light);

  vec3 color = vColor;
  color = mix(color, uHoverColor, vHoverOpacity);
  gl_FragColor = vec4(color * light, vOpacity);
}
`

function assignPartId(geometry: BufferGeometry, partId: Part) {
  const aPartId = new BufferAttribute(new Int8Array(geometry.attributes.position.count).fill(partId), 1)
  geometry.setAttribute('aPartId', aPartId)
}

function createHandleGeometry(radialSubdivisions: number, capSubdivisions: number) {
  const r = .2
  const h = 3
  const y = .53
  const cone = new ConeGeometry(r, r * 3, radialSubdivisions, 1, true).rotateZ(Math.PI).translate(0, y, 0)

  const capPoints = Array.from({ length: capSubdivisions }, (_, i) => {
    const t = i / (capSubdivisions - 1)
    return new Vector2(r * t, -.05 * ((1 - t ** 2)))
  })
  const cap = new LatheGeometry(capPoints, radialSubdivisions).rotateZ(Math.PI).translate(0, r * h / 2 + y, 0)

  return mergeGeometries([cone, cap], false)
}

function createGeometries(lod = <'high' | 'low'>'low') {
  const box = lod === 'high'
    ? mergeVertices(new RoundedBoxGeometry(.3, .3, .3, 4, .05))
    : new BoxGeometry(.3, .3, .3)
  assignPartId(box, Part.BOX)
  const handlePY = lod === 'high'
    ? createHandleGeometry(32, 8)
    : createHandleGeometry(6, 2)
  assignPartId(handlePY, Part.POSITIVE_Y)
  const handleNY = handlePY.clone().rotateX(Math.PI)
  assignPartId(handleNY, Part.NEGATIVE_Y)
  const handlePX = handlePY.clone().rotateZ(-Math.PI / 2)
  assignPartId(handlePX, Part.POSITIVE_X)
  const handleNX = handlePY.clone().rotateZ(Math.PI / 2)
  assignPartId(handleNX, Part.NEGATIVE_X)
  const handlePZ = handlePY.clone().rotateX(Math.PI / 2)
  assignPartId(handlePZ, Part.POSITIVE_Z)
  const handleNZ = handlePY.clone().rotateX(-Math.PI / 2)
  assignPartId(handleNZ, Part.NEGATIVE_Z)

  return [box, handlePX, handleNX, handlePY, handleNY, handlePZ, handleNZ]
}

function createSingleGeometry(...args: Parameters<typeof createGeometries>) {
  const geometries = createGeometries(...args)
  return mergeGeometries(geometries, true)
}

const defaultMaterialProps = {
  defaultColor: <ColorRepresentation>'white',
  xColor: <ColorRepresentation>'#eb1640',
  yColor: <ColorRepresentation>'#00ffb7',
  zColor: <ColorRepresentation>'#3b80e7',
  hoverColor: <ColorRepresentation>'#fffc47',
}

function createMaterial(props?: Partial<typeof defaultMaterialProps>) {
  const { defaultColor, xColor, yColor, zColor, hoverColor } = { ...defaultMaterialProps, ...props }
  const _defaultColor = new Color(defaultColor)
  const _xColor = new Color(xColor)
  const _yColor = new Color(yColor)
  const _zColor = new Color(zColor)
  const _hoverColor = new Color(hoverColor)

  const uniforms = {
    uSunPosition: { value: new Vector3(0.5, 0.7, 0.3) },
    uLuminosity: { value: .66 },
    uColors: { value: [_defaultColor, _xColor, _defaultColor, _yColor, _defaultColor, _zColor, _defaultColor] },
    uHoverColor: { value: _hoverColor },
    uOpacity: { value: [1, 1, 1, 1, 1, 1, 1] },
    uHoverOpacity: { value: [0, 0, 0, 0, 0, 0, 0] },
  }

  return new ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
  })
}

type VertigoWidgetMaterial = ReturnType<typeof createMaterial>

const raycaster = new Raycaster()

export class VertigoWidget extends Group {
  parts: {
    material: VertigoWidgetMaterial
    meshes: Mesh<BufferGeometry, VertigoWidgetMaterial>[]
    lowMesh: Mesh<BufferGeometry, VertigoWidgetMaterial>
  }

  internal = {
    pointerPosition: new Vector2(),
    pointerDownPosition: new Vector2(),
    pointerDown: false,
    dragging: false,
    hovered: <Part | null>null,
    pressed: <Part | null>null,
  }

  constructor(props?: { material?: Partial<typeof defaultMaterialProps> }) {
    super()

    const material = createMaterial(props?.material)

    const meshes = createGeometries('high').map((geometry, index) => {
      const mesh = new Mesh(geometry, material)
      mesh.name = `vertigo-widget-mesh-${index}`
      this.add(mesh)
      return mesh
    })

    const lowMesh = new Mesh(createSingleGeometry('low'), material)
    lowMesh.name = 'vertigo-widget-low-mesh'
    lowMesh.visible = false
    this.add(lowMesh)

    this.parts = {
      material,
      meshes,
      lowMesh,
    }
  }

  getHovered() {
    return this.internal.hovered
  }

  getPressed() {
    return this.internal.pressed
  }

  widgetUpdate(ndcPointer: Vector2, pointerDown: boolean, camera: Camera, deltaTime = 1 / 60) {
    const { lowMesh, material } = this.parts

    const cameraForward = new Vector3()
    camera.getWorldDirection(cameraForward)

    const me = this.matrixWorld.elements
    const vectorX = new Vector3(me[0], me[1], me[2])
    const vectorY = new Vector3(me[4], me[5], me[6])
    const vectorZ = new Vector3(me[8], me[9], me[10])

    {
      const values = material.uniforms.uOpacity.value as number[]
      const absDotX = Math.abs(cameraForward.dot(vectorX))
      const absDotY = Math.abs(cameraForward.dot(vectorY))
      const absDotZ = Math.abs(cameraForward.dot(vectorZ))
      const xOpacity = absDotX < .98 ? 1.05 : -.05
      const yOpacity = absDotY < .98 ? 1.05 : -.05
      const zOpacity = absDotZ < .98 ? 1.05 : -.05
      const decay = .0001
      values[Part.POSITIVE_X] =
        values[Part.NEGATIVE_X] = calculateExponentialDecay(values[Part.POSITIVE_X], xOpacity, decay, deltaTime)
      values[Part.POSITIVE_Y] =
        values[Part.NEGATIVE_Y] = calculateExponentialDecay(values[Part.POSITIVE_Y], yOpacity, decay, deltaTime)
      values[Part.POSITIVE_Z] =
        values[Part.NEGATIVE_Z] = calculateExponentialDecay(values[Part.POSITIVE_Z], zOpacity, decay, deltaTime)
    }

    {
      const values = material.uniforms.uHoverOpacity.value as number[]
      const decay = .0001
      const boxHover = this.internal.hovered === Part.BOX ? 1 : 0
      const posXHover = this.internal.hovered === Part.POSITIVE_X ? 1 : 0
      const negXHover = this.internal.hovered === Part.NEGATIVE_X ? 1 : 0
      const posYHover = this.internal.hovered === Part.POSITIVE_Y ? 1 : 0
      const negYHover = this.internal.hovered === Part.NEGATIVE_Y ? 1 : 0
      const posZHover = this.internal.hovered === Part.POSITIVE_Z ? 1 : 0
      const negZHover = this.internal.hovered === Part.NEGATIVE_Z ? 1 : 0
      values[Part.BOX] = calculateExponentialDecay(values[Part.BOX], boxHover, decay, deltaTime)
      values[Part.POSITIVE_X] = calculateExponentialDecay(values[Part.POSITIVE_X], posXHover, decay, deltaTime)
      values[Part.NEGATIVE_X] = calculateExponentialDecay(values[Part.NEGATIVE_X], negXHover, decay, deltaTime)
      values[Part.POSITIVE_Y] = calculateExponentialDecay(values[Part.POSITIVE_Y], posYHover, decay, deltaTime)
      values[Part.NEGATIVE_Y] = calculateExponentialDecay(values[Part.NEGATIVE_Y], negYHover, decay, deltaTime)
      values[Part.POSITIVE_Z] = calculateExponentialDecay(values[Part.POSITIVE_Z], posZHover, decay, deltaTime)
      values[Part.NEGATIVE_Z] = calculateExponentialDecay(values[Part.NEGATIVE_Z], negZHover, decay, deltaTime)
    }

    raycaster.setFromCamera(ndcPointer, camera)
    const intersections = raycaster
      .intersectObject(lowMesh, true)

    const [first] = intersections
      .map(intersection => {
        const firstVertexIndex = intersection.faceIndex! * 3
        return lowMesh.geometry.groups.findIndex(g => g.start <= firstVertexIndex && firstVertexIndex < g.start + g.count) as Part
      })
      .filter(part => {
        return material.uniforms.uOpacity.value[part] > .5
      })

    // Press:
    if (pointerDown && this.internal.pointerDown === false) {
      this.internal.pointerDown = true
      this.internal.pointerDownPosition.copy(ndcPointer)
      this.internal.pressed = first ?? null
    }

    // Drag:
    if (pointerDown && this.internal.dragging === false) {
      const dragThreshold = .01
      if (this.internal.pointerDownPosition.distanceTo(ndcPointer) > dragThreshold) {
        this.internal.dragging = true
      }
    }

    // Release:
    if (pointerDown === false && this.internal.pointerDown) {
      this.internal.pointerDown = false
      this.internal.dragging = false
      this.internal.pressed = null
    }

    const hoveredNew = this.internal.dragging ? null : first ?? null
    if (this.internal.hovered !== hoveredNew) {
      if (hoveredNew !== null) {
      }
    }
    this.internal.hovered = hoveredNew
  }
}

export {
  Part as VertigoWidgetPart
}

