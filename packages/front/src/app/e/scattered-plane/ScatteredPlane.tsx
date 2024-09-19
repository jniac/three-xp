import { InstancedMesh, MeshBasicMaterial, Object3D, PlaneGeometry, Vector2 } from 'three'

import { makeMatrix4 } from 'some-utils-three/utils/make'
import { addTo } from 'some-utils-three/utils/parenting'
import { Direction, Space } from 'some-utils-ts/experimental/layout/flex'
import { inverseLerp } from 'some-utils-ts/math/basic'
import { Rectangle } from 'some-utils-ts/math/geom/rectangle'
import { PRNG } from 'some-utils-ts/random/prng'
import { WireRect } from './WireRect'

type DistributionProps = typeof Distribution.defaultProps

class DistributionNode {
  constructor(
    public space: Space,
    public rect: Rectangle,
    public scatterCoeff: number,
  ) { }
}

class Distribution {
  static defaultProps = {
    position: new Vector2(0, 0),
    size: new Vector2(2, 3),
    scatterPadding: 0.1,
    sizeOptions: [
      [.5, 1],
      [1, 10],
      [2, 2],
      [3, 1],
    ] as [number, number][],
  }

  props: Readonly<DistributionProps>
  root: Space
  nodes: DistributionNode[]

  constructor(scatteredPlane: ScatteredPlane, props: Partial<DistributionProps>, seed: number | string) {
    this.props = { ...Distribution.defaultProps, ...props }

    const { position, size, scatterPadding, sizeOptions } = this.props
    const { col, row } = scatteredPlane.props

    PRNG.seed(seed)

    const sizePicker = PRNG.createPicker(sizeOptions)
    const colSizes = Array.from({ length: col }).map(sizePicker)
    const rowSizes = Array.from({ length: row }).map(sizePicker)

    const root = new Space(Direction.Horizontal)
      .setSize(size.x, size.y)
      .setOffset(position.x - size.x / 2, position.y - size.y / 2)

    for (const colSize of colSizes) {
      const colSpace = new Space(Direction.Vertical)
        .setSize(`${colSize}fr`)
        .addTo(root)

      for (const rowSize of rowSizes) {
        new Space(Direction.Horizontal)
          .setSize(`${rowSize}fr`)
          .addTo(colSpace)
      }
    }

    root.computeLayout()

    const rootRect = root.rect

    const spaces = [...root.allLeaves({ includeSelf: false })]
    const nodes = spaces.map(space => {
      const rect = space.rect.clone()
      const uvRect = rect.clone().relativeTo(rootRect)
      const { x, y } = rect.getCenter()
      const manhattanDistance = Math.abs(x) + Math.abs(y)
      const halfManhattanSize = (size.x + size.y) / 2
      const scatterCoeff = inverseLerp(.5, 1, manhattanDistance / halfManhattanSize)
      rect.centerX += PRNG.between(-scatterPadding, scatterPadding) * scatterCoeff
      rect.centerY += PRNG.between(-scatterPadding, scatterPadding) * scatterCoeff
      return {
        space,
        rect,
        scatterCoeff,
      }
    })

    this.root = root
    this.nodes = nodes
  }
}

type ScatteredPlaneProps = typeof ScatteredPlane.defaultProps

export class ScatteredPlane extends Object3D {
  static defaultProps = {
    row: 20,
    col: 30,
  }

  readonly props: Readonly<ScatteredPlaneProps>

  internal: {
    count: number
    mesh: InstancedMesh<PlaneGeometry, MeshBasicMaterial>
  }

  get count() { return this.internal.count }

  constructor(props: Partial<ScatteredPlaneProps> = {}) {
    super()
    this.props = { ...ScatteredPlane.defaultProps, ...props }

    const { row, col } = this.props
    const count = row * col
    const geometry = new PlaneGeometry()
    const material = new MeshBasicMaterial()
    const mesh = new InstancedMesh(geometry, material, count)
    addTo(mesh, this)

    this.internal = { count, mesh }

    this.distribute()
  }

  distribute(props: Partial<DistributionProps> = {}) {
    const distribution = new Distribution(this, props, ScatteredPlane.name)
    const { count, mesh } = this.internal
    for (let i = 0; i < count; i++) {
      const { rect } = distribution.nodes[i]
      mesh.setMatrixAt(i, makeMatrix4({
        position: rect.getCenter(),
        scale: rect.getSize(),
      }))
      // mesh.setColorAt(i, makeColor(`hsl(${PRNG.between(240, 360)}, 100%, 50%)`))
    }

    const { size, scatterPadding } = distribution.props
    addTo(new WireRect(size.x, size.y), this)
    addTo(new WireRect(size.x + scatterPadding * 2, size.y + scatterPadding * 2), this)
  }
}
