'use client'

import { useEffects } from 'some-utils-react/hooks/effects'
import { update3d } from 'some-utils-three/webgpu/css-3d/compute'

import { ThreeInstance, ThreeProvider, useThree } from '../utils/three-webgpu-provider'
import { Main } from './main'

import { useState } from 'react'
import { ToggleWidget } from 'some-utils-react/components/widgets/toggle'
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

  const three = useThree()
  const { ref } = useEffects<HTMLDivElement>(function* (div) {
    const child = div.querySelector('#three-div') as HTMLDivElement
    const main = Main.current()!
    yield three.ticker.onTick({ order: -1 }, tick => {
      update3d(div, child, three.camera, main)

      if (autoRotate) {
        main.rotation.y += 2 * tick.deltaTime
        main.rotation.x += 1 * tick.deltaTime
      }
    })
  }, [autoRotate])

  return (
    <div ref={ref} className='layer thru p-8 flex flex-col items-start'>
      <ThreeInstance value={Main} />
      <div className='p-4 bg-white text-[#707070] flex flex-col gap-2'>
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
        <button className='border border-[#707070]' onClick={() => Main.current()?.rotation.set(0, 0, 0)}>
          Reset Rotation
        </button>
      </div>
      <div
        id='three-div'
        className='w-[100px] h-[100px] flex flex-col justify-end items-end select-none uppercase p-1 hover:bg-[#f006]'
        style={{
          fontFamily: `'Sofia Sans Extra Condensed', sans-serif`,
          fontWeight: '100',
          fontSize: '2em',
          lineHeight: '.7em',
          textTransform: 'uppercase',
        }}
      >
        3D div
      </div>
    </div>
  )
}

export function Client() {
  return (
    <div className={`${s.Client} layer bg-[#707070]`}>
      <Background />
      <div className='layer'>
        <ThreeProvider vertigoControls={{ size: 2 }}>
          <UnderThree />
        </ThreeProvider>
      </div>
    </div>
  )
}
