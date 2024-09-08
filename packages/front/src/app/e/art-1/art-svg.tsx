'use client'

import { Vector2 } from 'three'

import { handlePointer } from 'some-utils-dom/handle/pointer'
import { useLayoutEffects } from 'some-utils-react/hooks/effects'
import { inverseLerpUnclamped, lerpUnclamped, remap } from 'some-utils-ts/math/basic'
import { ObservableNumber } from 'some-utils-ts/observables'
import { Ticker } from 'some-utils-ts/ticker'

import { colors } from './colors'

export function ArtSvg() {
  const CENTER_CIRCLE_COUNT = 24
  const CIRCLE_THICKNESS = 90

  const { ref } = useLayoutEffects<HTMLDivElement>(function* (div) {
    const svg = div.querySelector('svg')!

    const timeObs = new ObservableNumber(0)
    const thicknessObs = new ObservableNumber(CIRCLE_THICKNESS)
    const circles = [...svg.querySelectorAll('circle')]
    const centers = circles.map(() => new Vector2())
    yield handlePointer(document.documentElement, {
      onChange: info => {
        const { x, y } = info.position
        const rect = div.getBoundingClientRect()
        centers[0].x = lerpUnclamped(-512, 512, inverseLerpUnclamped(rect.right, rect.left, x))
        centers[0].y = lerpUnclamped(-512, 512, inverseLerpUnclamped(rect.bottom, rect.top, y))

        // timeObs.set(0)
      },
      onDown: () => {
        timeObs.set(0)
        thicknessObs.set(CIRCLE_THICKNESS * .7)
        for (let i = 1; i < CENTER_CIRCLE_COUNT; i++) {
          centers[i].copy(centers[i - 1])
        }
      },
    })

    yield Ticker.current().onTick(tick => {
      timeObs.increment(tick.deltaTime)
      const t = timeObs.get()
      const tIn = 1, tOut = 2
      const thickness = t < tIn ? CIRCLE_THICKNESS : 0
      const rate = t < tIn ? .9 : remap(t, tIn, tOut, 0, .9)
      thicknessObs.exponentialGrow(thickness, [rate, .2], tick.deltaTime)

      for (let i = 0; i < CENTER_CIRCLE_COUNT; i++) {
        const circle = circles[i]
        const center = centers[i]
        if (i > 0) {
          center.lerp(centers[i - 1], .1)
        }
        circle.setAttribute('cx', center.x.toString())
        circle.setAttribute('cy', center.y.toString())
        circle.setAttribute('stroke-width', thicknessObs.get().toFixed(3))
      }
    })
  }, [CENTER_CIRCLE_COUNT])

  return (
    <div
      ref={ref}
      className='absolute inset-0'
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='-512 -512 1024 1024'
        className='w-full h-full'
      >
        {Array.from({ length: CENTER_CIRCLE_COUNT }).map((_, i) => (
          <circle
            key={i}
            cx='0'
            cy='0'
            r={CIRCLE_THICKNESS * (i * .99 + .25)}
            fill='none'
            stroke={colors[(i + 1) % colors.length]}
            strokeWidth={CIRCLE_THICKNESS}
          />
        ))}

      </svg>
    </div>
  )
}
