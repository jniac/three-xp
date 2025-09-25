'use client'

import { handlePointer } from 'some-utils-dom/handle/pointer'
import { FpsMeter } from 'some-utils-misc/fps-meter'
import { ThreeProvider, useGroup, } from 'some-utils-misc/three-provider'
import { setup } from 'some-utils-three/utils/tree'

import { ShadowHillPlanes } from './shadow-hill-planes'

function MyScene() {
  useGroup('my-scene', function* (group, three) {
    const shadow = setup(new ShadowHillPlanes(), group)

    yield handlePointer(three.domElement, {
      onDown: () => {
        shadow.timescale = 10
      },
      onUp: () => {
        shadow.timescale = 1
      },
    })
  }, [])
  return null
}

export function PageClient() {
  return (
    <ThreeProvider
      vertigoControls={{
        size: 1,
        zoom: 2,
      }}
    >
      <div className='PageClient layer thru p-16'>
        <h1 className='mb-4 text-3xl font-bold'>
          OVVO Layers
        </h1>
        <p>
          This is a test page for the &quot;OVVO&quot; layers.
        </p>
        <FpsMeter />
      </div>


      <MyScene />
    </ThreeProvider>
  )
}