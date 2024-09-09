'use client'

import { Vector2 } from 'three'

import { handlePointer } from 'some-utils-dom/handle/pointer'
import { regularPolygon } from 'some-utils-dom/svg/points'
import { useLayoutEffects } from 'some-utils-react/hooks/effects'
import { remap } from 'some-utils-ts/math/basic'
import { Observable, ObservableNumber } from 'some-utils-ts/observables'
import { PRNG } from 'some-utils-ts/random/prng'
import { Ticker } from 'some-utils-ts/ticker'

import { useMemo } from 'react'
import { Message } from 'some-utils-ts/message'
import { colors } from './colors'

export enum LineShape {
  Circle = 'circle',
  Rectangle = 'rectangle',
}

function createArtParts() {
  const lineShapeObs = new Observable(LineShape.Circle)
  return { lineShapeObs }
}

export type SvgArtParts = ReturnType<typeof createArtParts>

export function ArtSvg() {
  const COUNT = 20
  const THICKNESS = 120
  const artParts = useMemo(createArtParts, [])

  const { ref } = useLayoutEffects<HTMLDivElement>(function* (div) {
    const svg = div.querySelector('svg')!
    const circles = [...svg.querySelectorAll('circle')]
    const rectangles = [...svg.querySelectorAll('polygon')]

    yield Message.on('REQUIRE:ART_PARTS', message => {
      message.payloadAssign(artParts)
    })

    const { lineShapeObs } = artParts
    lineShapeObs.onChange({ executeImmediately: true }, value => {
      if (value === LineShape.Circle) {
        svg.querySelector('.rectangles')!.setAttribute('style', 'display: none')
        svg.querySelector('.circles')!.removeAttribute('style')
      } else {
        svg.querySelector('.rectangles')!.removeAttribute('style')
        svg.querySelector('.circles')!.setAttribute('style', 'display: none')
      }
    })

    const timeObs = new ObservableNumber(0)
    const thicknessObs = new ObservableNumber(THICKNESS)
    const pointer = new Vector2()
    const centers = circles.map(() => new Vector2())
    yield handlePointer(document.documentElement, {
      onChange: info => {

        // timeObs.set(0)
      },
      onDrag: info => {
        const { x, y } = info.position
        const rect = div.getBoundingClientRect()
        pointer.x = remap(x, rect.left, rect.right, -512, 512)
        pointer.y = remap(y, rect.top, rect.bottom, -512, 512)
      },
      onDown: () => {
        timeObs.set(0)
        thicknessObs.set(THICKNESS * .7)
        pointer.set(0, 0)
        for (let i = 0; i < COUNT; i++) {
          centers[i].copy(pointer)
        }
      },
    })

    yield Ticker.current().onTick(tick => {
      timeObs.increment(tick.deltaTime)
      const t = timeObs.get()
      const tIn = 1, tOut = 2
      const thickness = t < tIn ? THICKNESS : 0
      const rate = t < tIn ? .999 : remap(t, tIn, tOut, 0, .9)
      thicknessObs.exponentialGrow(thickness, [rate, .2], tick.deltaTime)

      for (let i = 0; i < COUNT; i++) {
        const circle = circles[i]
        const center = centers[i]
        center.lerp(i === 0 ? pointer : centers[i - 1], .1)
        circle.setAttribute('cx', center.x.toString())
        circle.setAttribute('cy', center.y.toString())
        circle.setAttribute('stroke-width', thicknessObs.get().toFixed(3))

        const rect = rectangles[i]
        rect.setAttribute('transform', `translate(${center.x},${center.y})`)
        rect.setAttribute('stroke-width', thicknessObs.get().toFixed(3))
      }
    })
  }, [COUNT])

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
        <g
          className='circles'
          style={{ display: artParts.lineShapeObs.is(LineShape.Circle) ? '' : 'none' }}
        >
          {Array.from({ length: COUNT }).map((_, i) => (
            <circle
              key={i}
              cx='0'
              cy='0'
              r={THICKNESS * (i * .99 + .25)}
              fill='none'
              stroke={colors[(i + 1) % colors.length]}
              strokeWidth={THICKNESS}
            />
          ))}
        </g>
        <g
          className='rectangles'
          style={{ display: artParts.lineShapeObs.is(LineShape.Rectangle) ? '' : 'none' }}
        >
          {Array.from({ length: COUNT }).map((_, i) => {
            PRNG.seed(i + 4)
            const size = (i + .25) * (THICKNESS - 1) * 2
            return (
              <polygon
                key={i}
                points={regularPolygon({ count: 4, r: size * Math.SQRT1_2 })}
                fill='none'
                stroke={PRNG.pick(colors, null, { indexOffset: 1 })}
                strokeWidth={THICKNESS}
              />
            )
          })}
        </g>
      </svg>
    </div>
  )
}
