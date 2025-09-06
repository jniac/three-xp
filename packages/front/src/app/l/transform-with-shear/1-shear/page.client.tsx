'use client'
import { Quaternion, Vector3 } from 'three'

import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { setup } from 'some-utils-three/utils/tree'
import { RandomUtils as R } from 'some-utils-ts/random/random-utils'

import { MyObject } from '../shared'
import { composeMatrixWithShear, RoundTripTest } from '../shear'
import { UI } from './ui'

function MyScene() {
  useThreeWebGL(function* (three) {
    three.pipeline.basicPasses.fxaa.enabled = false
  })
  useGroup('my-scene', function* (group, three) {
    setup(new DebugHelper(), group)
      .regularGrid({ size: 12, subdivisions: [2, 6], opacity: [1, .1] })

    const simpleEntries = [{
      x: -5, y: 3, z: 0,
      xy: 1, xz: 0, yz: 0,
    }, {
      x: -2, y: 3, z: 0,
      xy: 0, xz: 1, yz: 0,
    }, {
      x: -3, y: 1, z: 0,
      xy: 0, xz: 0, yz: 1,
    }, {
      x: 1, y: 4, z: 0,
      xy: 1, xz: 1, yz: 0,
    }, {
      x: 4, y: 3, z: 0,
      xy: 0, xz: 1, yz: 1,
    }, {
      x: 1, y: 1, z: 0,
      xy: 1, xz: 0, yz: 1,
    }]

    for (const { x, y, z, xy, xz, yz } of simpleEntries) {
      const transform = {
        position: new Vector3(x, y, z),
        scale: new Vector3(1, 1, 1),
        rotation: new Quaternion(),
        shear: { xy, xz, yz },
      }
      const ok = RoundTripTest.transformToTransform(transform)
      const obj = setup(new MyObject(ok ? 'white' : 'red'), group)
      obj.matrixAutoUpdate = false
      composeMatrixWithShear(transform, obj.matrix)
    }

    R.setRandom('parkmiller', 5678)
    for (const { x, y, z, xy, xz, yz } of simpleEntries) {
      const transform = {
        position: new Vector3(x, y - 6, z),
        scale: new Vector3(R.number(.1, 2), R.number(.1, 2), R.number(.1, 2)),
        rotation: R.quaternion(new Quaternion()),
        shear: { xy, xz, yz },
      }
      const ok = RoundTripTest.transformToTransform(transform)
      const obj = setup(new MyObject(ok ? 'white' : 'red'), group)
      obj.matrixAutoUpdate = false
      composeMatrixWithShear(transform, obj.matrix)
    }

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
        rotation: ['15deg', '20deg', '0deg'],
        focus: [0, 0, .5],
      }}
    >
      <MyScene />
      <UI />
    </ThreeProvider>
  )
}
