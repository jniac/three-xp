'use client'

import { FpsMeter } from 'some-utils-misc/fps-meter'
import { ThreeProvider } from 'some-utils-misc/three-provider'

import { MyScene } from './my-scene'

export function ClientPage() {
  return (
    <ThreeProvider
      vertigoControls={{
        fixed: true,
        size: 10,
        eventTarget: 'canvas',
      }}
    >
      <div className='ClientPage layer thru flex flex-col p-8 text-[blue]'>
        <div>
          Joseph M.
        </div>
        <div className='flex-1 pointer-events-none' />
        <FpsMeter />
      </div>

      <MyScene />
    </ThreeProvider>
  )
}
