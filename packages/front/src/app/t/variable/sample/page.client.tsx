'use client'


import { loopArray } from 'some-utils-ts/iteration/loop'
import { remap } from 'some-utils-ts/math/basic'
import { Float32Variable } from 'some-utils-ts/misc/variables'
import { RandomUtils } from 'some-utils-ts/random/random-utils'
import { CurveMode, Graph } from '../components/graph'

const historySize = 8
const yRange = [-50, 150] as const

const defaultGraphProps = {
  width: 600,
  height: 400,
  strokeWidth: 2,
}

function CustomGaussianLine({
  variable,
  ...props
}: Partial<typeof defaultGraphProps> & {
  variable: Float32Variable
}) {
  const {
    width,
    height,
    strokeWidth,
  } = { ...defaultGraphProps, ...props }
  const samples = variable.gaussianSmoothSamples(300, { sampleHistoryWidth: .2 })
  return (
    <polyline
      points={samples.map((v, i, arr) => {
        const x = remap(i, 0, arr.length - 1, width, 0)
        const y = remap(v, -50, 150, height, 0)
        return `${x},${y}`
      }).join(' ')}
      stroke='orange'
      strokeWidth={1}
      fill='none'
    />
  )
}

export function PageClient() {
  const variable = new Float32Variable({ name: 'var1', historySize })

  RandomUtils.setRandom('parkmiller', 456789)
  variable.createHistory(t => t < .25 ? 0 : 100 * RandomUtils.random())

  return (
    <div className='p-16 flex flex-col gap-8 overflow-y-auto h-screen'>
      <h1 className='text-2xl font-bold'>
        Gaussian sample demo
      </h1>
      <p className='max-w-prose'>
        but it looks weird for larger history width sampling... to be investigated.
      </p>
      <Graph
        variable={variable}
        yRange={yRange}
        width={600}
        height={400}
        curveMode={CurveMode.GaussianLine}
      >
        {loopArray(historySize, it => {
          const x = remap(it.i, 0, historySize - 1, 0, 600)
          return (
            <line key={it.i} x1={x} y1={0} x2={x} y2={400} stroke='gray' strokeWidth={0.5} strokeDasharray='2 2' />
          )
        })}
        <line x1={0} y1={200} x2={600} y2={200} stroke='red' strokeWidth={1} strokeDasharray='4 4' />
        <CustomGaussianLine variable={variable} />
      </Graph>
    </div>
  )
}
