'use client'
import { Color, Curve, Group, LineCurve3, Mesh, Vector3 } from 'three'

import { ThreeInstance, ThreeProvider, useThreeWebGL } from 'some-utils-misc/three-provider'
import { debugHelper } from 'some-utils-three/helpers/debug'
import { setup } from 'some-utils-three/utils/tree'
import { SVGLoader } from 'three/examples/jsm/Addons.js'
import { SimplePath } from '../me/path-builder'
import { StrokeGeometry } from '../me/shapes/playground/geometries/stroke'

function ThreeSettings() {
  const three = useThreeWebGL()
  three.pipeline.basicPasses.fxaa.enabled = false
  three.scene.background = new Color('#ccc')
  return null
}

const svgLoader = new SVGLoader()
function getSquarePath(): Curve<Vector3> {
  // const path = new LinearPath2()
  // path.closed = true
  // path.points = []

  const d = SimplePath.instance.rect([0, 0, 3, 3]).roundCorner(() => ({ radius: .5 })).getPathData()
  const svgData = svgLoader.parse(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="${d}" /></svg>`)
  const points = svgData.paths[0].toShapes(true)[0].getPoints()
  debugHelper.points(points, { size: 0.05, color: 'red' })
  return new LineCurve3()
}

class NineCircles extends Group {
  parts = {
    debugHelper: setup(debugHelper, this),
    // square: setup(new Mesh(new PlaneGeometry(3, 3)), this),
    square1: setup(new Mesh(new StrokeGeometry(getSquarePath(), {})), this),
  }
}

export function PageClient() {
  return (
    <ThreeProvider
      vertigoControls={{
        size: 4,
      }}
    >
      <ThreeSettings />
      <ThreeInstance value={NineCircles} />
      <h1>
        Nine Circles
      </h1>
    </ThreeProvider>
  )
}
