'use client'


import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { setupShaderForge } from 'some-utils-three/glsl/transform/bend'
import { BoxLineHelper } from 'some-utils-three/helpers/box-line'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { setup } from 'some-utils-three/utils/tree'

import { Umbellifer } from './umbellifer'

function MyScene() {
  const three = useThreeWebGL()!
  useGroup('slerp-scene', function* (group) {
    three.pipeline.basicPasses.fxaa.enabled = false

    setup(new DebugHelper(), group)
      .regularGrid({ size: 4 })

    const umbellifer = setup(new Umbellifer(), group)
    umbellifer.bendAmplitude = 2
    umbellifer.noiseAmplitude = 2
    umbellifer.enableBend()
    yield three.ticker.onTick(tick => {
      umbellifer.update(tick.deltaTime)
    })

    setup(new BoxLineHelper({
      letters: true,
      onBeforeCompile: shader => {
        setupShaderForge(shader, umbellifer.bendUniforms!)
      },
    }), {
      parent: group,
      ...umbellifer.bendTransform!,
    })

  }, 'always')

  return null
}

export function ClientPage() {
  return (
    <ThreeProvider
      vertigoControls={{
        perspective: .5,
        size: 1.4,
        focus: [0, .6, 0],
      }}
    >
      <div className='layer thru p-16'>
        <h1 className='text-4xl font-bold'>
          Umbellifer
        </h1>
      </div>

      <MyScene />
    </ThreeProvider>
  )
}
