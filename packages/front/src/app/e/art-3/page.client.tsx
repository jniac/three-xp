'use client'
import { Color } from 'three'

import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { setup } from 'some-utils-three/utils/tree'

import { Blades, Knob } from './widgets'

function Art() {
  const three = useThreeWebGL()
  three.scene.background = new Color('#ddd')
  three.renderer.localClippingEnabled = true

  useGroup('art', function* (group) {
    setup(new DebugHelper(), group)

    setup(new Knob(), {
      parent: group,
      position: [0, 0, 0],
    })

    setup(new Knob({ backgroundColor: '#1B2995', handleColor: '#E67BB6', handleTurnOffset: 0.25, handleAperture: 0 }), {
      parent: group,
      position: [-1, 0, 0],
    })

    setup(new Blades(), {
      parent: group,
      position: [1, 0, 0],
    })

  }, [])
  return null
}

export function PageClient() {
  return (
    <div className='absolute-through'>
      <ThreeProvider
        stencil
        vertigoControls={{
          size: 3,
          // rotation: '-10deg, -15deg, 0',
        }}
      >
        <div className='text-[#333] p-4'>
          <h1>
            Stencil Test (WIP)
          </h1>
        </div>
        <Art />
      </ThreeProvider>
    </div>
  )
}