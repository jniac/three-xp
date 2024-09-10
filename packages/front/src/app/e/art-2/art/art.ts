import { Group, IcosahedronGeometry, Mesh, MeshPhysicalMaterial } from 'three'

import { ShaderForge, vec3 } from 'some-utils-three/shader-forge'
import { applyTransform, TransformProps } from 'some-utils-three/utils/tranform'
import { glsl_easings } from 'some-utils-ts/glsl/easings'

import { Three } from '@/tools/three/webgl'

import { colors } from './colors'
import { createDisc } from './disc'
import { createLights } from './light'
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

export function* art(three: Three) {
  const { scene, camera } = three

  camera.fov = 25
  camera.updateProjectionMatrix()
  camera.position.set(0, 0, 10)

  const group = new Group()
  scene.add(group)
  yield () => group.removeFromParent()

  const lights = createLights()
  scene.add(lights)

  group.add(createMainSphere({ z: .5 }))

  group.add(createDisc({ z: -.5 }))

  group.add(createSmallGradientSphere({ x: -1.3, y: 1.3, z: .5, colorTop: colors.yellow }))
  group.add(createSmallGradientSphere({ x: 1.1, y: -1.1, z: .5, rotationZ: Math.PI * -.25 }))

  scene.add(createSky())

  scene.add(createBlacky({ x: 1.5, y: -1.5 }))
}
