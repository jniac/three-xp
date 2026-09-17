'use client'
import { PlaneGeometry, TorusKnotGeometry } from 'three'

import { handlePointer } from 'some-utils-dom/handle/pointer'
import { ThreeProvider, useGroup } from 'some-utils-misc/three-provider'
import { DebugHelper } from 'some-utils-three/helpers/debug/debug-helper'
import { PoissonDiscSurfaceSampler } from 'some-utils-three/mesh-surface/poisson-disc-sampler'
import { SurfaceWalker } from 'some-utils-three/mesh-surface/surface-walker'
import { setup } from 'some-utils-three/utils/tree'
import { RandomUtils as R } from 'some-utils-ts/random/random-utils'

import { AutoLitWireframeMesh } from '../utils/AutoLitWireframeMesh'

function MyGroup() {
  useGroup('MyGroup', function* (group) {
    setup(new DebugHelper(), group).regularGrid()

    const geometryOptions = {
      simplePlane: new PlaneGeometry(2, 2, 10, 10),
      knot: new TorusKnotGeometry(1, .45, 100, 16),
    }

    const geometry = geometryOptions.knot

    setup(new AutoLitWireframeMesh(geometry, {
      baseColor: '#ff00ff',
    }), group)

    const walker = new SurfaceWalker()
      .fromGeometry(geometry)

    const helper = setup(new DebugHelper(), group).zOffset(.01)

    let maxCount = 10000

    const draw = () => {
      R.setRandom('parkmiller')

      let dt = -performance.now()
      const sampler = new PoissonDiscSurfaceSampler(walker, {
        radius: .1,
        maxCount: maxCount,
        random: R.random,
      })
        .start({ triangleIndex: 0, u: 1 / 3, v: 1 / 3 })
        .sampleAll()
      dt += performance.now()
      console.log(`Poisson disc sampling:\n${sampler.samples.length} samples\n${dt.toFixed(2)}ms`)

      helper.clear()
      for (const sample of sampler.samples) {
        const p = walker.surfacePointToPosition(sample)
        helper
          .point(p, { shape: 'circle', size: .03 })
        // .circle({ center: p, radius: .1 })
      }
    }

    draw()

    yield handlePointer(document.body, {
      onTap: () => {
        maxCount++
        draw()
      },
    })
  }, [])

  return null
}

export function PageClient() {
  return (
    <ThreeProvider
      vertigoControls={{
        size: 5,
      }}
    >
      <MyGroup />
    </ThreeProvider>
  )
}