
'use client'


import { Space } from 'some-utils-ts/experimental/layout/flex'

import { colors } from '../../shared/colors'
import { CanvasBlock, DrawMode } from '../../shared/flex-layout-demo'
import { useHash } from '../../shared/useHash'
import { layoutColorRule } from '../fit-children/demo/shared'
import { computeLayout3 } from '../flex-algo/computeLayout3'

import { RandomUtils } from 'some-utils-ts/random/random-utils'
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
            new Space({ spacing: 10, size: 'fit-children' }),
            new Space({ spacing: 10, size: 'fit-children' }),
            new Space({ spacing: 10, size: 'fit-children' }),
            new Space({ spacing: 10, size: 'fit-children' }).add(
              new Space({ size: [100, 50] }),
              new Space({ size: [50, 100] }),
              new Space({ size: [100, 50] }),
            ),
            new Space({ aspect: 1 }),
            new Space({ sizeY: '20%' }),
            new Space({ spacing: 10, size: 'fit-children', direction: 'vertical' }).add(
              new Space({ size: [100, 50] }),
              new Space({ size: [50, 50] }),
              new Space({ size: [100, 50] }),
            ),
          ),
          new Space({ spacing: 10, direction: 'vertical' }).add(
            new Space({ spacing: 10, size: 'fit-children' }),
            new Space({ spacing: 10, size: 'fit-children' }).add(
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
            new Space({ spacing: 10, size: 'fit-children' }),
            new Space({ spacing: 10, size: 'fit-children' }).add(
              new Space({ size: 50 }),
              new Space({ size: 50 }),
              new Space({ size: 50 }),
            ),
          ),
          new Space({ spacing: 10 }).add(
            new Space({ spacing: 10, size: 'fit-children' }).add(
              new Space({ spacing: 10, size: 'fit-children', alignSelf: 0 }),
              new Space({ spacing: 10, size: 'fit-children' }).add(
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
              new Space({ spacing: 10, size: 'fit-children', direction: 'vertical' }).add(
                new Space({ size: 50 }),
                new Space({ size: [100, 50] }),
                new Space({ size: 50 }),
              ),
            ),
          ),
        )
      }
      computeLayout={root => computeLayout3(root)}
      title={<h2>(D2) "fit-children"</h2>}
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

function D4() {
  return (
    <CanvasBlock
      size={[1200, 1200]}
      drawMode={DrawMode.LeavesFill}
      // directionArrow
      root={createStressTestLayout}
      computeLayout={root => computeLayout3(root)}
      title={<h2>(D4) Stress</h2>}
    />
  )
}

function getCanvasBlocks() {
  return [
    D0,
    D1,
    D2,
    D3,
    D4,
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