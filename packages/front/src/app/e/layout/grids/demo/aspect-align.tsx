'use client'
import { useMemo } from 'react'

import { useEffects } from 'some-utils-react/hooks/effects'
import { Direction, Space } from 'some-utils-ts/experimental/layout/flex'
import { ObservableNumber } from 'some-utils-ts/observables'
import { onTick } from 'some-utils-ts/ticker'

import { useObservableValue } from 'some-utils-react/hooks/observables'
import { CanvasContext } from '../canvas-context'
import { colors } from '../colors'

const options = [
  {
    direction: Direction.Horizontal,
    aspect: 1,
  },
  {
    direction: Direction.Vertical,
    aspect: 2,
  },
  {
    direction: Direction.Vertical,
    aspect: 8,
  },
  {
    direction: Direction.Vertical,
    aspect: 1 / 2,
  },
  {
    direction: Direction.Horizontal,
    aspect: 1 / 2,
  },
  {
    direction: Direction.Horizontal,
    aspect: 1 / 4,
  },
]

export function AspectAlignDemo() {
  const indexObs = useMemo(() => new ObservableNumber(0), [])

  const { ref } = useEffects<HTMLDivElement>(function* (div) {
    const context = new CanvasContext(div.querySelector('canvas')!)

    const { direction, aspect } = options[indexObs.value]

    const root = new Space({
      direction,
      size: [context.width, context.height],
      spacing: 10,
      alignChildren: 1,
    })
      .add(
        new Space({
          alignChildren: .5,
          aspect,
          spacing: 10,
          userData: { color: colors.yellow },
        }).add(
          new Space({
            size: ['50%', '50%'],
          }),
          new Space({
            size: ['10%', '10%'],
          }),
        ),
        new Space({
          aspect,
          spacing: 10,
          userData: { color: colors.paleGreen },
        }).add(
          new Space(),
          new Space(),
        ),
        new Space({
          aspect,
          userData: { color: colors.magenta },
        }),
      )

    yield indexObs.onChange(value => {
      const { direction, aspect } = options[value]
      root.set({ direction })
      for (const space of root.children) {
        space.set({ aspect })
      }
    })

    yield onTick('layout', tick => {
      root.set({ alignChildren: tick.cos01Time({ frequency: 1 / 10 }) })
      root.get(2)!.set({ alignSelf: tick.cos01Time({ frequency: 3 / 10 }) })
      context.paint(root)
    })
  }, [])

  const next = () => {
    indexObs.value = (indexObs.value + 1) % options.length
  }

  return (
    <div ref={ref} className='flex flex-col justify-center gap-4' style={{ flex: '0 0 800px' }}>
      <canvas style={{ border: 'solid 2px #fff1' }} onClick={next} />
      <div className='text-center'>
        <div>
          <button
            className='border border-white rounded px-2 py-1'
            onClick={next}
          >
            <span>
              Direction: {Direction[options[useObservableValue(indexObs)].direction]},
            </span>
            &nbsp;
            <span>
              Aspect: {options[useObservableValue(indexObs)].aspect}
            </span>
          </button>
        </div>
        <p style={{ color: colors.magenta }}>
          <code>alignSelf</code> allows the children to override the parent&apos;s <code>alignChildren</code>.
        </p>
      </div>
    </div>
  )
}
