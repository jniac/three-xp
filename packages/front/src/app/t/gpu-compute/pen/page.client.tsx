'use client'

import { Mesh, MeshBasicMaterial, PlaneGeometry } from 'three'

import { FpsMeter } from 'some-utils-misc/fps-meter'
import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { GpuComputePenDemo } from 'some-utils-three/experimental/gpu-compute/demo/pen'
import { setup } from 'some-utils-three/utils/tree'
import { inverseLerp } from 'some-utils-ts/math/basic'
import { onTick } from 'some-utils-ts/ticker'

import { leak } from '@/utils/leak'
import { DebugHelper } from 'some-utils-three/helpers/debug'

function MyScene() {
  const three = useThreeWebGL()!

  useGroup('my-scene', function* (group) {
    three.pipeline.basicPasses.fxaa.enabled = false

    const plane = setup(new Mesh(new PlaneGeometry(), new MeshBasicMaterial()), group)
    plane.scale.setScalar(10)

    setup(new DebugHelper(), group)
      .regularGrid({ size: 10, subdivisions: [2, 5] })
      .onTop()

    const gpuCompute = new GpuComputePenDemo({ size: 2 ** 11 })
      .initialize(three.renderer)

    yield onTick('three', tick => {
      const i = three.pointer.intersectPlane('xy')
      if (i.intersected) {
        const x = inverseLerp(-5, 5, i.point.x)
        const y = inverseLerp(-5, 5, i.point.y)
        gpuCompute.penMove(x, y, 0.2)
      }
      gpuCompute.update(0)
      plane.material.map = gpuCompute.currentTexture()
      plane.material.needsUpdate = true
    })

  }, [])

  return null
}

export function PageClient() {
  leak()
  return (
    <ThreeProvider
      vertigoControls={{
        fixed: true,
        size: 10.5,
        eventTarget: 'canvas',
      }}
    >
      <div className='layer thru flex flex-col p-12'>
        <h1 className='text-4xl font-bold'>GPU Compute - Game of Life</h1>
        <FpsMeter />
      </div>

      <MyScene />
    </ThreeProvider>
  )
}
