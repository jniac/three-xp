'use client'

import { ThreeProvider, useGroup, useThree } from 'some-utils-misc/three-provider'

import { HierarchyView } from 'some-utils-misc/hierarchy'
import { useEffects } from 'some-utils-react/hooks/effects'
import { DebugHelper } from 'some-utils-three/helpers/debug/debug-helper'
import { setup } from 'some-utils-three/utils/tree'
import { Butterfly } from '../Butterfly'

function MyScene() {
  const three = useThree()
  useGroup('my-scene', function* (group) {
    setup(new DebugHelper(), three.scene)
      .regularGrid({ color: '#888' })
    const helper = setup(new DebugHelper(), three.scene)

    const butterfly = setup(new Butterfly(), group)
    butterfly.assignDemoPath()
    helper.polyline(butterfly.state.path!.getPoints(100), { color: 'hsl(0, 0%, 100%)' })

    yield three.ticker.onTick(tick => {
      for (const [index, child] of group.children.entries()) {
        if (child instanceof Butterfly) {
          child.update(tick.deltaTime)
          helper.point(child.state.pathCurrentPoint, { key: `butterfly-${index}`, color: 'hsl(0, 0%, 100%)', size: .4, shape: 'circle' })
        }
      }
    })
  }, [])
  return null
}


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