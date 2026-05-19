'use client'

import { ThreeProvider, useGroup } from 'some-utils-misc/three-provider'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { setup } from 'some-utils-three/utils/tree'

function MyScene() {
  useGroup('my-scene', function* (group) {
    setup(new DebugHelper(), group)
      .regularGrid()
  }, [])
  return null
}

export function PageClient() {
  return (
    <ThreeProvider
      vertigoControls={{
        size: 10,
      }}
    >
      <MyScene />
    </ThreeProvider>
  )
}