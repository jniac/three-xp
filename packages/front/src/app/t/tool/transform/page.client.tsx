'use client'

import { ThreeProvider, useGroup } from 'some-utils-misc/three-provider'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { TransformTool } from 'some-utils-three/objects/tools'
import { setup } from 'some-utils-three/utils/tree'
import { BoxGeometry, Mesh } from 'three'

function MyScene() {
  useGroup('my-scene', function* (group) {
    setup(new DebugHelper().regularGrid(), group)

    setup(new TransformTool(), group)

    setup(new Mesh(new BoxGeometry()), group)
  }, [])
  return null
}

export default function PageClient() {
  return (
    <ThreeProvider
      vertigoControls={{
        size: 10,
        rotation: '-20deg, -30deg, 0',
      }}
    >
      <MyScene />
    </ThreeProvider>
  )
}