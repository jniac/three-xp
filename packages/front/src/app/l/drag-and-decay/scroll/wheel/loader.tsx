'use client'

import { useState } from 'react'

import { useEffects } from 'some-utils-react/hooks/effects'
import { ToggleMobile } from '../../toggle-mobile'

const mobilePositions = [0, 406.5, 813]

class Data {
  data: Float32Array
  min: number
  max: number

  constructor(data: Float32Array) {
    this.data = data
    this.min = data.reduce((min, val) => Math.min(min, val), Infinity)
    this.max = data.reduce((max, val) => Math.max(max, val), -Infinity)
  }

  getSvgY = (value: number, { height = 200 } = {}) => {
    const { min, max } = this
    const delta = max - min
    const scaleY = 1 / (delta === 0 ? 1 : delta)
    return (1 - (value - min) * scaleY) * height
  }

  getSvgPathData({ width = 500, height = 200, getSvgY = this.getSvgY } = {}) {
    const pathData: string[] = []
    const length = this.data.length
    const scaleX = width / length
    for (let i = 0; i < length; i++) {
      const x = i * scaleX
      const y = getSvgY(this.data[i], { height })
      const command = i === 0 ? 'M' : 'L'
      pathData.push(`${command} ${x.toFixed(1)} ${y.toFixed(1)}`)
    }
    return pathData.join(' ')
  }
}

class WheelData {
  static async load(url: string) {
    const response = await window.fetch(url)
    const arrayBuffer = await response.arrayBuffer()
    return new WheelData(new Float32Array(arrayBuffer))
  }
  /**
   * The recorded wheel data as a Float32Array.
   * 
   * Format: [frame1, deltaY1, frame2, deltaY2, ...]
   */
  data: Float32Array

  deltaMax: number
  deltaMin: number
  firstDeltaIndex: number
  lastDeltaIndex: number

  deltas: Data
  cumulativeDeltas: Data
  mobile: Data

  constructor(data: Float32Array) {
    this.data = data

    let min = Infinity
    let max = -Infinity
    let firstFrame = Infinity
    let lastFrame = 0
    let firstDeltaIndex = -1
    let lastDeltaIndex = -1
    for (let i = 0; i < data.length; i += 2) {
      const frame = data[i]
      const delta = data[i + 1]
      if (delta < min) min = delta
      if (delta > max) max = delta
      if (delta !== 0) {
        lastFrame = frame
        lastDeltaIndex = i
        if (firstFrame === Infinity) {
          firstDeltaIndex = i
          firstFrame = frame
        }
      }
    }
    this.deltaMax = min
    this.deltaMin = max
    this.firstDeltaIndex = firstDeltaIndex
    this.lastDeltaIndex = lastDeltaIndex

    // Precompute cumulative wheel data for easier playback
    const frameCount = lastFrame - firstFrame + 1
    const deltas = new Float32Array(frameCount)
    const cumulativeDeltas = new Float32Array(frameCount)
    let cumulative = 0
    let lastFrameIndex = 0
    for (let i = firstDeltaIndex; i <= lastDeltaIndex; i += 2) {
      const frame = data[i]
      const deltaY = data[i + 1]
      cumulative += deltaY
      const frameIndex = frame - firstFrame
      // Note: there might be multiple entries for the same frame
      const frameDelta = deltas[frameIndex] + deltaY

      // Note: fill in the gaps from lastFrameIndex to frameIndex
      for (let j = lastFrameIndex + 1; j <= frameIndex; j++) {
        deltas[j] = frameDelta
        cumulativeDeltas[j] = cumulative
      }

      lastFrameIndex = frameIndex
    }

    this.deltas = new Data(deltas)
    this.cumulativeDeltas = new Data(cumulativeDeltas)

    const mobile = new ToggleMobile({
      positions: mobilePositions,
    })
    const mobilePositions2 = new Float32Array(frameCount)
    for (let i = 0; i < deltas.length; i++) {
      mobile
        .dragAutoStart(deltas[i], { distanceThreshold: 200 })
        .dragAutoStop({ velocityThreshold: 200 })
        .update(1 / 120) // Assume 120 FPS
      mobilePositions2[i] = mobile.position
    }
    this.mobile = new Data(mobilePositions2)
  }
}

function DataInfo({ wheelData }: { wheelData: WheelData }) {
  return (
    <div className='text-xs'>
      <div>Wheel Data Info</div>
      <div>
        <span>
          Length: [{wheelData.cumulativeDeltas.data.length}]  {wheelData.data.length} floats
        </span>
      </div>
      <div>Min: {wheelData.deltaMax}</div>
      <div>Max: {wheelData.deltaMin}</div>
    </div>
  )
}

export function WheelLoader() {
  const [data, setData] = useState<WheelData | null>(null)

  const { ref } = useEffects<HTMLDivElement>(async function* (div) {
    const wheelData = await WheelData.load('/assets/misc/wheel-recording-5s-1200floats.bin')
    setData(wheelData)
  }, [])

  const width = 400
  const height = 300
  const margin = 10
  return (
    <div
      ref={ref}
      className='p-2 flex flex-col items-start border border-white/10 rounded'
    >
      <div>
        Wheel Loader
      </div>
      {data && <>
        <DataInfo wheelData={data} />
        <svg
          className='mt-2 border border-white/10 rounded'
          width={width + margin * 2}
          height={height + margin * 2}
          viewBox={`${-margin} ${-margin} ${width + margin * 2} ${height + margin * 2}`}
        >
          <rect x={0} y={0} width={width} height={height} stroke='#fff6' strokeWidth={1} fill='none' />
          <path
            d={data.cumulativeDeltas.getSvgPathData({ width, height })}
            stroke='white'
            strokeWidth={2}
            fill='none'
          />
          <path
            d={data.deltas.getSvgPathData({ width, height })}
            stroke='white'
            strokeWidth={2}
            fill='none'
          />
          <path
            d={data.mobile.getSvgPathData({ width, height, getSvgY: data.cumulativeDeltas.getSvgY })}
            stroke='yellow'
            strokeWidth={2}
            fill='none'
          />
          <line
            x1={0}
            y1={data.cumulativeDeltas.getSvgY(mobilePositions[1], { height })}
            x2={width}
            y2={data.cumulativeDeltas.getSvgY(mobilePositions[1], { height })}
            stroke='#fff6'
            strokeWidth={1}
            strokeDasharray='4 4'
          />
        </svg>
      </>}
    </div>
  )
}