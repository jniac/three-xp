'use client'

import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { setup } from 'some-utils-three/utils/tree'
import { Message } from 'some-utils-ts/message'
import { Tick } from 'some-utils-ts/ticker'

import { Leak } from '@/utils/leak'
import { inverseLerp } from 'some-utils-ts/math/basic'
import { transition } from 'some-utils-ts/math/easing'
import { waveform } from 'some-utils-ts/math/waveform'
import { Euler } from 'three'
import { MyObject } from '../shared'
import { composeMatrixWithShear, createTransform, decomposeMatrixWithShear, lerpTransforms, RoundTripTest } from '../shear'
import { UI } from './ui'

export class Params {
  rotate = false
  constructor() {
    Message.on(Params, m => m.setPayload(this))
  }
}

function MyTest1() {
  useGroup('my-test-1', function* (group, three) {
    const transform = createTransform({
      position: [-2, 4, 0],
      scale: [1, 2, 3],
      // scale: [4, 1, 2],
      // euler: [0, 1, -1],
      shear: [1, 1, 0],
    })
    const ok = RoundTripTest.transformToTransform(transform)
    const obj = setup(new MyObject(ok ? 'white' : 'red'), group)
    obj.matrixAutoUpdate = false
    composeMatrixWithShear(transform, obj.matrix)

    const transform2 = decomposeMatrixWithShear(obj.matrix)
    console.log(transform2.position)
    console.log(transform2.scale)
    console.log(new Euler().setFromQuaternion(transform2.rotation))
    console.log(transform2.shear)

    const check = setup(new MyObject('yellow'), group)
    check.matrixAutoUpdate = false
    composeMatrixWithShear(transform2, check.matrix)
  }, [])

  return null
}

function MyTest2() {
  useGroup('my-test-2', function* (group, three) {
    const tranforms = [
      createTransform({
        position: [-2, -4, 0],
        scale: [2, 4, 1],
        euler: [1, 0, 2],
        shear: [1, 1, 0],
      }),
      createTransform({
        position: [2, -4, 0],
        scale: [4, 1, 2],
        euler: [0, 1, -1],
        shear: [0, 1, 0],
      }),
    ]

    const params = new Params()

    const [objA, objB] = tranforms.map(tranform => {
      const obj = setup(new MyObject(), group)
      obj.matrixAutoUpdate = false
      let rx = 1
      const update = () => {
        composeMatrixWithShear(tranform, obj.matrix)
      }
      update()

      // @ts-ignore
      obj.onTick = (tick: Tick) => {
        if (params.rotate)
          rx += tick.deltaTime
        update()
      }

      return obj
    })

    const objC = setup(new MyObject('yellow'), group)

    const transformA = decomposeMatrixWithShear(objA.matrix)
    const transformB = decomposeMatrixWithShear(objB.matrix)
    const transformC = decomposeMatrixWithShear(objC.matrix)
    yield three.ticker.onTick(tick => {
      let t = waveform.triangle(tick.time, { frequency: 1 / 4 })
      const m = .05
      t = inverseLerp(m, 1 - m, t)
      t = transition.inOut2(t)
      lerpTransforms(transformA, transformB, t, transformC)
      objC.matrixAutoUpdate = false
      objC.matrix = composeMatrixWithShear(transformC, objC.matrix)
    })

  }, [])

  return null
}

function MySettings() {
  useThreeWebGL(function* (three) {
    three.pipeline.basicPasses.fxaa.enabled = false
  })
  useGroup('my-settings', function* (group, three) {
    setup(new DebugHelper(), group)
      .regularGrid({ size: 12, subdivisions: [2, 6], opacity: [1, .1] })
  }, [])
  return null
}

export function Client() {
  return (
    <ThreeProvider
      vertigoControls={{
        eventTarget: 'canvas',
        size: 12,
        zoom: .7,
        rotation: ['8deg', '12deg', '0deg'],
        focus: [0, 0, .5],
      }}
    >
      <Leak />
      <MySettings />
      <MyTest1 />
      <MyTest2 />
      <UI />
    </ThreeProvider>
  )
}
