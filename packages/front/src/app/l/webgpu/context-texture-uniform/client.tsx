'use client'

import { useState } from 'react'

import { ToggleWidget } from 'some-utils-react/components/widgets/toggle'
import { useEffects } from 'some-utils-react/hooks/effects'
import { updatePosition3d } from 'some-utils-three/css-3d/compute'

import { ThreeInstance, ThreeProvider, useThree } from '../utils/three-webgpu-provider'
import { Main } from './main'

import { Ticker } from 'some-utils-ts/ticker'
import s from './client.module.css'

function Background() {
  return (
    <div className={`${s.Background} layer flex flex-col text-center items-center justify-center`}>
      <div style={{ margin: '-100px', inset: 0 }}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad dicta unde totam! Iusto rerum tempore provident dolores voluptas sed neque quisquam corrupti impedit quam eum animi sint, eaque non quae?
      </div>
    </div>
  )
}

function UnderThree() {
  const [autoRotate, setAutoRotate] = useState(false)
  const [hover, setHover] = useState(NaN)

  const three = useThree()
  const { ref } = useEffects<HTMLDivElement>(function* (div) {
    const child = div.querySelector('#three-div') as HTMLDivElement
    const span = child.querySelector('span + span') as HTMLDivElement
    const main = Main.current()!
    yield three.ticker.onTick({ order: -1 }, tick => {
      updatePosition3d(div, child, three.camera, main)

      const str = isNaN(hover) ? '0.000"' : `${(tick.time - hover).toFixed(3)}"`
      span.innerHTML = [...str].map(c => `<span>${c}</span>`).join('')

      if (autoRotate) {
        main.rotation.y += 2 * tick.deltaTime
        main.rotation.x += 1 * tick.deltaTime
      }
    })
  }, [autoRotate, hover])

  return (
    <div ref={ref} className='layer thru p-8 flex flex-col items-start'>
      <ThreeInstance value={Main} />
      <div className='p-4 bg-white text-[#bd71ff] flex flex-col gap-2'>
        <h1 className='text-4xl mb-2'>Webgpu Demo</h1>
        <ul>
          <li>✅ Transparent background</li>
          <li>✅ TSL</li>
          <li>✅ Basic context (resize, tick, render)</li>
          <li>✅ Vertigo controls</li>
          <li>✅ CSS 3D</li>
        </ul>
        <button className='flex gap-2' onClick={() => setAutoRotate(!autoRotate)}>
          Auto-Rotate
          <ToggleWidget active={autoRotate} />
        </button>
        <button className='border border-[#bd71ff]' onClick={() => Main.current()?.rotation.set(0, 0, 0)}>
          Reset Rotation
        </button>
      </div>
      <div
        id='three-div'
        className={s.ThreeDiv}
        onPointerEnter={() => {
          setHover(Ticker.get('three').time)
          // @ts-ignore
          Main.current()!.parts.uPhase.value = 1
        }}
        onPointerLeave={() => {
          setHover(NaN)
          // @ts-ignore
          Main.current()!.parts.uPhase.value = 0
        }}
      >
        <span style={{
          fontFamily: `'Sofia Sans Extra Condensed', sans-serif`,
          fontWeight: '100',
          fontSize: '2em',
          lineHeight: '.7em',
          textTransform: 'uppercase',
        }}>
          3D div
        </span>
        <span className={s.Counter} style={{
          fontFamily: `'Sofia Sans Extra Condensed', sans-serif`,
          fontWeight: '300',
          fontSize: '1em',
          lineHeight: '.7em',
          textTransform: 'uppercase',
        }}>
          <span>0</span>
          <span>.</span>
          <span>0</span>
          <span>0</span>
          <span>0</span>
        </span>
      </div>
    </div>
  )
}

export function Client() {
  return (
    <div className={`${s.Client} layer bg-[#bd71ff]`}>
      <Background />
      <div className='layer'>
        <ThreeProvider vertigoControls={{ size: 2 }}>
          <UnderThree />
        </ThreeProvider>
      </div>
    </div>
  )
}
