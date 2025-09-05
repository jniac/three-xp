'use client'

import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { setup } from 'some-utils-three/utils/tree'

import { TwinObject } from '../shared'
import { UI } from './ui'

function MyScene() {
  useThreeWebGL(function* (three) {
    three.pipeline.basicPasses.fxaa.enabled = false
  })
  useGroup('my-scene', function* (group, three) {
    setup(new DebugHelper(), group)
      .regularGrid({ size: 12, subdivisions: [2, 6], opacity: [1, .1] })

    const twin1 = setup(new TwinObject(), group)
    setup(twin1.objA, { x: 1, y: 4 })
    setup(twin1.objB, { x: -1, y: 4, rotation: ['0deg', '180deg', '0deg'] })

    const twin2 = setup(new TwinObject(), group)
    setup(twin2.objA, { x: 1, y: 2 })
    setup(twin2.objB, { x: -1, y: 2, rotation: ['90deg', '90deg', '0deg'] })

  }, [])
  return null
}

export function Client() {
  return (
    <ThreeProvider
      vertigoControls={{
        eventTarget: 'canvas',
        size: 12,
        zoom: 1,
        rotation: ['0deg', '0deg', '0deg'],
        focus: [0, 0, .5],
      }}
    >
      <MyScene />
      <UI />
    </ThreeProvider>
  )
}
