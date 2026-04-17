'use client'

import { ThreeProvider, useGroup, useThree } from 'some-utils-misc/three-provider'
import { createNaiveChunkGeometries, World } from 'some-utils-three/experimental/voxel'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { loop3 } from 'some-utils-ts/iteration/loop'
import { BoxGeometry, Mesh } from 'three'

function MyScene() {
  const three = useThree()

  useGroup('my-scene', function* (group) {
    const world = new World()

    const plainVoxel = world.createVoxelState(0xffffffff)

    const r = 4
    for (const { x, y, z } of loop3({ min: -r, max: r + 1 })) {
      if (Math.hypot(x + .5, y + .5, z + .5) < r) {
        world.setVoxelState(x, y, z, plainVoxel)
      }
    }

    for (const { x, y, z } of loop3({ min: [0, -4, 0], max: [8, 0, 8] })) {
      world.setVoxelState(x, y, z, plainVoxel)
    }

    for (const { x, y, z } of loop3({ min: [0, -4, 0], max: [5, 1, 5] })) {
      world.setVoxelState(x, y, z, plainVoxel)
    }

    const colors = [
      '#fc3', '#9cf', '#59f', '#f9f', '#9f9', '#ffa', '#f99', '#9ff', '#99f',
      '#ea0', '#6af', '#26d', '#f6f', '#3f9', '#ed3', '#f66', '#3cc', '#66f',
    ]

    for (const [i, geometry] of createNaiveChunkGeometries(world).entries()) {
      const material = new AutoLitMaterial({ color: colors[i % colors.length], wireframe: true })
      const mesh = new Mesh(geometry, material)
      group.add(mesh)
    }

    let boxCount = 0
    for (const { chunk } of world.enumerateChunks()) {
      for (const box of chunk.allGreedyBoxes()) {
        const { min, max } = box
        const geometry = new BoxGeometry(max.x - min.x, max.y - min.y, max.z - min.z)
          .translate((min.x + max.x) / 2, (min.y + max.y) / 2, (min.z + max.z) / 2)
        const material = new AutoLitMaterial({ color: colors[boxCount++ % colors.length] })
        const mesh = new Mesh(geometry, material)
        mesh.position.copy(chunk.mountState!.worldPosition)
        group.add(mesh)
        boxCount++
      }
    }

    console.log(boxCount, world.computePlainVoxelCount())
  }, [])

  return null
}

export function PageClient() {
  return (
    <ThreeProvider
      // fxaa
      vertigoControls={{
        size: 30,
        rotation: '-35deg, 45deg, 0deg',
      }}
    >
      <div className='p-8 thru'>
        <h1>
          Graphic Art 4
        </h1>
      </div>
      <MyScene />
    </ThreeProvider>
  )
}