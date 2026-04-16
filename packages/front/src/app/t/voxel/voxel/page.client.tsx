'use client'

import { ThreeProvider, useGroup } from 'some-utils-misc/three-provider'
import { Direction, Face } from 'some-utils-three/experimental/voxel'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { setup } from 'some-utils-three/utils/tree'
import { Vector3 } from 'three'

function ThreeSettings() {
  return null
}

function MainComponent() {
  useGroup('main', function* (group, three) {
    setup(new DebugHelper(), group)
      .regularGrid()

    const helper = setup(new DebugHelper(), group).onTop()

    const faces = [
      new Face(new Vector3(0, 0, 0), Direction.R),
      new Face(new Vector3(0, 0, 0), Direction.L),
      new Face(new Vector3(0, 0, 0), Direction.U),
      new Face(new Vector3(0, 0, 0), Direction.D),
      new Face(new Vector3(0, 0, 0), Direction.F),
      new Face(new Vector3(0, 0, 0), Direction.B),
    ]

    const drawFace = (face: Face) => {
      const A = new Vector3(), B = new Vector3(), C = new Vector3()

      const array = face.positionToArray()
      A.fromArray(array, 0)
      B.fromArray(array, 3)
      C.fromArray(array, 6)
      helper.polygon([A, B, C], { color: '#ff0', points: { size: .05 } })
      A.fromArray(array, 9)
      B.fromArray(array, 12)
      C.fromArray(array, 15)
      helper.polygon([A, B, C], { color: '#ff0', points: { size: .05 } })

      helper.basis([face.origin(), face.tangent(), face.bitangent(), face.normal()], { size: .25 })

      const min = face.min()
      helper
        .point(min, { color: '#f03' })
        .text(min, `min(${min.x},${min.y},${min.z})`, { color: '#f03', size: .2, offset: [0, -.1, 0] })
      const max = face.max()
      helper
        .point(max, { color: '#30f' })
        .text(max, `max(${max.x},${max.y},${max.z})`, { color: '#30f', size: .2, offset: [0, .1, 0] })
    }

    yield three.ticker.onTick(() => {
      helper.clear()

      helper.box({ min: 0, max: 1 })

      for (const face of faces) {
        const I = face.rayIntersection(three.pointer.ray)
        if (I) {
          drawFace(face)
          helper.point(I.point(), { color: '#0f3', size: .1 })
        }
      }
    })

  }, [])

  return null
}

export function PageClient() {
  return (
    <ThreeProvider
      vertigoControls
    >
      <ThreeSettings />
      <MainComponent />
    </ThreeProvider>
  )
}