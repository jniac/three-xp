import { CircleGeometry, Group, IcosahedronGeometry, Mesh, MeshPhysicalMaterial } from 'three'

import { applyTransform, TransformProps } from 'some-utils-three/utils/tranform'

import { Three } from '@/tools/three/webgl'

import { createLights } from './light'
import { createSky } from './sky'

function createBlacky(transformProps?: TransformProps) {
  const geometry = new IcosahedronGeometry(.3, 12)
  const material = new MeshPhysicalMaterial({})
  const mesh = new Mesh(geometry, material)
  applyTransform(mesh, transformProps)
  return mesh
}

export function* art(three: Three) {
  const { scene, camera } = three

  camera.fov = 25
  camera.position.set(0, 0, 10)
  camera.updateProjectionMatrix()

  const group = new Group()
  scene.add(group)
  yield () => mesh.removeFromParent()

  const lights = createLights()
  scene.add(lights)

  const mesh = new Mesh(
    new IcosahedronGeometry(1, 12),
    new MeshPhysicalMaterial({}))
  group.add(mesh)

  const disc = new Mesh(
    new CircleGeometry(1.2, 128),
    new MeshPhysicalMaterial({}))
  group.add(disc)

  scene.add(createSky())

  const diag = 1.3
  scene.add(createBlacky({ x: diag, y: -diag }))
}
