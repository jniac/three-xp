'use client'

import { Mesh, SRGBColorSpace } from 'three'

import { AxesGeometry } from 'some-utils-three/geometries/axis'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { addTo } from 'some-utils-three/utils/parenting'

import { ThreeProvider, useGroup, useThree } from '@/tools/three-provider'

import { ScatteredPlane } from './ScatteredPlane'

function ScatteredDemo() {
  useGroup(ScatteredDemo.name, async function* (group, three) {

    addTo(new Mesh(new AxesGeometry(), new AutoLitMaterial()), group)

    const texture = await three.load('/assets/images/DebugTexture.png')
    texture.colorSpace = SRGBColorSpace
    const plane = addTo(new ScatteredPlane(), group)
    plane.internal.mesh.material.map = texture
    plane.internal.mesh.material.mapAspect = texture.image.width / texture.image.height

    const d0 = plane.getDistribution({ position: [-2, 0], size: [3, 2] })
    const d1 = plane.getDistribution({ position: [2, 0], size: [2, 3] })
    plane.drawDistribution(d0)
    plane.drawDistribution(d1)

    yield three.onTick(({ time }) => {
      plane.lerpDistribute(d0, d1, Math.sin(time / 2) * .5 + .5)
    })

  }, [])
  return null
}

function OrbitControls() {
  useThree(function* (three) {
    three.useOrbitControls({
      position: [0, 0, 8],
      target: 0,
    })
  }, [])
  return null
}

export function Client() {
  return (
    <div className='absolute-through p-4 flex flex-col gap-4'>
      <div className='absolute-through'>
        <ThreeProvider>
          <OrbitControls />
          <ScatteredDemo />
        </ThreeProvider>
      </div>

      <h1 className='text-4xl'>ScatteredPlane</h1>
    </div>
  )
}