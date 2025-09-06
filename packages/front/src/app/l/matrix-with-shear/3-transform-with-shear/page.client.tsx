'use client'

import { ColorRepresentation, Vector3 } from 'three'

import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { TransformWithShear } from 'some-utils-three/experimental/transform-with-shear'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { setup } from 'some-utils-three/utils/tree'
import { inverseLerp } from 'some-utils-ts/math/basic'
import { transition } from 'some-utils-ts/math/easing'
import { waveform } from 'some-utils-ts/math/waveform'
import { Message } from 'some-utils-ts/message'
import { onTick } from 'some-utils-ts/ticker'

import { Leak } from '@/utils/leak'

import { MyObject } from '../shared'
import { UI } from './ui'

class MySuperObject extends MyObject {
  transform = new TransformWithShear()
  constructor(color = 'white' as ColorRepresentation) {
    super(color)
    this.matrixAutoUpdate = false
  }
  setTransform(arg: Parameters<TransformWithShear['from']>[0]): this {
    this.transform.from(arg)
    this.transform.toMatrix(this.matrix)
    return this
  }
}

export class Params {
  negateMatrix = false
  constructor() {
    Message.on(Params, m => m.setPayload(this))
  }
}

function MyTest1() {
  useGroup('my-test-1', function* (group, three) {
    const params = new Params()

    // Object A: defined by position, rotation, scale, shear (transform props)
    const objA = setup(new MySuperObject('yellow'), group)
      .setTransform({
        position: [-2, -3, -1],
        scale: [3, 2, 1],
        rotation: ['30deg', '-120deg', '10deg'],
        shear: [.1, .2, .3],
      })

    // Object B: defined by basis vectors (matrix)
    const objB = setup(new MySuperObject('cyan'), group)

    const objC = setup(new MySuperObject('white'), group)

    yield onTick('three', tick => {
      const u = new Vector3(0, 1, -.5)
      const v = new Vector3(0, .5, 3)
      const w = new Vector3(2.5, 0, .5)

      if (params.negateMatrix)
        w.negate()

      objB
        .matrix
        .makeBasis(u, v, w)
        .setPosition(new Vector3(1, 2, -1))
      objB.transform.from(objB.matrix)

      const m = .05
      const t = transition.inOut4(inverseLerp(m, 1 - m, waveform.triangle(tick.time, { f: 1 / 5 })))
      objC.transform.lerpTransforms(objA.transform, objB.transform, t)
      objC.transform.toMatrix(objC.matrix)
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
      <UI />
    </ThreeProvider>
  )
}
