import { SVGProps } from 'react'

import { evaluateTrack, gaussianFilter as gf } from 'some-utils-ts/math/misc/track-utils'

import { XpMetadata } from '@/types'

const defaultPlotProps = {
  fn: (x: number) => x,
  subdivisions: 400,
}

type PlotProps = Partial<typeof defaultPlotProps> & SVGProps<SVGPolylineElement>

function Plot(props: PlotProps) {
  const { fn, subdivisions, ...rest } = { ...defaultPlotProps, ...props }
  const points = Array.from({ length: subdivisions }, (_, i) => i / (subdivisions - 1))
  const path = points.map(x => {
    const y = 1 - fn(x)
    return `${x.toFixed(4)},${y.toFixed(4)}`
  }).join(' ')
  return (
    <polyline {...rest} points={path} />
  )
}

function Graph({
  padding = .33,
}) {
  const track1 = (t: number) => evaluateTrack(t, [
    [0, 0],
    [.2, 0],
    [.4, .45],
    [.6, .55],
    [.8, 1],
    [1, 1],
  ])
  const track1g = (t: number) => gf(track1, t, { samples: 19, spread: .1 })

  const track2 = (t: number) => evaluateTrack(t, [
    [0, .2],
    [.2, .3],
    [.4, .6],
    [.6, .4],
    [.8, .7],
    [1, 0],
  ])

  return (
    <svg viewBox={`${-padding} ${-padding} ${1 + padding * 2} ${1 + padding * 2}`} className='w-full h-full'>
      <g fill='none' strokeWidth={.0015}>
        <g stroke='#ccc' opacity={.33}>
          <line x1={-1} x2={2} y1={1} y2={1} />
          <line x1={0} x2={0} y1={-1} y2={2} />
          <g opacity={.5}>
            <line x1={-1} x2={2} y1={0} y2={0} />
            <line x1={1} x2={1} y1={-1} y2={2} />
          </g>
        </g>
        <g>
          <Plot stroke='hsla(210, 50%, 14%, 1.00)' fn={track1g} strokeWidth={20 / 1000} />
          <Plot stroke='hsla(210, 100%, 87%, 1.00)' fn={track1} strokeWidth={1 / 1000} />

          <Plot stroke='hsla(104, 50%, 7%, 1.00)' fn={t => gf(track2, t, { samples: 19, spread: .2 })} strokeWidth={10 / 1000} />
          <Plot stroke='hsla(104, 50%, 14%, 1.00)' fn={t => gf(track2, t, { samples: 19, spread: .1 })} strokeWidth={4 / 1000} />
          <Plot stroke='hsla(104, 50%, 34%, 1.00)' fn={t => gf(track2, t, { samples: 19, spread: .025 })} strokeWidth={2 / 1000} />
          <Plot stroke='hsla(104, 100%, 87%, 1.00)' fn={track2} strokeWidth={1 / 1000} />
        </g>
      </g>
    </svg>
  )
}

export const metadata = new XpMetadata({
  slug: 'track',
})

export default function EasingGraphPage() {
  return (
    <div className='EasingGraphPage page'>
      <Graph />
    </div>
  )
}