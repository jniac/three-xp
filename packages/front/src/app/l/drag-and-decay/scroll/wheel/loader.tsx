'use client'

import { useState } from 'react'

import { useEffects } from 'some-utils-react/hooks/effects'

import { ToggleMobile } from '../../toggle-mobile'

class Data {
  data: Float32Array
  min: number
  max: number

  constructor(data: Float32Array) {
    this.data = data
    this.min = data.reduce((min, val) => Math.min(min, val), Infinity)
    this.max = data.reduce((max, val) => Math.max(max, val), -Infinity)
  }

  mapX = (index: number, { width = 500 } = {}) => {
    const length = this.data.length
    const scaleX = width / length
    return index * scaleX
  }

  mapY = (value: number, { height = 200 } = {}) => {
    const { min, max } = this
    const delta = max - min
    const mapY = 1 / (delta === 0 ? 1 : delta)
    return (1 - (value - min) * mapY) * height
  }

  getSvgPathData({ width = 500, height = 200, mapY = this.mapY } = {}) {
    const pathData: string[] = []
    const length = this.data.length
    for (let i = 0; i < length; i++) {
      const x = this.mapX(i, { width })
      const y = mapY(this.data[i], { height })
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

  frameCount: number

  deltas: Data
  cumulativeDeltas: Data

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
    this.frameCount = frameCount

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
      deltas[frameIndex] = frameDelta

      // Note: fill in the gaps from lastFrameIndex to frameIndex
      for (let j = lastFrameIndex + 1; j <= frameIndex; j++) {
        cumulativeDeltas[j] = cumulative
      }

      lastFrameIndex = frameIndex
    }

    this.deltas = new Data(deltas)
    this.cumulativeDeltas = new Data(cumulativeDeltas)
  }

  mobileScenario({
    mobilePositions = [0, 100],
    velocityThreshold = 200,
    distanceThreshold = 50,
  } = {}) {
    const mobile = new ToggleMobile({
      positions: mobilePositions,
    })
    let frame = 0
    const events = new Map<string, number[]>()
    mobile.on('*', (type, mobile) => {
      const frames = events.get(type) ?? []
      frames.push(frame)
      events.set(type, frames)
    })
    const { deltas, frameCount } = this
    const mobilePositions2 = new Float32Array(frameCount)
    for (frame = 0; frame < frameCount; frame++) {
      mobile
        .dragAutoStart(deltas.data[frame], { distanceThreshold })
        .dragAutoStop({ velocityThreshold })
        .update(1 / 120) // Assume 120 FPS
      mobilePositions2[frame] = mobile.position
    }
    const mobileData = new Data(mobilePositions2)
    return {
      mobileData,
      events,
    }
  }
}

function DataInfo({ wheelData }: { wheelData: WheelData }) {
  return (
    <div className='text-xs'>
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

function HorizontalLine({ y }: { y: number }) {
  return (
    <line
      x1={0}
      y1={y}
      x2={400}
      y2={y}
      stroke='#fff2'
      strokeWidth={1}
    />
  )
}

function VerticalLine({
  x = 0,
  color = '#ff06',
  dashArray = '',
}) {
  return (
    <line
      x1={x}
      y1={0}
      x2={x}
      y2={300}
      stroke={color}
      strokeWidth={1}
      strokeDasharray={dashArray}
    />
  )
}

function WithData({ data, mobilePositions }: { data: WheelData, mobilePositions: number[] }) {
  const width = 400
  const height = 300
  const margin = 10
  const mobileScenario = data.mobileScenario({ mobilePositions })
  return (
    <>
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
          strokeWidth={1}
          fill='none'
        />
        <path
          d={data.deltas.getSvgPathData({ width, height })}
          stroke='white'
          strokeWidth={1}
          fill='none'
        />
        <path
          d={mobileScenario.mobileData.getSvgPathData({
            width,
            height,
            mapY: data.cumulativeDeltas.mapY, // Use the same Y scale as cumulativeDeltas
          })}
          stroke='yellow'
          strokeWidth={2}
          fill='none'
        />
        {mobilePositions.slice(1).map(position => (
          <HorizontalLine
            key={position}
            y={data.cumulativeDeltas.mapY(position, { height })}
          />
        ))}
        {mobileScenario.events.get('drag-start')?.map((frame, index) => (
          <VerticalLine
            key={`drag-start-${index}`}
            color='#f609'
            x={data.cumulativeDeltas.mapX(frame, { width })}
          />
        ))}
        {mobileScenario.events.get('drag-stop')?.map((frame, index) => (
          <VerticalLine
            key={`drag-stop-${index}`}
            color='rgba(0, 162, 255, 0.6)'
            x={data.cumulativeDeltas.mapX(frame, { width })}
          />
        ))}
        {mobileScenario.events.get(ToggleMobile.Events.DragAutoLockEnd)?.map((frame, index) => (
          <VerticalLine
            key={`drag-stop-${index}`}
            color='#00f7ff66'
            dashArray='8 8'
            x={data.cumulativeDeltas.mapX(frame, { width })}
          />
        ))}
      </svg>
    </>
  )
}

export function WheelLoader({
  url = '/assets/misc/wheel-recording-5s-1200floats.bin',
  mobilePositions
}: {
  url?: string
  mobilePositions: number[]
}) {
  const [data, setData] = useState<WheelData | null>(null)

  const { ref } = useEffects<HTMLDivElement>(async function* (div) {
    const wheelData = await WheelData.load(url)
    setData(wheelData)
  }, [])

  return (
    <div
      ref={ref}
      className='p-2 flex flex-col items-start border border-white/10 rounded'
    >
      <div>
        {url}
      </div>
      {data && (
        <WithData data={data} mobilePositions={mobilePositions} />
      )}
    </div>
  )
}