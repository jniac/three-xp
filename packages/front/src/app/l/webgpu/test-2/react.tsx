'use client'

import {
  float,
  Fn,
  instanceIndex,
  Mesh,
  MeshBasicMaterial,
  MeshBasicNodeMaterial,
  PlaneGeometry,
  StorageTexture,
  texture,
  textureStore,
  TorusGeometry,
  uvec2,
  vec4
} from 'three/tsl'

import { Three } from '../three'
import { useThree } from '../three-provider'

function* create(three: Three) {
  {
    const mesh = new Mesh(
      new TorusGeometry(),
      new MeshBasicMaterial({ color: 0xff0000 }))
    mesh.scale.setScalar(.15)
    three.scene.add(mesh)
    yield () => mesh.removeFromParent()
  }

  const width = 512, height = 512
  const storageTexture = new StorageTexture(width, height)

  // @ts-ignore
  const computeTexture = Fn(({ storageTexture }) => {
    const posX = instanceIndex.modInt(width)
    const posY = instanceIndex.div(width)
    const indexUV = uvec2(posX, posY)

    // https://www.shadertoy.com/view/Xst3zN

    const x = float(posX).div(50.0)
    const y = float(posY).div(50.0)

    const v1 = x.sin()
    const v2 = y.sin()
    const v3 = x.add(y).sin()
    const v4 = x.mul(x).add(y.mul(y)).sqrt().add(5.0).sin()
    const v = v1.add(v2, v3, v4)

    const r = v.sin()
    const g = v.add(Math.PI).sin()
    const b = v.add(Math.PI).sub(0.5).sin()

    textureStore(storageTexture, indexUV, vec4(r, g, b, 1)).toWriteOnly()
  })

  // @ts-ignore
  const computeNode = computeTexture({ storageTexture }).compute(width * height)
  three.renderer.compute(computeNode)

  const plane = new Mesh(
    new PlaneGeometry(),
    new MeshBasicNodeMaterial({
      colorNode: texture(storageTexture),
      side: 2,
    }))
  three.scene.add(plane)
  yield () => plane.removeFromParent()
}

export function Test2() {
  useThree(create, [])
  return (
    <div className='Test2'>
      <h1>Test 2</h1>
    </div>
  )
}