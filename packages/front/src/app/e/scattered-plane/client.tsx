'use client'

import { Mesh } from 'three'

import { AxesGeometry } from 'some-utils-three/geometries/axis'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { addTo } from 'some-utils-three/utils/parenting'

import { ThreeProvider, useGroup, useThree } from '@/tools/three-provider'

import { ScatteredPlane } from './ScatteredPlane'

function ScatteredDemo() {
  useGroup(ScatteredDemo.name, async function* (group, three) {

    addTo(new Mesh(new AxesGeometry(), new AutoLitMaterial()), group)

    const texture = await three.load('/assets/images/saint-malo.jpg')
    const plane = addTo(new ScatteredPlane(), group)
    plane.internal.mesh.material.map = texture
  }, [])
  return null
}

function OrbitControls() {
  useThree(function* (three) {
    three.useOrbitControls({
      position: [0, 0, 5],
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