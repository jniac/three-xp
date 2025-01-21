'use client'

import { color, float, Fn, If, instanceIndex, mix, mx_noise_float, mx_worley_noise_float, saturation, texture, textureStore, uniform, uvec2, vec3, vec4 } from 'three/tsl'
import { DoubleSide, Group, Mesh, MeshBasicNodeMaterial, PlaneGeometry, StorageTexture, } from 'three/webgpu'

import { ThreeWebGPUContext } from 'some-utils-three/experimental/contexts/webgpu'
import { Tick, Ticker } from 'some-utils-ts/ticker'

export class Main extends Group {
  static instances: Main[] = []
  static current() { return this.instances.at(-1) }

  parts = (() => {
    const width = 512, height = 512

    const uTime = uniform(float(0))
    uTime.onObjectUpdate(() => Ticker.get('three').time)
    const uPhase = uniform(float(0))
    // @ts-ignore
    const computeTexture = Fn(({ storageTexture }) => {

      const posX = instanceIndex.modInt(width)
      const posY = instanceIndex.div(width)
      const indexUV = uvec2(posX, posY)

      // https://www.shadertoy.com/view/Xst3zN

      const x = float(posX).div(50.0)
      const y = float(posY).div(50.0)

      If(uPhase.equal(0), () => {
        const v1 = x.sin()
        const v2 = y.sin()
        const v3 = x.add(y).sin()
        const v4 = x.mul(x).add(y.mul(y), uTime.mul(1.2).sin()).sqrt().add(5.0, uTime.sin()).sin()
        const v = v1.add(v2, v3, v4)

        const r = uTime.mul(2).add(x.div(12).add(y.div(32))).sin().remap(-1, 1, 0, 1)
        const g = v.add(Math.PI).sin()
        const b = v.add(Math.PI).sub(0.5).sin()

        const c = saturation(vec3(r, g, b), uTime.sin().remap(-1, 1, -1, 1))

        textureStore(storageTexture, indexUV, vec4(c, 1)).toWriteOnly()
      }).Else(() => {
        const n = mx_worley_noise_float(vec3(x, y, uTime))
        const n2 = mx_noise_float(vec3(x, y, uTime).mul(.2)).remap(-.65, .65, 0, 1)
        const c = mix(color('red'), color('blue'), saturation(n2, 5))
        c.mixAssign(color('black'), n.oneMinus())

        textureStore(storageTexture, indexUV, vec4(c, 1)).toWriteOnly()
      })
    })

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

    return { plane, computeNode, uPhase }
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
