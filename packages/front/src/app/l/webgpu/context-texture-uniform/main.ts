'use client'

import { ThreeWebGPUContext } from 'some-utils-three/webgpu/experimental/context'
import { Tick, Ticker } from 'some-utils-ts/ticker'
import { DoubleSide, float, Fn, Group, instanceIndex, Mesh, MeshBasicNodeMaterial, PlaneGeometry, StorageTexture, texture, textureStore, uniform, uvec2, vec4 } from 'three/webgpu'

export class Main extends Group {
  static instances: Main[] = []
  static current() { return this.instances.at(-1) }

  parts = (() => {
    const width = 512, height = 512

    const uTime = uniform(float(0))
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
      const v4 = x.mul(x).add(y.mul(y), uTime.mul(1.2).sin()).sqrt().add(5.0, uTime.sin()).sin()
      const v = v1.add(v2, v3, v4)

      const r = uTime.mul(2).add(x.div(12).add(y.div(32))).sin().remap(-1, 1, 0, 1)
      const g = v.add(Math.PI).sin()
      const b = v.add(Math.PI).sub(0.5).sin()

      textureStore(storageTexture, indexUV, vec4(r, g, b, 1)).toWriteOnly()
    })

    uTime.onObjectUpdate(() => Ticker.get('three').time)

    const plane = new Mesh(
      new PlaneGeometry(),
      new MeshBasicNodeMaterial({
        side: DoubleSide,
        color: '#ffcc00',
      }))
    this.add(plane)

    const storageTexture = new StorageTexture(width, height)
    // @ts-ignore
    const computeNode = computeTexture({ storageTexture }).compute(width * height)
    // @ts-ignore
    plane.material.colorNode = texture(storageTexture)

    return { plane, computeNode }
  })()

  constructor() {
    super()
    Main.instances.push(this)
  }

  onDestroy = () => {
    Main.instances.splice(Main.instances.indexOf(this), 1)
  }

  onTick = (tick: Tick, three: ThreeWebGPUContext) => {
    three.renderer.computeAsync(this.parts.computeNode)
  }
}
