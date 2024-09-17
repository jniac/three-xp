'use client'

import 'katex/dist/katex.min.css'
import { BlockMath } from 'react-katex'
import { Vector2 } from 'three'

import { handleAnyUserInteraction } from 'some-utils-dom/handle/anyUserInteraction'
import { useEffects } from 'some-utils-react/hooks/effects'
import { PRNG } from 'some-utils-ts/random/prng'
import { Ticker } from 'some-utils-ts/ticker'

type Curve2D = {
  (out: { x: number, y: number }, t: number): void
  (out: { x: number, y: number }, t: number, options?: Record<string, number>): void
}

const looping = (out: { x: number, y: number }, t: number, {
  h = .3,
  w = 1,
  p = 3,
  q = 1,
  a = .3,
} = {}) => {
  const t2 = t ** q
  out.x = (t + a * Math.sin(t2 * Math.PI * 2)) * w
  out.y = h * Math.pow(Math.sin(t2 * Math.PI), p)
}

const getPoints = (() => {
  const p = new Vector2()
  return function getPoints(curve: Curve2D, samples = 300) {
    return Array.from({ length: (samples + 1) }, (_, i) => {
      curve(p, i / samples)
      return `${p.x.toFixed(5)},${p.y.toFixed(5)}`
    }).join(' ')
  }
})()

function Polyline({
  samples = 300,
  curve = ((out, t) => {
    out.x = t
    out.y = t
  }) as Curve2D,
  color = '#fff',
} = {}) {
  const points = getPoints(curve, samples)

  const { ref } = useEffects<SVGCircleElement>(function* (circle) {
    const p = new Vector2()
    yield Ticker.current().onTick(tick => {
      const t = (tick.time * .5) % 1
      curve(p, t)
      circle.setAttribute('cx', p.x.toFixed(5))
      circle.setAttribute('cy', p.y.toFixed(5))
    })
  }, [])

  return (
    <>
      <polyline stroke={color} points={points} opacity={.25} />
      <circle ref={ref} cx={0} cy={0} r={.5 / 100} fill={color} stroke='none' />
    </>
  )
}

function Formula() {
  return (
    <div className='absolute inset-0 text-xs p-4'>
      <BlockMath math={String.raw`t_2 = t^q`} />
      <BlockMath math={String.raw`x(t) = w \cdot \left( t + a \cdot \sin(2 \pi \cdot t_2) \right)`} />
      <BlockMath math={String.raw`y(t) = h \cdot \left( \sin(\pi \cdot t_2) \right)^p`} />
    </div>
  )
}

export function SvgDemo() {
  useEffects(function* () {
    yield handleAnyUserInteraction(Ticker.current().requestActivation)
  }, [])

  const center = new Vector2(.5, .5)
  const size = new Vector2(1, 1)
  const padding = .05
  const viewBox = `${center.x - size.x / 2 - padding} ${center.y - size.y / 2 - padding} ${size.x + padding * 2} ${size.y + padding * 2}`

  PRNG.reset()
  return (
    <div className='relative self-start'>
      <Formula />
      <svg viewBox={viewBox} width={400} style={{ border: '1px solid #fff3', borderRadius: '.25em' }}>
        <g transform='scale(1, -1) translate(0, -1)'>
          <g stroke='#fff2' strokeWidth={.2 / 100}>
            <line x1={-10} x2={10} />
            <line y1={-10} y2={10} />
          </g>
          <g id='curves' stroke='#fff' fill='none' strokeWidth={.2 / 100}>
            {Array.from({ length: 10 }, (_, i) => {
              const p = PRNG.between(3, 5)
              const q = PRNG.between(1 / 3, 1.5)
              const h = PRNG.between(.1, .5)
              const a = PRNG.between(.2, .3)
              const color = `hsl(${PRNG.between(0, 120)}, 100%, 70%)`
              const curve: Curve2D = (out, t) => looping(out, t, { a, p, h, q })
              return (
                <Polyline key={i} curve={curve} color={color} />
              )
            }
            )}
            <Polyline curve={looping} />
          </g>
        </g>
      </svg>
    </div>
  )
}
