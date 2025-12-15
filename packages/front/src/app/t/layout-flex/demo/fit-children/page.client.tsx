'use client'


import { Direction, Space } from 'some-utils-ts/experimental/layout/flex'
import { lerp } from 'some-utils-ts/math/basic'
import { easing } from 'some-utils-ts/math/easing'

import { CanvasBlock } from '../../shared/flex-layout-demo'

import { createRootD4 } from '../../grids/demo/d4-positioning'
import { D3 } from './demo/d3'
import { D5, D5_Vertical } from './demo/d5'
import { D6 } from './demo/d6'

import '../../shared/flex-layout-demo.css'
import { useHash } from '../../shared/useHash'

function DemoD4() {
  const d4 = createRootD4(800, 600)
  return (
    <CanvasBlock
      size={[800, 600]}
      root={d4.root}
      computeLayout={root => root.computeLayout2()}
      title={<h2>D4 Positioning Demo</h2>}
      onTick={(_, tick) => {
        d4.updateOnTick(tick)
      }}
    />
  )
}

function getCanvasBlocks() {
  return [
    () => (
      <CanvasBlock
        size={[800, 200]}
        root={[
          new Space({
            offset: [20, 20],
            size: 'fit-children',
            spacing: 10,
          })
            .populate(3, { size: 100 })
          ,
          new Space({
            offset: [420, 20],
            size: 'fit-children',
            direction: 'vertical',
            spacing: 10,
            alignChildrenY: 1,
          })
            .populate(3, { size: [100, 20] })
          ,
        ]}
        computeLayout={root => root.computeLayout2()}
        title={<h2>Simple</h2>}
      />
    ),

    D3,
    D5,
    D5_Vertical,
    D6,

    () => (
      <CanvasBlock
        size={[800, 600]}
        root={[
          new Space({
            offset: [50, 50],
            size: [325, 500],
            spacing: 10,
          })
            .add(
              new Space(),
              new Space(),
              new Space({ size: ['2fr', '50%'], spacing: 10 }),
              new Space({ size: '10%', spacing: 10 }),
              new Space({ size: '10%', spacing: 10 }),
            )
          ,
          new Space({
            offset: [425, 50],
            size: [325, 500],
            spacing: 10,
            direction: 'vertical',
          })
            .add(
              new Space(),
              new Space(),
              new Space({ size: ['50%', '2fr'], spacing: 10 }),
              new Space({ size: '10%', spacing: 10 }),
              new Space({ size: '10%', spacing: 10 }),
            )
          ,
        ]}
        computeLayout={root => root.computeLayout2()}
        onTick={(roots, tick) => {
          const anim_fr = `${lerp(1, 3, tick.sin01Time({ frequency: 1 / 3 })).toFixed(4)}fr`
          for (const root of roots) {
            root.set({ alignChildren: tick.sin01Time({ frequency: 1 / 3 }) })
            root.get(2)!.set({
              size: (root.direction === Direction.Horizontal
                ? [anim_fr, '50%']
                : ['50%', anim_fr]) as any,
            })
            root.get(-1)?.set({ alignSelf: easing.transition.inOut5(tick.sin01Time({ frequency: 1 / 3 })) })
          }
        }}
        title={<h2>No fit children</h2>}
        description={<>computeLayout2 demo, support for regular sizes</>}
      />
    ),
    () => (
      <DemoD4 />
    )
  ]
}

export function PageClient() {
  const [hash, setHash] = useHash('#demo-4')
  const hashIndex = parseInt(hash.replace('#demo-', '') || '-1')
  const blocks = getCanvasBlocks().filter((_, i) => hashIndex === -1 || hashIndex === i)
  return (
    <div className='FlexLayoutDemo p-16 h-screen overflow-auto'>
      <h1 className='text-3xl text-center font-bold'>
        Fit Children
      </h1>

      {blocks.map((Block, i) => (
        <div key={i} className='my-8' onClick={() => setHash(hashIndex === -1 ? `#demo-${i}` : null)}>
          <Block />
        </div>
      ))}
    </div>
  )
}