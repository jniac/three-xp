'use client'

import { createNoise3D } from 'simplex-noise'
import { MeshPhysicalMaterial, Vector3 } from 'three'

import { ThreeProvider, useGroup } from 'some-utils-misc/three-provider'
import { setup } from 'some-utils-three/utils/tree'

import { leak } from '@/utils/leak'

import { DebugHelper } from 'some-utils-three/helpers/debug'
import { VoxelInstances } from '../VoxelInstances'
import { LightSetup_A, ThreeSettings } from '../shared'

function MyScene() {
  leak()

  useGroup('my-scene', function* (group, three) {
    const noise3D = createNoise3D()

    const helper = setup(new DebugHelper(), {
      parent: group,
    })

    helper.regularGrid()

    const voxels = setup(new VoxelInstances({
      size: 24,
      // randomColor: true
      smoothVoxels: true,
    }, new MeshPhysicalMaterial()), {
      parent: group,
      castShadow: true,
      receiveShadow: true,
    })

    helper.box({ size: voxels.size })


    const offset = new Vector3()
    const p = new Vector3()
    yield three.ticker.onTick(tick => {
      offset.y += 3 * tick.deltaTime
      voxels.setEachVoxel((x, y, z) => {
        p.set(
          x + offset.x,
          y + offset.y,
          z + offset.z,
        ).multiplyScalar(0.05)
        const n = noise3D(p.x, p.y, p.z)
        return n > .5
      })
    })
  }, [])

  return null
}

export function PageClient() {
  return (
    <ThreeProvider
      fxaa
      vertigoControls={{
        size: 22,
        rotation: '-45deg, 45deg, 0',
      }}
    >
      <ThreeSettings />
      <LightSetup_A />
      <MyScene />
    </ThreeProvider>
  )
}
