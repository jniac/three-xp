
'use client'

import { Space } from 'some-utils-ts/experimental/layout/flex'
import { RandomUtils } from 'some-utils-ts/random/random-utils'

import { createRootD4 } from '../../grids/demo/d4-positioning'
import { colors } from '../../shared/colors'
import { CanvasBlock, DrawMode } from '../../shared/flex-layout-demo'
import { useHash } from '../../shared/useHash'
import { layoutColorRule } from '../fit-children/demo/shared'
import { computeLayout3 } from '../flex-algo/computeLayout-3'

import '../../shared/flex-layout-demo.css'

function D0() {
  return (
    <CanvasBlock
      size={[800, 600]}
      colorRule={layoutColorRule}
      drawDirection
      root={[
        new Space({ size: [600, 200], offset: [100, 100], spacing: 10 }).add(
          new Space({ size: 100 }),
          new Space({ size: 50 }),
          new Space({ size: 50 }),
        ),
        new Space({ size: [600, 200], offset: [100, 320], spacing: 10 }).add(
          new Space({ aspect: 2 }),
          new Space({ size: '2fr' }),
          new Space({ aspect: 1 / 2 }),
        )

      ]}
      computeLayout={root => computeLayout3(root)}
      title={<h2>Basic</h2>}
    />
  )
}

function D1() {
  return (
    <CanvasBlock
      size={[800, 600]}
      colorRule={layoutColorRule}
      drawDirection
      root={
        new Space({
          size: [700, 500],
          offset: [50, 50],
          spacing: 10,
          direction: 'vertical',
        }).add(
          new Space({ spacing: 10 }).add(
            new Space({ size: [100, 50] }),
            new Space({ aspect: 1 }),
            new Space({ size: '3fr' }),
            new Space({ size: 50 }),
            new Space({ sizeX: 50 }),
          ),
          new Space({ spacing: 10 }).add(
            new Space({ aspect: 1, alignSelf: 1 }),
            new Space({ aspect: 1 }),
            new Space({ aspect: 1 / 2, direction: 'vertical', spacing: 10 }).populate(6),
            new Space({ aspect: 1 / 2, direction: 'vertical', spacing: 10 }).populate(6),
            new Space({ aspect: 1 }),
            new Space({ aspect: 1, alignSelfY: 0 }),
          ),
        )
      }
      computeLayout={root => computeLayout3(root)}
      title={<h2>(D1) Aspect</h2>}
    />
  )
}

function D2() {
  return (
    <CanvasBlock
      size={[800, 600]}
      colorRule={layoutColorRule}
      drawDirection
      root={
        new Space({
          size: [700, 500],
          offset: [50, 50],
          spacing: 10,
          direction: 'vertical',
        }).add(
          new Space({ spacing: 10 }).add(
            new Space({ spacing: 10, size: 'fit-content' }),
            new Space({ spacing: 10, size: 'fit-content' }),
            new Space({ spacing: 10, size: 'fit-content' }),
            new Space({ spacing: 10, size: 'fit-content' }).add(
              new Space({ size: [100, 50] }),
              new Space({ size: [50, 100] }),
              new Space({ size: [100, 50] }),
            ),
            new Space({ aspect: 1 }),
            new Space({ sizeY: '20%' }),
            new Space({ spacing: 10, size: 'fit-content', direction: 'vertical' }).add(
              new Space({ size: [100, 50] }),
              new Space({ size: [50, 50] }),
              new Space({ size: [100, 50] }),
            ),
          ),
          new Space({ spacing: 10, direction: 'vertical' }).add(
            new Space({ spacing: 10, size: 'fit-content' }),
            new Space({ spacing: 10, size: 'fit-content' }).add(
              new Space({ size: 100 }),
              new Space({ size: 100 }),
              new Space({ size: 100 }),
            ),
          ),
        )
      }
      computeLayout={root => computeLayout3(root)}
      title={<h2>(D2) "fit-children"</h2>}
      description='flat spaces with size "fit-children"'
    />
  )
}

function D3() {
  return (
    <CanvasBlock
      size={[800, 600]}
      colorRule={layoutColorRule}
      drawDirection
      root={
        new Space({
          size: [700, 500],
          offset: [50, 50],
          spacing: 10,
        }).add(
          new Space({ spacing: 10, enabled: false }).add(
            new Space({ spacing: 10, size: 'fit-content' }),
            new Space({ spacing: 10, size: 'fit-content' }).add(
              new Space({ size: 50 }),
              new Space({ size: 50 }),
              new Space({ size: 50 }),
            ),
          ),
          new Space({ spacing: 10 }).add(
            new Space({ spacing: 10, size: 'fit-content' }).add(
              new Space({ spacing: 10, size: 'fit-content', alignSelf: 0 }),
              new Space({ spacing: 10, size: 'fit-content' }).add(
                new Space({ size: 50 }),
                new Space({ size: [50, 100] }),
                new Space({ size: 50 }),
              ),
              new Space({
                userData: {
                  color: colors.yellow,
                  comment: 'must be shrunk: no available space for expansion'
                }
              }),
              new Space({ size: 50 }),
              new Space({ spacing: 10, size: 'fit-content', direction: 'vertical' }).add(
                new Space({ size: 50 }),
                new Space({ size: [100, 50] }),
                new Space({ size: 50 }),
              ),
            ),
          ),
        )
      }
      computeLayout={root => computeLayout3(root)}
      title={<h2>(D3) "fit-children"</h2>}
      description={
        <>
          <h2>Seems good:</h2>
          <ul>
            <li>disabled spaces are ignored</li>
            <li>nested "fit-children" spaces work</li>

          </ul>
        </>
      }
    />
  )
}

function createStressTestLayout([w, h]: [number, number]): Space {
  const spacing = 4
  const root = new Space({
    offset: [50, 50],
    size: [w - 100, h - 100],
    spacing,
  })
  computeLayout3(root)
  const depthMax = 10
  const nodeCountMax = 1e5
  let nodeCount = 1
  const queue = [root]
  while (nodeCount < nodeCountMax && queue.length > 0) {
    const current = queue.shift()!
    if (current.rect.area < 500)
      continue
    const direction = current.rect.aspect >= 1
    current.set({ direction })
    const childCount = 3
    nodeCount += childCount
    current.populate(childCount, { spacing })
    for (let i = 0; i < childCount; i++) {
      const size = RandomUtils.pick([1, 1, 3, 5, 10])
      current.children[i].sizeX.value = size
      current.children[i].sizeY.value = size
    }
    computeLayout3(current, current.rect)
    if (current.depth() < depthMax)
      queue.push(...current.children)
  }
  console.log(`${root.descendantsCount()} nodes (descendantsCount)`)
  console.log(`${root.leavesCount()} leaves (leavesCount)`)

  console.time('final layout')
  computeLayout3(root)
  console.timeEnd('final layout')
  return root
}

function DmDetached1() {
  const size = [800, 600]
  const root = new Space({
    size,
    spacing: 10,
  })
    .add(
      new Space({ spacing: 10 })
        .populate(3)
        .add(
          new Space({
            name: 'detached-1',
            positioning: 'detached',
            size: 200,
            alignSelf: .5,
            spacing: 10,
            userData: { color: colors.yellow },
          })
            .populate(3)
            .add({
              name: 'detached-1-child-1',
              positioning: 'detached',
              size: ['100%', 50],
            })
            .add({
              name: 'detached-1-child-2',
              positioning: 'detached',
              size: '50%',
              detachedSelfSpacingMode: 1,
            })
        ),
    )
  computeLayout3(root)
  return (
    <CanvasBlock
      title={<h2>(DDetached1) Detached positioning</h2>}
      description={
        <ul>
          <li>• alignSelf</li>
          <li>• detachedSelfSpacingMode</li>
        </ul>
      }
      size={size}
      root={root}
      computeLayout={root => computeLayout3(root)}
      onTick={(_, tick) => {
        root.find('detached-1')!.set({
          alignSelf: tick.sin01Time({ frequency: 1 / 4 }),
        })
        root.find('detached-1-child-1')!.set({
          alignSelf: tick.sin01Time({ frequency: 1 / 4 }),
        })
        root.find('detached-1-child-2')!.set({
          alignSelf: tick.sin01Time({ frequency: 1 / 4 }),
        })
      }}
    />
  )
}

function DmDetached2() {
  const size = [800, 600]
  const root = new Space({
    size,
    spacing: 10,
  })
    .add(
      new Space({ spacing: 10 })
        .populate(3, { direction: 'vertical', spacing: 10 })
        .add(
          new Space({
            positioning: 'detached',
            size: [200, 100],
            userData: { color: colors.yellow },
          }),
          new Space({
            name: 'detached-2',
            positioning: 'detached',
            size: [200, 100],
            offset: '-10%',
            userData: { color: colors.yellow },
          }),
          new Space({
            name: 'detached-3',
            positioning: 'detached',
            size: [200, 100],
            offset: '10%',
            userData: { color: colors.yellow },
          }),
        ),
    )
  root.get(0, 0)!.set({ offsetY: -40 })
  root.get(0, 2)!.set({ offsetY: 40 })
  root.get(0, 1)!.add(
    {
      size: ['100%', 40],
      offsetX: '-100%',
    },
    {
      size: ['100%', 40],
    },
    {

    },
    {
      size: ['100%', 40],
    },
    {
      size: ['100%', 40],
      offsetX: '100%',
    },
  )
  computeLayout3(root)
  return (
    <CanvasBlock
      title={<h2>(DDetached2) Detached positioning + offset</h2>}
      description={
        <ul>
        </ul>
      }
      size={size}
      root={root}
      computeLayout={root => computeLayout3(root)}
      onTick={(_, tick) => {
        root.find('detached-2')?.set({ offset: `${tick.lerpSin01Time(0, 100, { frequency: 1 / 4 })}%` })
        root.find('detached-3')?.set({ offset: `${tick.lerpSin01Time(0, -100, { frequency: 1 / 4 })}%` })
      }}
    />
  )
}

function DStress() {
  return (
    <CanvasBlock
      size={[1200, 1200]}
      drawMode={DrawMode.LeavesFill}
      // directionArrow
      root={createStressTestLayout}
      computeLayout={root => computeLayout3(root)}
      title={<h2>(DStress) Stresst test</h2>}
    />
  )
}

function DConformTo4_ref() {
  const { root, updateOnTick } = createRootD4(800, 600)
  return (
    <CanvasBlock
      title={<h2>(DConformTo4) ConformTo Reference</h2>}
      size={[800, 600]}
      drawMode={DrawMode.AllOutline}
      root={root}
      onTick={(_, tick) => updateOnTick(tick)}
    />
  )
}

function DConformTo4_new() {
  const { root, updateOnTick } = createRootD4(800, 600)
  return (
    <CanvasBlock
      size={[800, 600]}
      drawMode={DrawMode.AllOutline}
      // directionArrow
      root={root}
      computeLayout={root => computeLayout3(root)}
      onTick={(_, tick) => updateOnTick(tick)}
      title={<h2>(DConformTo4) ConformTo New (v3)</h2>}
    />
  )
}

function DDetachedAndFitChildren() {
  const size = [800, 600]
  const root = new Space({
    size,
    spacing: 10,
  })
    .add(
      new Space({ spacing: 10 })
        .populate(3)
        .add(
          new Space({
            name: 'detached-fit-children',
            positioning: 'detached',
            size: ['100%', 'fit-content'],
            alignSelf: .5,
            spacing: 10,
            userData: { color: colors.yellow },
          })
            .add(
              new Space({ size: [50, 50] }),
              new Space({ size: [50, 100] }),
              new Space({ size: [100, 50] }),
            )
        ),
    )
  console.log(root.find('detached-fit-children'))
  return (
    <CanvasBlock
      title={<h2>(DDetachedAndFitChildren) Detached + "fit-children"</h2>}
      description={
        <ul>
        </ul>
      }
      size={size}
      root={root}
      drawDirection
    />
  )
}

function getCanvasBlocks() {
  return [
    D0,
    D1,
    D2,
    D3,
    DStress,
    DmDetached1,
    DmDetached2,
    DConformTo4_ref,
    // DConformTo4_new,
    DDetachedAndFitChildren,
  ]
}

export function PageClient() {
  const [hash, setHash] =
    useHash('demo-4')
  // useHash()
  const hashIndex = parseInt(hash.replace('#demo-', '') || '-1')
  const blocks = getCanvasBlocks().filter((_, i) => hashIndex === -1 || hashIndex === i)
  return (
    <div className='FlexLayoutDemo p-16 h-screen overflow-auto'>
      <h1 className='text-3xl text-center font-bold'>
        computeLayout3()
      </h1>

      {blocks.map((Block, i) => (
        <div key={i} className='my-8' onClick={() => setHash(hashIndex === -1 ? `#demo-${i}` : null)}>
          <Block />
        </div>
      ))}
    </div>
  )
}