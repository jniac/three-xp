import { CylinderGeometry, Group, IcosahedronGeometry, Mesh, MeshBasicMaterial, MeshPhysicalMaterial } from 'three'

import { ShaderForge, vec3 } from 'some-utils-three/shader-forge'
import { applyTransform, TransformProps } from 'some-utils-three/utils/tranform'
import { glsl_easings } from 'some-utils-ts/glsl/easings'

import { Three } from '@/tools/three/webgl'

import { colors } from './colors'
import { createLights } from './lights'
import { createGradientRing, createRing } from './ring'
import { createSky } from './sky'
import { createMainSphere, createSmallGradientSphere } from './sphere'

function createBlacky(transformProps?: TransformProps) {
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
  const mesh = new Mesh(geometry, material)
  applyTransform(mesh, transformProps)
  return mesh
}

const defaultLineProps = {
  color: colors.black,
  thickness: .018,
  shaded: false,
  length: 1,
}
export function createLine(props?: TransformProps & Partial<typeof defaultLineProps>) {
  const {
    color,
    thickness,
    length,
    shaded,
    ...transformProps
  } = { ...defaultLineProps, ...props }
  const material = shaded
    ? new MeshPhysicalMaterial({ color })
    : new MeshBasicMaterial({ color })
  const geometry = new CylinderGeometry(thickness / 2, thickness / 2, length, 12, 1).rotateZ(Math.PI * .5)
  const mesh = new Mesh(geometry, material)
  applyTransform(mesh, transformProps)
  return mesh
}

export function* art(three: Three) {
  const { scene, camera } = three

  camera.fov = 25
  camera.updateProjectionMatrix()
  camera.position.set(0, 0, 10)

  const group = new Group()
  scene.add(group)
  yield () => group.removeFromParent()

  const rotate45 = new Group()
  rotate45.rotation.z = Math.PI * -.25
  group.add(rotate45)

  const lights = createLights()
  scene.add(lights)

  group.add(createMainSphere())

  group.add(createGradientRing({ z: -1 }))
  group.add(createRing({ z: -1, radius: .8, thickness: .01, color: colors.notSoWhite }))

  rotate45.add(createSmallGradientSphere({ x: -1.5, z: .5, singleColor: colors.yellow }))
  rotate45.add(createRing({ x: -1.81, radius: .1, thickness: .01, color: colors.notSoWhite }))
  rotate45.add(createRing({ x: -2.2, radius: .2, thickness: .01, color: colors.notSoWhite }))
  rotate45.add(createLine({ x: -2.5, color: colors.notSoWhite, thickness: .01, length: .45 }))

  rotate45.add(createSmallGradientSphere({ x: 1.7, z: .5, rotationZ: Math.PI * -.25 }))
  rotate45.add(createSmallGradientSphere({ x: 1.4, radius: .1, singleColor: colors.black }))
  rotate45.add(createBlacky({ x: 2.3 }))

  rotate45.add(createLine({ x: 1.5 }))

  scene.add(createSky())

}
