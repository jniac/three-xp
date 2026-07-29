'use client'

import { ThreeProvider, useThree } from 'some-utils-misc/three-provider'

import { HierarchyView } from 'some-utils-misc/hierarchy'
import { useEffects } from 'some-utils-react/hooks/effects'
import { MyScene } from './scene'

function MyUI() {
  const three = useThree()
  const { ref } = useEffects<HTMLDivElement>(async function* (div) {
    await three.ticker.waitNextTick()
    const hierarchy = new HierarchyView(three.scene)
    div.replaceChildren(hierarchy.div)
  }, [])

  return (
    <div className='fixed inset-0 thru p-8'>
      <div className='w-fit rounded-lg border border-white/20 bg-black/20 p-4 backdrop-blur-lg'>
        <h1>Hierarchy View</h1>
        <div ref={ref} />
      </div>
    </div>
  )
}

export default function PageClient() {
  return (
    <ThreeProvider
      // fxaa
      vertigoControls={{
        size: 17,
        // inputDOF: 'fixed',
      }}
    >
      <MyScene />
      {/* <MyUI /> */}
    </ThreeProvider>
  )
}