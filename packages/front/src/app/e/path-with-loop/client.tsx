'use client'

import { ThreeProvider, useThree } from '@/tools/three-provider'
import { makeMatrix4 } from 'some-utils-three/declaration'
import { ShaderForge } from 'some-utils-three/shader-forge'
import { GridHelper, IcosahedronGeometry, InstancedMesh, MeshBasicMaterial, PlaneGeometry, Points, PointsMaterial } from 'three'
import { SvgDemo } from './svg-demo'

function ThreeDemo() {
  useThree(async function* (three) {
    three.useOrbitControls({
      position: [6, 4, 7],
      target: [.4, 1.6, -.8],
    })

    const grid = new GridHelper(10, 10)
    three.scene.add(grid)

    const geometryStart = new IcosahedronGeometry(1, 4)
    const geometryEnd = geometryStart.clone()
      .applyMatrix4(makeMatrix4({ x: 2, z: -8, rotationX: 1, rotationY: 1 }))

    const pointStart = new Points(geometryStart, new PointsMaterial({ size: .05 }))
    three.scene.add(pointStart)

    const pointEnd = new Points(geometryEnd, new PointsMaterial({ size: .05 }))
    three.scene.add(pointEnd)

    const count = geometryStart.attributes.position.count
    const lines = new InstancedMesh(
      new PlaneGeometry(1, 1, 100, 1),
      new MeshBasicMaterial({ color: 0x00ff00, wireframe: true }),
      count)
    three.scene.add(lines)

    lines.material.onBeforeCompile = shader => ShaderForge.with(shader)
      .vertex.printFinalCode()

  }, 'always')
  return null
}

export function Client() {
  return (
    <div className='absolute-through p-4 flex flex-col gap-4'>
      <div className='absolute-through'>
        <ThreeProvider>
          <ThreeDemo />
        </ThreeProvider>
      </div>
      <h1 className='text-4xl'>Path with loop</h1>
      <SvgDemo />
    </div>
  )
}