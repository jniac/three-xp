'use client'

import { ThreeProvider, useGroup } from 'some-utils-misc/three-provider'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { setup } from 'some-utils-three/utils/tree'
import { Rectangle } from 'some-utils-ts/math/geom/rectangle'

function distributeAspectHorizontallyMap(width: number, height: number, aspects: number[]) {
  const scaledRects = aspects.map(aspect => {
    const sq = Math.sqrt(aspect)
    return [sq, 1 / sq] as [number, number]
  })

  const totalWidth = scaledRects.reduce((sum, [w]) => sum + w, 0)
  const maxHeight = Math.max(...scaledRects.map(([_, h]) => h))
  const scale = Math.min(width / totalWidth, height / maxHeight)

  return scaledRects.map(([w, h]) => {
    return { width: w * scale, height: h * scale }
  })
}

function MyScene() {
  useGroup('my-scene', function* (group, three) {
    setup(new DebugHelper().regularGrid(), group)

    const helper = setup(new DebugHelper(), group)

    const rect = new Rectangle(0, 0, 4, 1)

    const aspects = [1 / 2.2, 4 / 3, 16 / 9, 9 / 16, 2, 1 / 8, 4]
    const colors = [
      '#ff4976',
      '#60b6c0',
      '#f58231',
      '#ffe119',
      '#ce5e9c',
      '#6e8af0',
      '#ff92c3',
    ]

    yield three.ticker.onTick(tick => {
      rect.height = tick.lerpSin01Time(2, 1, { frequency: 1 / 4 })
      helper.clear()
      helper.setTransformMatrix({
        x: -rect.width / 2,
        y: -rect.height / 2,
      })
      helper.rect(rect)

      const distributed = distributeAspectHorizontallyMap(rect.width, rect.height, aspects)
      const totalWidth = distributed.reduce((sum, { width }) => sum + width, 0)

      let ox = rect.x + (rect.width - totalWidth) / 2
      let oy = rect.y
      for (let i = 0; i < distributed.length; i++) {
        const { width, height } = distributed[i]
        const color = colors[i % colors.length]
        const x = ox
        const y = oy + (rect.height - height) / 2
        ox += width / 2
        ox += width / 2

        helper.rect({ x, y, width, height }, { color })
        helper.rect({ x, y, width, height }, { color, diagonals: true, inset: 0.02 })
      }
    })
  }, [])
  return null
}

export function PageClient() {
  return (
    <ThreeProvider
      vertigoControls={{
        size: 5,
      }}
    >
      <div className='p-8'>
        <h1 className='text-3xl font-bold'>
          Aspect Distribution
        </h1>
        <p>
          How to distribute rectangles of different aspect ratios and same area within a container.
        </p>
      </div>
      <MyScene />
    </ThreeProvider>
  )
}
