import { CylinderGeometry, Group, IcosahedronGeometry, Mesh, MeshBasicMaterial, MeshPhysicalMaterial } from 'three'

import { ShaderForge, vec3 } from 'some-utils-three/shader-forge'
import { applyTransform, TransformProps } from 'some-utils-three/utils/tranform'
import { glsl_easings } from 'some-utils-ts/glsl/easings'

import { Three } from '@/tools/three/webgl'

import { colors } from './colors'
import { Lights } from './lights'
import { GradientRing, Ring, Torus } from './ring'
import { Sky } from './sky'
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
      diffuseColor.rgb = mix(inner, outer, easeInout(1.0 - fresnel * fresnel, 2.0, 0.0));
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

export function* art(three: Three) {
  const { scene, camera } = three

  camera.fov = 25
  camera.updateProjectionMatrix()
  camera.position.set(0, 0, 10)

  const group = new Group()
  scene.add(group)
  yield () => group.removeFromParent()

  scene.add(new Sky())

  const slash = new Group()
  slash.rotation.z = Math.PI * -.25
  group.add(slash)

  scene.add(new Lights())

  group.add(new MainSphere())

  group.add(new GradientRing({ z: -1, radius: 1.4, innerRadiusRatio: .805 }))
  group.add(new Ring({ z: -1, radius: .8, thickness: .01, color: colors.notSoWhite }))

  slash.add(new SmallGradientSphere({ x: -1.5, z: .5, singleColor: colors.yellow }))
  slash.add(new Torus({ x: -1.81, radius: .1, thickness: .01, color: colors.notSoWhite }))
  slash.add(new Torus({ x: -2.2, radius: .2, thickness: .01, color: colors.notSoWhite }))
  slash.add(new Line({ x: -2.5, thickness: .01, length: .45, shaded: true, color: colors.notSoWhite }))

  slash.add(new SmallGradientSphere({ x: 1.7, z: .5 }))
  slash.add(new SmallGradientSphere({ x: 1.4, radius: .1, singleColor: colors.black }))
  slash.add(new Blacky({ x: 2.3 }))

  slash.add(new Line({ x: 1.5 }))

  const antiSlash = new Group()
  antiSlash.rotation.z = Math.PI * .25
  group.add(antiSlash)

  antiSlash.add(new Line({ x: -1.6, thickness: .01, length: .35, shaded: true, color: colors.notSoWhite }))
  antiSlash.add(new Line({ x: 1.6, thickness: .01, length: .35, shaded: true, color: colors.notSoWhite }))
}
