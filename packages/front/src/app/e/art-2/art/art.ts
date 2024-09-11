import { CylinderGeometry, Group, IcosahedronGeometry, Mesh, MeshBasicMaterial, MeshPhysicalMaterial, Object3D, Vector3 } from 'three'

import { ShaderForge, vec3 } from 'some-utils-three/shader-forge'
import { applyTransform, TransformProps } from 'some-utils-three/utils/tranform'
import { glsl_easings } from 'some-utils-ts/glsl/easings'
import { range } from 'some-utils-ts/iteration/range'
import { lerp } from 'some-utils-ts/math/basic'
import { PRNG } from 'some-utils-ts/random/prng'
import { Destroyable } from 'some-utils-ts/types'

import { config } from '@/config'
import { Three } from '@/tools/three/webgl'

import { GradientRing, Torus } from './circular'
import { colors } from './colors'
import { Lights } from './lights'
import { RedSky } from './skies/red-sky'
import { MainSphere, SmallGradientSphere } from './sphere'

class Blacky extends Mesh {
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
      .fragment.top(glsl_easings)
      .fragment.after('map_fragment', /* glsl */`
      float fresnel = dot(vNormalWorld, vViewDir);
      vec3 inner = ${vec3(colors.white)};
      vec3 outer = ${vec3(colors.black)};
      diffuseColor.rgb = mix(inner, outer, easeInOut(1.0 - fresnel * fresnel, 2.0, 0.0));
    `)
    super(geometry, material)
    applyTransform(this, transformProps)
  }
}

export class Line extends Mesh {
  static defaultProps = {
    color: colors.black,
    thickness: .018,
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
  const { camera, ticker, scene } = three

  camera.fov = 25
  camera.updateProjectionMatrix()
  camera.position.set(0, 0, 10)

  ticker.set({ activeDuration: config.development ? 3 : 180 })

  const group = new Group()
  scene.add(group)
  yield () => {
    console.log('remove')
    group.removeFromParent()
  }

  return group
}

export function* art(three: Three) {
  const group = yield* setup(three)

  group.add(new RedSky())

  group.add(new Lights())

  group.add(new MainSphere())

  group.add(new GradientRing({ z: -1, radius: 1.4, innerRadiusRatio: .805 }))
  group.add(new Torus({ z: -1, radius: 1.05, thickness: .01, color: colors.notSoWhite }))
  group.add(new Torus({ z: -1, radius: .7, thickness: .01, color: colors.notSoWhite }))

  PRNG.seed(6789402)
  for (const { i } of range(8)) {
    const colorTop = PRNG.pick(colors)
    const colorBottom = PRNG.pick(colors)
    const satellite = new SmallGradientSphere({ z: -1, radius: .1, colorTop, colorBottom })
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

  slash.add(new SmallGradientSphere({ x: 1.7, z: .5, lerpIn: .3, lerpOut: .7 }))
  slash.add(new SmallGradientSphere({ x: 1.4, radius: .1, singleColor: colors.black }))
  slash.add(new Blacky({ x: 2.3 }))

  slash.add(new Line({ x: 1.5 }))

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
}
