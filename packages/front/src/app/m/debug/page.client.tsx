
'use client'

import { Color, Group } from 'three'

import { ThreeInstance, ThreeProvider } from 'some-utils-misc/three-provider'
import { ThreeBaseContext } from 'some-utils-three/experimental/contexts/types'

import { DebugGroup } from './DebugGroup'

class Setup extends Group {
  *onInitialize(three: ThreeBaseContext) {
    three.scene.background = new Color('#555')
  }
}

export function PageClient() {
  return (
    <div className={`layer thru`}>
      <ThreeProvider
        vertigoControls={{
          size: 7,
          focus: [0, 0, 0],
        }}
      >
        <ThreeInstance value={Setup} />
        <ThreeInstance value={DebugGroup} />
      </ThreeProvider>
    </div>
  )
}
