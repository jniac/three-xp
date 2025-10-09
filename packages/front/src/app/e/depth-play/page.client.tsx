'use client'

import { ThreeProvider } from 'some-utils-misc/three-provider'

import { MyScene } from './my-scene'

export function ClientPage() {
  return (
    <ThreeProvider
      vertigoControls={{
        // perspective: 0,
        size: 10,
        eventTarget: 'canvas',
      }}
    >
      <div className='ClientPage layer thru flex flex-col p-12'>
        <h1 className='text-4xl font-bold mb-4'>
          Playing with depth
        </h1>
        <div>
          (using a custom shader material on instanced meshes, with a depth texture)
        </div>
      </div>

      <MyScene />
    </ThreeProvider>
  )
}
