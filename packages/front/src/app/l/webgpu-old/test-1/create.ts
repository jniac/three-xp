import {
  Fn,
  hash,
  instanceIndex,
  storage,
  vec3
} from 'three/tsl'
import {
  Color,
  IcosahedronGeometry,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  StorageInstancedBufferAttribute,
  TorusKnotGeometry,
} from 'three/webgpu'

import { useEffects } from 'some-utils-react/hooks/effects'
import { loop3 } from 'some-utils-ts/iteration/loop'

import { Three } from '@/tools/three/webgpu'

export function* createGrid(three: Three) {
  const w = 16, h = 16, d = 16
  // const w = 2, h = 2, d = 2
  const count = w * h * d

  // const size = new Vector3(1, 1, 6)
  const mesh = new InstancedMesh(
    new IcosahedronGeometry(.033, 3),
    new MeshBasicMaterial(),
    count)
  mesh.scale.setScalar(.2)

  const matrix = new Matrix4()
  const color = new Color('#fc0')
  for (const { i, x, y, z } of loop3([w, h, d])) {
    matrix.makeTranslation(x - w / 2, y - h / 2, z - d / 2)
    mesh.setMatrixAt(i, matrix)
    mesh.setColorAt(i, color)
  }

  const positionArray = new Float32Array(count * 3)
  const positionBuffer = storage(new StorageInstancedBufferAttribute(positionArray, 3), 'vec3', count)
  const colorBuffer = storage(new StorageInstancedBufferAttribute(new Float32Array(count * 3), 3), 'color', count)

  // @ts-ignore
  const computeInit = Fn(() => {
    const position = positionBuffer.element(instanceIndex) as any
    const color = colorBuffer.element(instanceIndex)
    const randX = hash(instanceIndex)
    const randY = hash(instanceIndex.add(2))
    const randZ = hash(instanceIndex.add(3))
    position.x = randX.mul(100).add(-50)
    position.y = randY.mul(10)
    position.z = randZ.mul(100).add(-50)
    color.assign(vec3(0, 1, 2))

    // @ts-ignore
  })().compute(count)

  // @ts-ignore
  const computeUpdate = Fn(() => {

    // @ts-ignore
  })().compute(count)

  three.renderer.compute(computeInit)

  three.ticker.onTick(() => {
    three.renderer.compute(computeInit)
  })

  three.scene.add(mesh)
  yield () => {
    mesh.removeFromParent()
  }

  return {
    mesh,
    positionArray,
    positionBuffer,
    colorBuffer,
  }
}

export function createContent(three: Three) {
  const knot = new Mesh(
    new TorusKnotGeometry(),
    new MeshBasicMaterial())
  three.scene.add(knot)
  knot.visible = false

  return {
    knot,
  }
}

export function Test1() {
  useEffects(function* () {

  }, [])
  return null
}