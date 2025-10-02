'use client'

import { handlePointer } from 'some-utils-dom/handle/pointer'
import { FpsMeter } from 'some-utils-misc/fps-meter'
import { ThreeProvider, useGroup, } from 'some-utils-misc/three-provider'
import { setup } from 'some-utils-three/utils/tree'

import { ShadowHillPlanes } from './shadow-hill-planes'

function MyScene() {
  useGroup('my-scene', function* (group, three) {
    const shadow = setup(new ShadowHillPlanes(), group)

    shadow.rotation.z = -Math.PI / 4

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
      fullscreenKey={{ code: 'KeyF', modifiers: 'shift' }}
    >
      <div className='PageClient layer thru p-16 border-[32px] border-[white] flex flex-col items-start'>
        <h1 className='text-6xl font-bold'>
          OVVO Layers
        </h1>
        <FpsMeter precision={0} className='mt-2 px-2 py-1 rounded text-[black] bg-[#fff] text-xs' />
      </div>


      <MyScene />
    </ThreeProvider>
  )
}