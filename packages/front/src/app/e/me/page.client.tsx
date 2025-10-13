'use client'

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
      <div className='ClientPage layer thru flex flex-col p-8'>
        <div>
          Joseph M.
        </div>
      </div>

      <MyScene />
    </ThreeProvider>
  )
}
