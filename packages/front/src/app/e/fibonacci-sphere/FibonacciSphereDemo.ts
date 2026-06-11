import { BufferAttribute, BufferGeometry, Points, PointsMaterial } from 'three'

import { getFibonacciSphereSamplesArray } from 'some-utils-three/misc/fibonacci-sphere-samples'
import { exponentialLerp } from 'some-utils-ts/math/basic'
import { Tick } from 'some-utils-ts/ticker'

export class FibonacciSphereDemo extends Points {
  time = 0
  n = 1
  array: Float32Array
  positionAttribute: BufferAttribute

  constructor(n = 1000, material = new PointsMaterial({ size: .1 })) {
    const geometry = new BufferGeometry()
    const array = getFibonacciSphereSamplesArray(n)
    const positionAttribute = new BufferAttribute(array, 3)
    geometry.setAttribute('position', positionAttribute)
    super(geometry, material)
    this.array = array
    this.positionAttribute = positionAttribute
  }

  onTick(tick: Tick) {
    if (this.visible === false)
      return

    const time = this.time + tick.deltaTime
    const t = Math.cos(time * .3) * .5 + .5
    const n = exponentialLerp(1000, 1, t)

    getFibonacciSphereSamplesArray(n, { out: this.array })
    this.geometry.setDrawRange(0, Math.floor(n))
    this.positionAttribute.needsUpdate = true

    this.time = time
    this.n = n
  }
}
