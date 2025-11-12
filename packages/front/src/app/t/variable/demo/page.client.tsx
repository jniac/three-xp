'use client'

import { useMemo } from 'react'

import { handleAnyUserInteraction } from 'some-utils-dom/handle/any-user-interaction'
import { handlePointer } from 'some-utils-dom/handle/pointer'
import { useEffects } from 'some-utils-react/hooks/effects'
import { useTriggerRender } from 'some-utils-react/hooks/render'
import { Float32Variable } from 'some-utils-ts/misc/variables'
import { onTick, Ticker } from 'some-utils-ts/ticker'

import { Graph } from '../components/graph'

function createVariables({
  historySize = 100,
} = {}) {
  const sinVar = new Float32Variable({ name: 'X', historySize, derivativeCount: 2 })
  for (let i = 0; i < historySize * 2; i++) {
    const dt = Math.PI * 2 / (historySize - 1)
    const t = i * dt
    sinVar.push(Math.sin(t), dt)
  }

  const powVar = new Float32Variable({ name: 'power-2', historySize, derivativeCount: 2 })
  const POW_MAX_X = 4
  for (let i = 0; i < historySize * 2; i++) {
    const dt = 1 / (historySize * 2)
    const t = (i * dt - .5) * POW_MAX_X
    powVar.push(Math.pow(t, 2), dt * POW_MAX_X)
  }

  const wheelVar = new Float32Variable({ name: 'wheel', historySize, derivativeCount: 2 })

  const pointerYVar = new Float32Variable({ name: 'pointerY', historySize, derivativeCount: 0 })
  const pointerXVar = new Float32Variable({ name: 'pointerX', historySize, derivativeCount: 0 })

  return { sinVar, powVar, wheelVar, pointerXVar, pointerYVar }
}

export function PageClient() {
  const variables = useMemo(() => createVariables({ historySize: 200 }), [])
  const render = useTriggerRender()
  const { ref } = useEffects<HTMLDivElement>(function* (div) {
    let wheelDelta = 0
    let wheelCumulative = 0
    const pointer = { x: 0, y: 0 }

    yield handlePointer(div, {
      onChange: info => {
        pointer.x = info.position.x
        pointer.y = info.position.y
      },
      onWheel: info => {
        wheelDelta += info.delta.y
      },
    })

    yield handleAnyUserInteraction(Ticker.current().requestActivation)

    yield onTick(tick => {
      wheelCumulative += wheelDelta
      wheelDelta = 0
      variables.wheelVar.push(wheelCumulative, tick.deltaTime)

      variables.pointerXVar.push(pointer.x, tick.deltaTime)
      variables.pointerYVar.push(pointer.y, tick.deltaTime)

      render()
    })
  }, [])

  return (
    <div ref={ref} className='p-16 flex flex-col gap-8 overflow-y-auto h-screen'>
      <h1 className='text-2xl font-bold'>
        Variable Demo Page
      </h1>
      <p className='max-w-prose'>
        Float32Variable is a time-series variable that keeps a history of pushed values, and can compute derivatives. Click on the graphs to toggle Y range auto-adjustment.
      </p>
      <div className='flex flex-row flex-wrap gap-2'>
        <Graph
          variable={variables.sinVar}
          yRange={[-1.5, 1.5]}
        />
        <Graph
          variable={variables.powVar}
          yRange={[0, 4]}
          height={400}
        />
        <Graph
          variable={variables.wheelVar}
          height={400}
          yRange={[-8000, 8000]}
        />
        <Graph
          variable={[variables.pointerXVar, variables.pointerYVar]}
          height={400}
          yRange={[0, typeof window !== 'undefined' ? Math.max(window.innerWidth, window.innerHeight) : 1000]}
        />
      </div>
    </div>
  )
}