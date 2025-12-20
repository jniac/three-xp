'use client'

import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { setup } from 'some-utils-three/utils/tree'
import { Space } from 'some-utils-ts/experimental/layout/flex'
import { RandomUtils } from 'some-utils-ts/random/random-utils'
import { Color, Group, InstancedMesh, MeshBasicMaterial, PlaneGeometry } from 'three'

import { makeColor, makeMatrix4 } from 'some-utils-three/utils/make'
import { Rectangle } from 'some-utils-ts/math/geom/rectangle'
import { LineMaterial, LineSegments2, LineSegmentsGeometry } from 'three/examples/jsm/Addons.js'
import { colors } from '../../../shared/colors'
import { computeLayout3 } from '../../flex-algo/computeLayout3'

function createStressTestLayout({
  size: [w, h] = [8, 8],
  spacing = 0,
  depthMax = 10,
  nodeCountMax = 1e5,
  minSubdivisionSize = .2,
}): Space {
  const root = new Space({
    offset: [-w / 2, -h / 2],
    size: [w, h],
    spacing,
  })
  computeLayout3(root)
  let nodeCount = 1
  const queue = [root]
  while (nodeCount < nodeCountMax && queue.length > 0) {
    const current = queue.shift()!
    if (current.rect.width < minSubdivisionSize || current.rect.height < minSubdivisionSize)
      continue
    const direction = current.rect.aspect >= 1
    current.set({ direction })
    const childCount = 3
    nodeCount += childCount
    current.populate(childCount, { spacing })
    for (let i = 0; i < childCount; i++) {
      const size = RandomUtils.pick([1, 1, 3, 5, 10])
      current.children[i].sizeX.value = size
      current.children[i].sizeY.value = size
    }
    computeLayout3(current, current.rect)
    if (current.depth() < depthMax)
      queue.push(...current.children)
  }
  return root
}

class RectangleLines extends Group {
  constructor(rectangles: Rectangle[], colorGetter?: (index: number) => Color) {
    super()

    const positionBuffer = new Float32Array(rectangles.length * 8 * 3) // 4 segments * 3 vertices
    const colorBuffer = new Float32Array(rectangles.length * 8 * 3) // 4 segments * 3 vertices
    const defaultColor = new Color(0xffffff)
    for (let i = 0; i < rectangles.length; i++) {
      const r = rectangles[i]
      const { minX, minY, maxX, maxY } = r
      const offset = i * 8 * 3
      // bottom
      positionBuffer[offset + 0] = minX
      positionBuffer[offset + 1] = minY
      positionBuffer[offset + 2] = 0

      positionBuffer[offset + 3] = maxX
      positionBuffer[offset + 4] = minY
      positionBuffer[offset + 5] = 0

      // right
      positionBuffer[offset + 6] = maxX
      positionBuffer[offset + 7] = minY
      positionBuffer[offset + 8] = 0

      positionBuffer[offset + 9] = maxX
      positionBuffer[offset + 10] = maxY
      positionBuffer[offset + 11] = 0

      // top
      positionBuffer[offset + 12] = maxX
      positionBuffer[offset + 13] = maxY
      positionBuffer[offset + 14] = 0

      positionBuffer[offset + 15] = minX
      positionBuffer[offset + 16] = maxY
      positionBuffer[offset + 17] = 0

      // left
      positionBuffer[offset + 18] = minX
      positionBuffer[offset + 19] = maxY
      positionBuffer[offset + 20] = 0

      positionBuffer[offset + 21] = minX
      positionBuffer[offset + 22] = minY
      positionBuffer[offset + 23] = 0

      const color = colorGetter?.(i) ?? defaultColor
      color.toArray(colorBuffer, i * 8 * 3)
      color.toArray(colorBuffer, i * 8 * 3 + 3)
      color.toArray(colorBuffer, i * 8 * 3 + 6)
      color.toArray(colorBuffer, i * 8 * 3 + 9)
      color.toArray(colorBuffer, i * 8 * 3 + 12)
      color.toArray(colorBuffer, i * 8 * 3 + 15)
      color.toArray(colorBuffer, i * 8 * 3 + 18)
      color.toArray(colorBuffer, i * 8 * 3 + 21)
    }

    const lineGeometry2 = new LineSegmentsGeometry()
      .setPositions(positionBuffer)
      .setColors(colorBuffer)
    setup(new LineSegments2(lineGeometry2, new LineMaterial({
      linewidth: .01,
      worldUnits: true,
      vertexColors: true,
    })), {
      parent: this,
    })
  }
}


function MyScene() {
  const three = useThreeWebGL()
  three.pipeline.basicPasses.fxaa.enabled = !false

  useGroup('my-scene', function* (group) {
    const root = createStressTestLayout({
      size: [8, 8],
      spacing: .00,
    })
    const leaves = [...root.allLeaves()]

    const mesh = setup(new InstancedMesh(new PlaneGeometry(1, 1), new MeshBasicMaterial({ wireframe: !true }), leaves.length), group)
    const colorPicker = RandomUtils.createPicker(Object.values(colors).map(c => [1, makeColor(c).clone()]))
    for (let i = 0; i < leaves.length; i++) {
      const leaf = leaves[i]
      const { centerX, centerY, width, height } = leaf.rect.clone().shrink(.01)

      mesh.setMatrixAt(i, RandomUtils.chance(.8)
        ? makeMatrix4({ scale: 0 })
        : makeMatrix4({
          x: centerX,
          y: centerY,
          scaleX: width,
          scaleY: height,
        })
      )
      mesh.setColorAt(i, colorPicker())
    }

    setup(new RectangleLines([
      // ...root.allDescendants().filter(s => s.isLeaf() === false).map(s => s.rect)
      ...root.allLeaves().map(s => s.rect.clone().shrink(.01)),
    ], colorPicker), {
      parent: group,
      z: 0.001,
    })

  })
  return null
}

export function PageClient() {
  return (
    <ThreeProvider
      vertigoControls={{

      }}
    >
      <MyScene />
    </ThreeProvider>
  )
}