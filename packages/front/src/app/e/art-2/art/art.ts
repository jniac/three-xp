import { BackSide, BufferGeometry, Color, CylinderGeometry, EquirectangularReflectionMapping, Group, IcosahedronGeometry, Mesh, MeshBasicMaterial, MeshPhysicalMaterial, Object3D, PMREMGenerator, Vector3 } from 'three'

import { UseEffectsEffect } from 'some-utils-react/hooks/effects'
import { ShaderForge, vec3 } from 'some-utils-three/shader-forge'
import { calculateVFOV } from 'some-utils-three/utils/camera'
import { applyTransform, TransformProps } from 'some-utils-three/utils/tranform'
import { glsl_color_adjust } from 'some-utils-ts/glsl/color-adjust'
import { glsl_easings } from 'some-utils-ts/glsl/easings'
import { range } from 'some-utils-ts/iteration/range'
import { lerp } from 'some-utils-ts/math/basic'
import { PRNG } from 'some-utils-ts/random/prng'
import { Destroyable } from 'some-utils-ts/types'

import { config } from '@/config'
import { loadRgbe, loadTexture } from '@/tools/three/utils/rgbe'
import { Three } from '@/tools/three/webgl'

import { GradientRing, Torus } from './circular'
import { colors } from './colors'
import { Lights } from './lights'
import { ASky } from './skies/a-sky'
import { MainSphere, SmallGradientSphere } from './sphere'

class Blacky extends Mesh<BufferGeometry, MeshPhysicalMaterial> {
  constructor(transformProps?: TransformProps) {
    const geometry = new IcosahedronGeometry(.4, 12)
    const material = new MeshPhysicalMaterial({})
    material.onBeforeCompile = shader => ShaderForge.with(shader)
      .varying({
        vWorldPosition: 'vec3',
        vNormalWorld: 'vec3',
        vViewDir: 'vec3',
      })
      .vertex.mainAfterAll(/* glsl */`
        vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        vNormalWorld = normalize(mat3(modelMatrix) * normal);
        vViewDir = normalize(cameraPosition - vWorldPosition);
      `)
      .fragment.top(
        glsl_easings,
        glsl_color_adjust
      )
      .fragment.after('map_fragment', /* glsl */`
        float fresnel = dot(vNormalWorld, vViewDir);
        vec3 inner = ${vec3(colors.white)};
        vec3 outer = ${vec3(colors.black)};
        float alpha = easeInOut(1.0 - pow(fresnel, 1.5), 2.0, 0.0);
        diffuseColor.rgb = mix(inner, outer, alpha);
      `)
      .fragment.mainAfterAll(/* glsl */`
        // Final tuning
        gl_FragColor.rgb = mix(contrast(greyscale(gl_FragColor.rgb), 1.5), diffuseColor.rgb, alpha);
      `)

    super(geometry, material)
    applyTransform(this, transformProps)
  }
}

export class Line extends Mesh {
  static defaultProps = {
    color: colors.black,
    thickness: .01,
    shaded: false,
    length: 1,
  }
  constructor(props?: TransformProps & Partial<typeof Line.defaultProps>) {
    const {
      color,
      thickness,
      length,
      shaded,
      ...transformProps
    } = { ...Line.defaultProps, ...props }
    const material = shaded
      ? new MeshPhysicalMaterial({ color })
      : new MeshBasicMaterial({ color })
    const geometry = new CylinderGeometry(thickness / 2, thickness / 2, length, 12, 1).rotateZ(Math.PI * .5)
    super(geometry, material)
    applyTransform(this, transformProps)
  }
}

function add<T extends Object3D>(parent: T, ...children: Object3D[]): T {
  for (const child of children) {
    parent.add(child)
  }
  return parent
}

function addTo<T extends Object3D>(child: T, parent: Object3D): T {
  parent.add(child)
  return child
}

function* setup(three: Three): Generator<Destroyable, Group> {
  const { ticker, scene } = three

  ticker.set({ activeDuration: config.development ? 3 : 180 })

  loadRgbe('https://threejs.org/examples/textures/equirectangular/royal_esplanade_1k.hdr')
    .then(texture => {
      const pmremGenerator = new PMREMGenerator(three.renderer)
      const env = pmremGenerator.fromEquirectangular(texture).texture
      // scene.environment = env
    })

  const group = new Group()
  scene.add(group)
  yield () => {
    group.removeFromParent()
  }

  return group
}

export function* art(three: Three, state: UseEffectsEffect) {
  const group = yield* setup(three)

  if (state.renderCount === 1) {
    const { camera } = three
    // Handle the portrait mode
    camera.fov = three.aspect > 1 ? 25 : calculateVFOV(25, three.aspect)
    camera.far = 1000
    camera.updateProjectionMatrix()
    camera.position.set(0, 0, 10)
  }

  group.add(new ASky())

  group.add(new Lights())

  const mainSphere = addTo(new MainSphere(), group)

  group.add(new GradientRing({ z: -1, radius: 1.4, innerRadiusRatio: .805 }))
  group.add(new Torus({ z: -1, radius: .75, thickness: .01, color: colors.yellow, emissiveIntensity: 1 }))
  group.add(new Torus({ z: -1, radius: .8, thickness: .01, color: colors.notSoWhite }))

  PRNG.seed(6789402)
  const sizePicker = PRNG.createPicker([
    [1, 4],
    [2, 2],
    [4, 1],
  ])
  for (const { i } of range(8)) {
    const colorTop = PRNG.pick(colors)
    const colorBottom = PRNG.pick(colors)
    const satellite = new SmallGradientSphere({ z: -1, radius: .1 * sizePicker(), colorTop, colorBottom })
    satellite.rotation.set(PRNG.between(Math.PI * 2), PRNG.between(Math.PI * 2), PRNG.between(Math.PI * 2))
    group.add(satellite)
    satellite.satellite.set({
      radius: i === 0 ? .875 : PRNG.between(.25, .75) * lerp(1, 1.5, i),
      center: new Vector3(0, 0, -1 - .4 * i),
      turnVelocity: PRNG.between(.05, .25),
    })
    yield three.ticker.onTick(tick => {
      satellite.satellite.update(tick.deltaTime)
    })
  }

  const slash = new Group()
  slash.rotation.z = Math.PI * -.25
  group.add(slash)

  slash.add(new SmallGradientSphere({ x: -1.5, z: .5, singleColor: colors.yellow }))
  slash.add(new Torus({ x: -1.81, radius: .1, thickness: .01, color: colors.notSoWhite }))

  const ring = addTo(new Torus({ x: -2.315, radius: .2, thickness: .01, color: colors.notSoWhite }), slash)
  addTo(new Line({ x: -.2, thickness: .01, length: .4, shaded: true, color: colors.notSoWhite }), ring)

  slash.add(new SmallGradientSphere({ x: 1.7, z: .5, lerpIn: 0, lerpOut: 1 }))
  slash.add(new SmallGradientSphere({ x: 1.4, radius: .1, singleColor: colors.black }))
  const blacky = addTo(new Blacky({ x: 2.3 }), slash)
  addTo(new Torus({ radius: .43, thickness: .015, color: colors.black }), blacky)

  slash.add(new Line({ x: 1.5, thickness: .015, color: colors.black }))

  const antiSlash = new Group()
  antiSlash.rotation.z = Math.PI * .25
  group.add(antiSlash)

  antiSlash.add(new Line({ x: -1.6, thickness: .01, length: .35, shaded: true, color: colors.notSoWhite }))
  antiSlash.add(new Line({ x: 1.6, thickness: .01, length: .35, shaded: true, color: colors.notSoWhite }))

  const frontal = new Group()
  frontal.rotation.y = Math.PI * .5
  group.add(frontal)

  frontal.add(new Line({ x: -1.2, thickness: .01, length: .35, shaded: true, color: colors.notSoWhite }))
  frontal.add(new Line({ x: 1.2, thickness: .01, length: .35, shaded: true, color: colors.notSoWhite }))

  // loadTexture('https://threejs.org/examples/textures/equirectangular/royal_esplanade_1k.hdr')
  loadTexture('https://threejs.org/examples/textures/piz_compressed.exr')
    .then(texture => {
      texture.mapping = EquirectangularReflectionMapping
      blacky.material.envMap = texture
      blacky.material.envMapIntensity = .25
      blacky.material.envMapRotation.set(Math.PI * -.1, Math.PI, 0)
      blacky.material.roughness = .3
      blacky.material.metalness = .5
      blacky.material.needsUpdate = true

      mainSphere.material.envMap = texture
      mainSphere.material.roughness = .2
      mainSphere.material.envMapIntensity = .5
      mainSphere.material.envMapRotation.set(Math.PI * -.1, Math.PI, 0)
      mainSphere.material.needsUpdate = true
    })

  // const torus = new Torus({ shaded: true, radius: 7, thickness: 3, rotationX: Math.PI * .8, rotationY: Math.PI * -.25 })
  // torus.material = new MeshPhysicalMaterial({
  //   color: new Color('white').lerp(colors.red, .8),
  //   // emissive: colors.yellow,
  //   // emissiveIntensity: 1,
  //   transmission: 1,
  //   roughness: .1,
  //   thickness: 1,
  //   clearcoat: 1,

  //   ior: 1.5,
  // })
  // addTo(torus, group)

  const blackGroup = addTo(new Group(), group)
  blackGroup.rotation.z = Math.PI * .25
  class BlackCylinder extends Group {
    constructor(props: TransformProps) {
      super()
      const height = 5
      const radius = 15
      {
        const geometry = new CylinderGeometry(radius, radius, height, 6, 1, true).rotateY(Math.PI / 6)
        const material = new MeshPhysicalMaterial({
          color: new Color('white').lerp(colors.black, .995),
          side: BackSide,
          flatShading: true,
        })
        addTo(new Mesh(geometry, material), this)
      }
      {
        const geometry = new CylinderGeometry(radius, radius, height, 6, 60, true).rotateY(Math.PI / 6)
        const material = new MeshPhysicalMaterial({
          color: colors.black,
          wireframe: true,
          flatShading: true,
          side: BackSide,
        })
        addTo(new Mesh(geometry, material), this)
      }
      applyTransform(this, props)
    }
  }
  addTo(new BlackCylinder({ y: 7.8 }), blackGroup)
  addTo(new BlackCylinder({ y: -7.8 }), blackGroup)
}
