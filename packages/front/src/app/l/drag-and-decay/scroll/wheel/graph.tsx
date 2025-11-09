'use client'

import { useState } from 'react'

import { useEffects } from 'some-utils-react/hooks/effects'
import { useTriggerRender } from 'some-utils-react/hooks/render'

import { Pause, Play } from 'lucide-react'
import { ToggleMobile } from '../../toggle-mobile'
import { WheelRecord } from './wheel-record'

function GraphInfo({ record }: { record: WheelRecord }) {
  const render = useTriggerRender()
  return (
    <div className='text-xs'>
      <div className='flex flex-row'>
        {record.isLive ? 'Live Data' : record.url?.split('/').pop()}
        <div className='flex-1' />
        {record.isLive && (
          <>
            <button
              className='border border-white/20 rounded px-2 py-1 hover:bg-white/10 flex items-center gap-1'
              onClick={() => {
                record.liveState.pause = !record.liveState.pause
                render()
              }}
            >
              {record.liveState.pause
                ? <><Play size={12} /> Resume</>
                : <><Pause size={12} /> Pause</>
              }
            </button>

            <button
              className='border border-white/20 rounded px-2 py-1 hover:bg-white/10 ml-2'
              onClick={() => {
                record.clear()
                render()
              }}
            >
              Clear
            </button>
          </>
        )}
      </div>

      <div>Min: {record.positionTrack.min}</div>
      <div>Max: {record.positionTrack.max}</div>
    </div>
  )
}

function HorizontalLine({
  y = 0,
  color = '#fff2',
}) {
  return (
    <line
      x1={-1000}
      y1={y}
      x2={1000}
      y2={y}
      stroke={color}
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
      y1={-1000}
      x2={x}
      y2={1000}
      stroke={color}
      strokeWidth={1}
      strokeDasharray={dashArray}
    />
  )
}

const defaultGraphProps = {
  width: 400,
  height: 300,
  margin: 0,
}

function Graph(props: { record: WheelRecord, mobilePositions: number[] } & Partial<typeof defaultGraphProps>) {
  const {
    record,
    mobilePositions,
    width,
    height,
    margin,
  } = { ...defaultGraphProps, ...props }

  const simulation = record.isFinished && record.mobileSimulation({ mobilePositions })

  const render = useTriggerRender()
  useEffects(function* () {
    if (record.isLive) {
      const interval = setInterval(() => {
        // Force re-render every second for live data
        render()
      }, 100)
      yield () => clearInterval(interval)
    }
  }, [record.isLive])

  return (
    <>
      <GraphInfo record={record} />
      <svg
        className='mt-2'
        width={width + margin * 2}
        height={height + margin * 2}
        viewBox={`${-margin} ${-margin} ${width + margin * 2} ${height + margin * 2}`}
      >
        <rect x={0} y={0} width={width} height={height} stroke='#fff6' strokeWidth={1} fill='none' />
        <path
          d={record.positionTrack.getSvgPathData({ width, height })}
          stroke='white'
          strokeWidth={1}
          fill='none'
        />
        <path
          d={record.deltaTrack.getSvgPathData({ width, height })}
          stroke='cyan'
          strokeWidth={1}
          fill='none'
        />
        <path
          d={record.mobileTrack.getSvgPathData({
            width,
            height,
            mapY: record.positionTrack.mapY, // Use the same Y scale as cumulativeDeltas
          })}
          stroke='yellow'
          strokeWidth={2}
          fill='none'
        />
        <HorizontalLine
          color='#fff9'
          y={record.positionTrack.mapY(0, { height })}
        />
        {mobilePositions.slice(1).map(position => (
          <HorizontalLine
            key={position}
            y={record.positionTrack.mapY(position, { height })}
          />
        ))}
        {simulation && (
          <>
            {simulation.events.get('drag-start')?.map((frame, index) => (
              <VerticalLine
                key={`drag-start-${index}`}
                color='#f609'
                x={record.positionTrack.mapX(frame, { width })}
              />
            ))}
            {simulation.events.get('drag-stop')?.map((frame, index) => (
              <VerticalLine
                key={`drag-stop-${index}`}
                color='rgba(0, 162, 255, 0.6)'
                x={record.positionTrack.mapX(frame, { width })}
              />
            ))}
            {simulation.events.get(ToggleMobile.Events.DragAutoLockEnd)?.map((frame, index) => (
              <VerticalLine
                key={`drag-stop-${index}`}
                color='#00f7ff66'
                dashArray='8 8'
                x={record.positionTrack.mapX(frame, { width })}
              />
            ))}
          </>
        )}
      </svg>
    </>
  )
}

export function WheelGraph({
  url,
  mobilePositions,
  ...graphProps
}: {
  url?: string
  mobilePositions: number[]
} & Partial<typeof defaultGraphProps>) {
  const [record, setRecord] = useState<WheelRecord | null>(null)

  const { ref } = useEffects<HTMLDivElement>(async function* (div) {
    // Use a existing record from URL.
    if (url) {
      setRecord(await WheelRecord.load(url))
    }

    // Or record live data.
    else {
      const record = new WheelRecord(10 * 120)
      yield* record.initLiveRecording()
      setRecord(record)
    }
  }, [])

  return (
    <div
      ref={ref}
      className='p-2 flex flex-col border border-white/10 rounded'
    >
      {record && (
        <Graph
          record={record}
          mobilePositions={mobilePositions}
          {...graphProps}
        />
      )}
    </div>
  )
}