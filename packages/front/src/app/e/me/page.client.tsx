'use client'

import { ThreeProvider } from 'some-utils-misc/three-provider'

import { MyScene } from './my-scene'

export function ClientPage() {
  return (
    <ThreeProvider
      vertigoControls={{
        fixed: true,
        size: 12,
        eventTarget: 'canvas',
      }}
    >
      <div className='ClientPage layer thru flex flex-col p-12'>
        <div>
          Client Page
        </div>
      </div>

      <MyScene />
    </ThreeProvider>
  )
}
