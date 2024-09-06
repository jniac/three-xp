'use client'

import { useEffect, useRef, useState } from 'react'

import { handleAnyUserInteraction } from 'some-utils-dom/handle/anyUserInteraction'
import { Vector3Declaration, solveVector3Declaration } from 'some-utils-three/declaration'
import { Ticker } from 'some-utils-ts/ticker'

function TheTicker() {
  const tickerRef = useRef<Ticker>(null)
  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ticker = new Ticker()
    // @ts-ignore
    tickerRef.current = ticker

    const div = divRef.current!
    const infoDiv1 = div.querySelector('div:nth-child(2)')!
    const infoDiv2 = div.querySelector('div:nth-child(3)')!
    ticker.onTick(tick => {
      infoDiv1.innerHTML = tick.toString()
      infoDiv2.innerHTML = `activeTime: ${tick.activeTime.toFixed(2)}, activeDuration: ${tick.activeDuration.toFixed(2)}, activeTimeScale: ${tick.activeTimeScale.toFixed(2)}`
    })
    handleAnyUserInteraction(() => {
      console.log('User interaction detected')
      ticker.requestActivation()
    })
    return () => ticker.destroy()
  }, [])

  return (
    <div ref={divRef} className='flex flex-col items-center text-[goldenrod] gap-2'>
      <div>
        The Ticker.
      </div>
      <div />
      <div />
      <button
        className='border border-[goldenrod] rounded-md px-4 py-2'
        onClick={() => tickerRef.current?.requestActivation()}>
        Request Activation
      </button>
      <div>
        <label htmlFor="timeScale"></label>
        <input
          type="range"
          name="timeScale"
          id="timeScale"
          min={0}
          max={2}
          step={0.01}
          value={tickerRef.current?.timeScale}
          onChange={event => {
            tickerRef.current!.timeScale = Number.parseFloat(event.target.value)
          }}
        />
      </div>
    </div>
  )
}

export function Test() {
  const a: Vector3Declaration = [1, 2, 3]
  const b = solveVector3Declaration(a)
  const [state, setState] = useState(true)
  return (
    <div className='flex flex-col gap-2 items-center'>
      <p className='flex flex-row gap-1'>
        {b.constructor.name} {b.x} {b.y} {b.z}
      </p>
      <button onClick={() => setState(!state)}>Click me</button>
      {state && (
        <TheTicker />
      )}
    </div>
  )
}
