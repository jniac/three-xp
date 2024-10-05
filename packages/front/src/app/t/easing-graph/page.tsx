import { SVGProps } from 'react'

import { XpMetadata } from '@/types'
import { elasticInPlace } from 'some-utils-ts/math/easings'

const defaultPlotProps = {
  fn: (x: number) => x,
  subdivisions: 500,
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
          <Plot stroke='#f90' fn={x => elasticInPlace(x)} />
          <Plot stroke='#fc6' fn={x => elasticInPlace(x, 5, 3)} />
        </g>
      </g>
    </svg>
  )
}

export const metadata = new XpMetadata({
  slug: 'easing-graph',
})

export default function EasingGraphPage() {
  return (
    <div className='EasingGraphPage page'>
      <Graph />
    </div>
  )
}