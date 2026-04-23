'use client'

import { handleKeyboard } from 'some-utils-dom/handle/keyboard'
import { ThreeProvider, useGroup } from 'some-utils-misc/three-provider'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { setup } from 'some-utils-three/utils/tree'
import { Vector2 } from 'three'
import { VoronoiDiagram } from './VoronoiDiagram'

function MyScene() {
  useGroup('my-scene', function* (group) {
    setup(new DebugHelper(), group)
      .regularGrid()

    const colors = [
      '#f00', '#6f0', '#03f', '#ff0', '#3ff', '#f0f',
      '#f09', '#0f9', '#60f', '#fc0', '#0cf', '#90f',
    ]

    const voronoi = setup(new VoronoiDiagram({ center: 0, extent: 5 }), group)

    voronoi.setBaseSites([
      new Vector2(1, 2),
      new Vector2(-1.1, 1.2),
      new Vector2(-2, -2),
      new Vector2(1, -1.1),
      new Vector2(3, -.1),
      new Vector2(4, -2.1),
      new Vector2(1.5, -3),
      new Vector2(1, -5),
      new Vector2(4, 3),
      new Vector2(6, 0),
      new Vector2(7, -3),
      new Vector2(5, 5),
    ])
    voronoi.compute()

    yield handleKeyboard([
      [{ code: 'Space' }, () => {
        voronoi.parts.helper.visible = !voronoi.parts.helper.visible
      }]
    ])
  }, [])
  return null
}

export function PageClient() {
  return (
    <ThreeProvider
      vertigoControls={{
        size: 16,
      }}
    >
      <MyScene />
    </ThreeProvider>
  )
}