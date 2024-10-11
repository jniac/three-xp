import { BufferAttribute, BufferGeometry, Color, ConeGeometry, Group, LatheGeometry, Mesh, ShaderMaterial, Vector2, Vector3 } from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import { setup } from 'some-utils-three/utils/tree'

enum Parts {
  CORE = 0,
  POSITIVE_X,
  NEGATIVE_X,
  POSITIVE_Y,
  NEGATIVE_Y,
  POSITIVE_Z,
  NEGATIVE_Z,
}

const vertexShader = /* glsl */ `
attribute float aPartId;

varying vec3 vWorldNormal;
varying vec3 vPosition;
varying vec3 vColor;

uniform vec3 uColors[7];

void main() {
  vWorldNormal = mat3(modelMatrix) * normal;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  vColor = uColors[int(aPartId)];
}
`

const fragmentShader = /* glsl */ `
varying vec3 vWorldNormal;
varying vec3 vPosition;
varying vec3 vColor;

uniform vec3 uSunPosition;
uniform float uLuminosity;

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
  light = mix(uLuminosity, 1.0, light);

  vec3 color = vColor;
  // color = mix(vec3(1.0), color, inverseLerp(.2, .8, vPosition.x));
  gl_FragColor = vec4(color * light, 1.0);
}
`

const colorWhite = new Color('white')
const colorX = new Color('#eb1640')
const colorY = new Color('#00ffb7')
const colorZ = new Color('#3b80e7')

const uniforms = {
  uSunPosition: { value: new Vector3(0.5, 0.7, 0.3) },
  uLuminosity: { value: .75 },
  uColors: { value: [colorWhite, colorX, colorWhite, colorY, colorWhite, colorZ, colorWhite] },
}

const material = new ShaderMaterial({
  uniforms,
  vertexShader,
  fragmentShader,
})

function assignPartId(geometry: BufferGeometry, partId: Parts) {
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

  return mergeGeometries([cone, cap])
}

export class VertigoWidget extends Group {
  constructor() {
    super()

    const core = new RoundedBoxGeometry(.3, .3, .3, 4, .05)

    assignPartId(core, Parts.CORE)
    setup(new Mesh(core, material), { parent: this })

    const handlePY = createHandleGeometry(32, 8)
    assignPartId(handlePY, Parts.POSITIVE_Y)
    setup(new Mesh(handlePY, material), { parent: this })

    const handleNY = handlePY.clone().rotateX(Math.PI)
    assignPartId(handleNY, Parts.NEGATIVE_Y)
    setup(new Mesh(handleNY, material), { parent: this })

    const handlePX = handlePY.clone().rotateZ(-Math.PI / 2)
    assignPartId(handlePX, Parts.POSITIVE_X)
    setup(new Mesh(handlePX, material), { parent: this })

    const handleNX = handlePY.clone().rotateZ(Math.PI / 2)
    assignPartId(handleNX, Parts.NEGATIVE_X)
    setup(new Mesh(handleNX, material), { parent: this })

    const handlePZ = handlePY.clone().rotateX(Math.PI / 2)
    assignPartId(handlePZ, Parts.POSITIVE_Z)
    setup(new Mesh(handlePZ, material), { parent: this })

    const handleNZ = handlePY.clone().rotateX(-Math.PI / 2)
    assignPartId(handleNZ, Parts.NEGATIVE_Z)
    setup(new Mesh(handleNZ, material), { parent: this })
  }
}
