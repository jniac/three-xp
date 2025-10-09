'use client'

import { Mesh, MeshBasicMaterial, PlaneGeometry } from 'three'

import { FpsMeter } from 'some-utils-misc/fps-meter'
import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { GpuComputePenDemo } from 'some-utils-three/experimental/gpu-compute/demo/pen'
import { setup } from 'some-utils-three/utils/tree'
import { inverseLerp } from 'some-utils-ts/math/basic'
import { onTick } from 'some-utils-ts/ticker'

import { leak } from '@/utils/leak'

function MyScene() {
  const three = useThreeWebGL()!

  useGroup('my-scene', function* (group) {
    const plane = setup(new Mesh(new PlaneGeometry(), new MeshBasicMaterial()), group)
    plane.scale.setScalar(10)

    const gpuCompute = new GpuComputePenDemo({ size: 2 ** 11 })
      .initialize(three.renderer)

    yield onTick('three', tick => {
      const i = three.pointer.intersectPlane('xy')
      if (i.intersected) {
        const x = inverseLerp(-5, 5, i.point.x)
        const y = inverseLerp(-5, 5, i.point.y)
        gpuCompute.pen(x, y, 0.1)
      }
      plane.material.map = gpuCompute.currentTexture()
      gpuCompute.update(tick.deltaTime)
    })

  }, [])

  return null
}

export function PageClient() {
  leak()
  return (
    <ThreeProvider
      vertigoControls={{
        size: 10,
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
