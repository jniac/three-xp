'use client'

import { Mesh, MeshBasicMaterial, PlaneGeometry } from 'three'

import { handlePointer } from 'some-utils-dom/handle/pointer'
import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { GpuComputeGameOfLifeDemo } from 'some-utils-three/experimental/gpu-compute/demo/game-of-life'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { setup } from 'some-utils-three/utils/tree'
import { onTick } from 'some-utils-ts/ticker'

function MyScene() {
  const three = useThreeWebGL()!

  useGroup('my-scene', function* (group) {
    three.pipeline.basicPasses.fxaa.enabled = false

    const plane = setup(new Mesh(new PlaneGeometry(), new MeshBasicMaterial()), group)
    plane.scale.setScalar(10)

    setup(new DebugHelper(), group)
      .regularGrid({ size: 10, subdivisions: [2, 5], opacity: [1, .25] })
      .onTop()

    const gameOfLifeDemo = new GpuComputeGameOfLifeDemo({ size: 2 ** 8 })
      .initialize(three.renderer)

    let play = true

    yield onTick('three', { timeInterval: .1 }, tick => {
      plane.material.map = gameOfLifeDemo.currentTexture()
      plane.material.needsUpdate = true
      if (play)
        gameOfLifeDemo.update(tick.deltaTime)
    })

    yield handlePointer(document.body, {
      onTap: () => {
        play = !play
      },
    })

  }, [])

  return null
}

export function PageClient() {
  return (
    <ThreeProvider
      vertigoControls={{
        size: 9,
        frame: 'cover',
        eventTarget: 'canvas',
      }}
    >
      <div className='layer thru flex flex-col p-12'>
        <h1 className='text-4xl font-bold'>GPU Compute - Game of Life</h1>
      </div>

      <MyScene />
    </ThreeProvider>
  )
}
