'use client'

import { handlePointer } from 'some-utils-dom/handle/pointer'
import { useEffects } from 'some-utils-react/hooks/effects'
import { FuzzyRange } from 'some-utils-ts/math/easing/fuzzy-range'
import { Rectangle } from 'some-utils-ts/math/geom/rectangle'

import { saturate } from 'some-utils-ts/math/basic'
import { defaultRangeProps, RangeProps, settings } from './settings'

export function RangeClient(incomingProps: RangeProps) {
  const { ref } = useEffects<SVGPathElement>(function* (path) {
    const { width, height, padding } = settings
    const props = { ...defaultRangeProps, ...incomingProps }
    const svg = path.ownerSVGElement!
    const circle = svg.querySelector('circle')!
    yield handlePointer(svg, {
      onChange: info => {
        const p = Rectangle
          .from(svg.getBoundingClientRect())
          .shrink(padding)
          .toRelativePoint(info.position)
        p.x = saturate(p.x)
        p.y = 1 - p.y
        const y = FuzzyRange.dummy
          .from(props.range)
          .evaluate(p.x * props.length, props.ease)
        circle.setAttribute('cx', (p.x * width).toString())
        circle.setAttribute('cy', ((1 - y) * height).toString())
      },
    })
  }, [])

  return (
    <path ref={ref} />
  )
}