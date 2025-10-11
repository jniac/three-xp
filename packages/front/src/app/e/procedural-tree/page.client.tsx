'use client'

import { CurvePath, CylinderGeometry, Group, LineCurve3, Mesh, Vector3 } from 'three'

import { ThreeProvider, useGroup } from 'some-utils-misc/three-provider'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { setup } from 'some-utils-three/utils/tree'

class Trunk extends Group {
  constructor() {
    super()
    const division = 32
    const step = 32
    const geometry = new CylinderGeometry(.5, .5, 1, division, step, true)

    setup(new Mesh(geometry, new AutoLitMaterial()), this)

    {
      const path = new CurvePath()
      path.add(new LineCurve3(new Vector3(), new Vector3(0, 2, 0)))
      path.add(new LineCurve3(new Vector3(0, 2, 0), new Vector3(1, 4, 0)))
      const helper = setup(new DebugHelper(), this)
      helper.polyline(path.getSpacedPoints(20) as Vector3[])
    }
  }
}

function MyScene() {
  useGroup('my-scene', function* (group) {
    setup(new DebugHelper(), group)
      .regularGrid({ plane: 'xz' })

    setup(new Trunk(), group)
  }, [])
  return null
}

export function PageClient() {
  return (
    <ThreeProvider
      vertigoControls={{
        rotation: '-45deg, 0, 0',
        size: 10
      }}
    >
      <div className='p-16'>
        <h1>
          Procedural Tree
        </h1>
      </div>

      <MyScene />
    </ThreeProvider>
  )
}