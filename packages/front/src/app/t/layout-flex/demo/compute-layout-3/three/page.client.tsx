'use client'

import { BufferAttribute, BufferGeometry, Color, Group, InstancedMesh, Mesh, MeshBasicMaterial, PlaneGeometry } from 'three'
import { LineMaterial, LineSegments2, LineSegmentsGeometry } from 'three/examples/jsm/Addons.js'

import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { makeColor, makeMatrix4 } from 'some-utils-three/utils/make'
import { setup } from 'some-utils-three/utils/tree'
import { Space } from 'some-utils-ts/experimental/layout/flex'
import { Rectangle } from 'some-utils-ts/math/geom/rectangle'
import { RandomUtils as R } from 'some-utils-ts/random/random-utils'

import { colors } from '../../../shared/colors'
import { computeLayout3 } from '../../flex-algo/computeLayout3'

function createStressTestLayout({
  size: [w, h] = [8, 8],
  spacing = 0,
  depthMax = 10,
  nodeCountMax = 1e5,
  minSubdivisionSize = .25,
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
      const size = R.pick([1, 1, 2, 4])
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

class Frames extends Group {
  constructor(rectangles: Rectangle[], lineWidth = .01, colorGetter?: (index: number) => Color) {
    super()
    const d = lineWidth / 2
    const positionBuffer = new Float32Array(rectangles.length * 8 * 3)
    const colorBuffer = new Float32Array(rectangles.length * 8 * 3)
    const defaultColor = new Color(0xffffff)
    const indexBuffer = new Uint16Array(rectangles.length * 8 * 2 * 3)
    const indices = [
      0, 4, 1, 1, 4, 5,
      1, 5, 2, 2, 5, 6,
      2, 6, 3, 3, 6, 7,
      3, 7, 0, 0, 7, 4,
    ]
    for (let i = 0; i < rectangles.length; i++) {
      {
        // POSITIONS:

        const { minX, minY, maxX, maxY } = rectangles[i]
        const offset = i * 8 * 3
        // OUTER rectangle
        positionBuffer[offset + 0] = minX - d
        positionBuffer[offset + 1] = minY - d
        positionBuffer[offset + 2] = 0

        positionBuffer[offset + 3] = maxX + d
        positionBuffer[offset + 4] = minY - d
        positionBuffer[offset + 5] = 0

        positionBuffer[offset + 6] = maxX + d
        positionBuffer[offset + 7] = maxY + d
        positionBuffer[offset + 8] = 0

        positionBuffer[offset + 9] = minX - d
        positionBuffer[offset + 10] = maxY + d
        positionBuffer[offset + 11] = 0

        // INNER rectangle
        positionBuffer[offset + 12] = minX + d
        positionBuffer[offset + 13] = minY + d
        positionBuffer[offset + 14] = 0

        positionBuffer[offset + 15] = maxX - d
        positionBuffer[offset + 16] = minY + d
        positionBuffer[offset + 17] = 0

        positionBuffer[offset + 18] = maxX - d
        positionBuffer[offset + 19] = maxY - d
        positionBuffer[offset + 20] = 0

        positionBuffer[offset + 21] = minX + d
        positionBuffer[offset + 22] = maxY - d
        positionBuffer[offset + 23] = 0
      }

      {
        // COLORS:
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

      {
        // INDICES:
        const offset = i * 8 * 2 * 3
        const vertexOffset = i * 8
        for (let j = 0; j < indices.length; j++) {
          indexBuffer[offset + j] = vertexOffset + indices[j]
        }
      }
    }

    const geometry = new BufferGeometry()
    geometry.setAttribute('position', new BufferAttribute(positionBuffer, 3))
    geometry.setAttribute('color', new BufferAttribute(colorBuffer, 3))
    geometry.setIndex(new BufferAttribute(indexBuffer, 1))

    const material = new MeshBasicMaterial({
      // wireframe: true,
      color: 0xffffff,
      side: 2,
      vertexColors: true,
    })

    setup(new Mesh(geometry, material), {
      parent: this,
    })
  }
}

function MyScene() {
  const three = useThreeWebGL()
  three.pipeline.basicPasses.fxaa.enabled = !false

  useGroup('my-scene', function* (group) {
    R.setRandom('parkmiller', 'stress-test-layout-123')

    console.time('create layout')
    const root = createStressTestLayout({
      size: [20, 20],
      spacing: .04,
    })
    console.timeEnd('create layout')
    console.log(`Layout created with ${root.descendantsCount()} nodes (${root.leavesCount()} leaves).`)

    const leaves = [...root.allLeaves()]

    const mesh = setup(new InstancedMesh(new PlaneGeometry(1, 1), new MeshBasicMaterial({ wireframe: !true }), leaves.length), {
      parent: group,
      // visible: false,
    })
    // const colorPicker = RandomUtils.createPicker(Object.values(colors).map(c => [1, makeColor(c).clone()]))
    const colorPicker = R.createPicker([
      [80, makeColor(colors.white).clone()],
      [20, makeColor(colors.yellow).clone()],
      [20, makeColor(colors.pink).clone()],
      // [5, makeColor(colors.blue).clone()],
      [50, makeColor(colors.paleGreen).clone()],
    ])
    for (let i = 0; i < leaves.length; i++) {
      const leaf = leaves[i]
      const { centerX, centerY, width, height } = leaf.rect
        .clone().inflate(.01)

      mesh.setMatrixAt(i, R.chance(0)
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
      ...root.allDescendants()
        // .filter(s => s.isLeaf() === false)
        .map(s => s.rect)
      // ...root.allLeaves().map(s => s.rect.clone().shrink(.01)),
    ], colorPicker), {
      parent: group,
      visible: false,
      z: 0.001,
    })

    setup(new Frames([
      // Rectangle.from({ minX: -4, minY: -4, maxX: 4, maxY: 4 }),
      // Rectangle.from({ min: [-1, -1], max: [4, 4] })
      ...root.allDescendants().filter(s => s.isLeaf() === false).map(s => s.rect),
    ], .02, colorPicker), {
      parent: group,
      visible: true,
    })
  })
  return null
}

export function PageClient() {
  return (
    <ThreeProvider
      vertigoControls={{
        // rotation: '-30deg, 0, 0',
        rotation: '0, 0, 45deg',
      }}
    >
      <MyScene />
    </ThreeProvider>
  )
}