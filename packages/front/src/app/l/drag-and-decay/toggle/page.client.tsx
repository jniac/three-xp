'use client'

import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { setup } from 'some-utils-three/utils/tree'

import { loopArray } from 'some-utils-ts/iteration/loop'
import { BasicDemo } from './demo/basic'
import { ToggleDemo } from './demo/toggle'

function MyScene() {
  const three = useThreeWebGL()!
  useGroup('my-scene', function* (group) {
    three.pipeline.basicPasses.fxaa.enabled = false

    setup(new DebugHelper(), group)
      .regularGrid()
  })

  return null
}

export function PageClient() {
  return (
    <ThreeProvider
      vertigoControls={{
        fixed: true,
        size: 32,
        perspective: 0,
      }}
    >
      <div className='layer thru p-8'>
        <h1 className='text-2xl font-bold'>
          Decay
        </h1>
        <p className='mt-4 max-w-md'>
          Trying to combine mouse drag & mouse wheel to control a single object
          with multiple stop positions and decay.
        </p>
      </div>

      <MyScene />

      <BasicDemo x={-5} />
      {loopArray(4, it => {
        const damping = .001 ** (1 + it.i / 3)
        return (
          <ToggleDemo
            key={it.i}
            x={5 + it.i * 3}
            dragDamping={damping} />
        )
      })}
    </ThreeProvider>
  )
}
