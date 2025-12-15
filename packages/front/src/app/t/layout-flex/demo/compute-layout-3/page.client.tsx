
'use client'


import { Space } from 'some-utils-ts/experimental/layout/flex'

import { CanvasBlock } from '../../shared/flex-layout-demo'
import { useHash } from '../../shared/useHash'
import { layoutColorRule } from '../fit-children/demo/shared'
import { computeLayout3 } from '../flex-algo/computeLayout3'

import '../../shared/flex-layout-demo.css'

function D0() {
  return (
    <CanvasBlock
      size={[800, 600]}
      colorRule={layoutColorRule}
      directionArrow
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
      directionArrow
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
            new Space({ aspect: 1 / 2 }),
            new Space({ aspect: 1 / 2 }),
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
      directionArrow
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
      title={<h2>(D2) Aspect</h2>}
    />
  )
}

function getCanvasBlocks() {
  return [
    D0,
    D1,
    D2,
  ]
}

export function PageClient() {
  const [hash, setHash] =
    useHash('demo-2')
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