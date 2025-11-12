'use client'
import { useState } from 'react'
import { remap } from 'some-utils-ts/math/basic'
import { Float32Variable } from 'some-utils-ts/misc/variables'
import { Color, ColorRepresentation } from 'three'

type ReadonlyOrNot<T> = T | Readonly<T>
type RangeArg = 'auto' | ReadonlyOrNot<[number, number]>

export enum CurveMode {
  Line = 1 << 0,
  GaussianLine = 1 << 1,
  Fill = 1 << 2,
  GaussianFill = 1 << 3,
}

const defaultGraphProps = {
  width: 600,
  height: 200,
  yRange: 'auto' as RangeArg,
  strokeWidth: 2,
  curveMode: CurveMode.Line,
  colors: ['#56aaff', '#ff56b6', '#fffc56'] as ColorRepresentation | ColorRepresentation[],
}

type GraphProps = {
  variable: Float32Variable | Float32Variable[]
} & Partial<typeof defaultGraphProps>

function CurveGraph(props: GraphProps) {
  const {
    variable: variableArg,
    yRange: yRangeArg,
    width,
    height,
    strokeWidth,
    curveMode,
    colors,
  } = { ...defaultGraphProps, ...props }
  const variable = Array.isArray(variableArg) ? variableArg[0] : variableArg

  const yRange = yRangeArg === 'auto'
    ? (() => {
      const info = variable.historyInfo()
      return [info.min, info.max] as [number, number]
    })()
    : yRangeArg

  const gaussianSamples = curveMode & (CurveMode.GaussianLine | CurveMode.GaussianFill)
    ? variable.gaussianSmoothSamples(100)
    : null

  const gaussianPoints = gaussianSamples?.map((v, i, arr) => {
    const x = remap(i, 0, arr.length - 1, width, 0)
    const y = remap(v, yRange[0], yRange[1], height, 0)
    return `${x},${y}`
  }) ?? null

  const color = Array.isArray(colors) ? colors[0] : colors

  return (
    <>
      {curveMode & CurveMode.GaussianFill && (
        <polygon
          fill={`#${new Color(color).getHexString()}`}
          points={[
            ...gaussianPoints!,
            `${0},${height}`,
            `${width},${height}`,
          ].join(' ')}
        />
      )}
      {curveMode & CurveMode.GaussianLine && (
        <polyline
          fill='none'
          stroke={`#${new Color(color).getHexString()}`}
          strokeWidth={strokeWidth}
          points={gaussianPoints!.join(' ')}
        />
      )}
      {curveMode & CurveMode.Line && (
        <path
          d={variable.toSvgPathData({
            width,
            height,
            yRange,
          })}
          fill='none'
          stroke={`#${new Color(color).getHexString()}`}
          strokeWidth={strokeWidth}
        />
      )}
    </>
  )
}

export function Graph({
  children,
  ...props
}: GraphProps & {
  children?: React.ReactNode
}) {
  const {
    variable: variableArg,
    yRange: yRangeArg,
    width,
    height,
    strokeWidth,
  } = { ...defaultGraphProps, ...props }
  const [yRange, setYRange] = useState<RangeArg>(yRangeArg)
  const variables = Array.isArray(variableArg) ? variableArg : [variableArg]
  return (
    <div
      onClick={() => {
        if (yRangeArg !== 'auto') {
          setYRange(value => value === 'auto' ? yRangeArg : 'auto')
        }
      }}
    >
      <svg width={width} height={height} style={{ backgroundColor: '#111' }}>
        {variables.map((variable, i) => (
          <g key={i}>
            <CurveGraph {...props} yRange={yRange} />
            {variable.derivative && (
              <path
                d={variable.derivative!.toSvgPathData({
                  width,
                  height,
                  yRange,
                })}
                fill='none'
                stroke='#ff56b6'
                strokeWidth={strokeWidth} />
            )}
            {variable.derivative?.derivative && (
              <path
                d={variable.derivative.derivative.toSvgPathData({
                  width,
                  height,
                  yRange,
                })}
                fill='none'
                stroke='#fffc56'
                strokeWidth={strokeWidth}
                opacity={.1} />
            )}
          </g>
        ))}
        {children}
        <text x={10} y={24} fill='white' fontSize={16}>
          {variables.map(v => v.props.name).join(', ')}
        </text>
        <text x={10} y={41} fill='white' fontSize={11} opacity={.2}>
          {variables[0].count}:{variables[0].props.historySize} ({variables.map(v => v.get().toFixed(1)).join(', ')})
        </text>
        {yRangeArg !== 'auto' && (
          <text x={10} y={56} fill='white' fontSize={11} opacity={.2}>
            (click to {yRange === 'auto' ? 'fix' : 'auto-adjust'} Y range)
          </text>
        )}
      </svg>
    </div>
  )
}
