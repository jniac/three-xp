'use client'


import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { setup } from 'some-utils-three/utils/tree'
import { onTick } from 'some-utils-ts/ticker'

import { ThreeProvider, useGroup, useThree } from '@/tools/three-provider'
import { leak } from '@/utils/leak'

import { SkyMesh } from 'some-utils-three/objects/sky-mesh'
import { CirclePlane } from './circle-plane'

function Stage() {
  useGroup('four-circles', function* (group) {
    setup(new SkyMesh(), group)

    const d = 2.1
    setup(new CirclePlane, {
      parent: group,
      position: [d, d, 0],
    })
    setup(new CirclePlane, {
      parent: group,
      position: [d, -d, 0],
    })
    setup(new CirclePlane, {
      parent: group,
      position: [-d, -d, 0],
    })
    setup(new CirclePlane, {
      parent: group,
      position: [-d, d, 0],
    })
  }, [])
  return null
}

function Controller() {
  useThree(function* (three) {
    leak({ three })
    const controls = new VertigoControls({
      size: 10,
      perspective: 0,
    })
    yield controls.initialize(three.renderer.domElement)
    yield onTick('three', tick => {
      const { aspect, camera } = three
      controls.update(camera, aspect, tick.deltaTime)
    })
  }, [])
  return null
}

export function Main() {
  return (
    <div>
      <ThreeProvider>
        <Controller />
        <Stage />
      </ThreeProvider>
    </div>
  )
}