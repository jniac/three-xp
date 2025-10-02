import { FuzzyRange } from 'some-utils-ts/math/easing/fuzzy-range'

import { RangeClient } from './range.client'
import { defaultRangeProps, RangeProps, settings } from './settings'

function Range(incomingProps: RangeProps) {
  const { width, height, padding } = settings
  const props = { ...defaultRangeProps, ...incomingProps }

  const outerWidth = width + padding * 2
  const outerHeight = height + padding * 2

  const range = new FuzzyRange(props.range)

  const points = 100
  const pathData = Array.from({ length: points + 1 }, (_, i) => {
    const x = props.length * i / points
    const y = range.evaluate(x, props.ease)
    const xPos = x * width / props.length
    const yPos = (1 - y) * height
    return `${i === 0 ? 'M' : 'L'}${xPos.toFixed(2)},${yPos.toFixed(2)}`
  }).join(' ')

  return (
    <svg
      width={outerWidth}
      height={outerHeight}
      viewBox={`${-padding} ${-padding} ${outerWidth} ${outerHeight}`}
      style={{ border: '1px solid #fff1' }}
    >
      <RangeClient {...incomingProps} />
      <path d={pathData} fill='none' stroke='#568756' strokeWidth={2} />
      <circle cx={0} cy={height} r={5} fill='#568756' />
    </svg>
  )
}

export function Main() {
  return (
    <div className='p-4 space-y-4'>
      <h1>
        Fuzzy Range Test Page
      </h1>

      <div className='flex flex-row gap-4 flex-wrap'>
        <Range />
        <Range ease={['inOut3', 'out4']} />

        <Range
          length={100}
          range={{ center: 50, length: 30, fade: 30 }}
          ease='in4'
        />

        <Range
          length={100}
          range={{ center: 50, length: 30, fade: 30 }}
          ease='out(.1)'
        />

        <Range
          length={100}
          range={[10, 30, 70, 90]}
          ease={['in3', 'linear']}
        />

        <Range
          length={100}
          range={[10, 50, 60, 100]}
          ease={['inout(3, 1/4)', 'inout(6)']}
        />

        <Range
          length={100}
          range={[5, 50, 50, 95]}
          ease={'asym(4, 2)'}
        />

        <Range
          length={100}
          range={[5, 50, 500, 595]}
          ease={'asym(4, 2)'}
        />

        <Range
          range={{ center: .5, length: 0, outerLength: .8 }}
          ease='in-linear-out(1, 3, 1/3)'
        />
      </div>
    </div>
  )
}
