import { Vector2 } from 'three'

import { fromVector2Declaration, Vector2Declaration } from 'some-utils-three/declaration'
import { Direction, Space } from 'some-utils-ts/experimental/layout/flex'
import { inverseLerp } from 'some-utils-ts/math/basic'
import { Rectangle } from 'some-utils-ts/math/geom/rectangle'
import { PRNG } from 'some-utils-ts/random/prng'
import { ScatteredPlane } from './scattered'

export class DistributionNode {
  r0 = PRNG.random()
  r1 = PRNG.random()
  constructor(
    public space: Space,
    public rect: Rectangle,
    public uvRect: Rectangle,
    public scatterCoeff: number,
  ) { }
}

export type DistributionProps = typeof Distribution.defaultProps

export class Distribution {
  static defaultProps = {
    seed: <number | string>87654,
    position: <Vector2Declaration>new Vector2(0, 0),
    size: <Vector2Declaration>new Vector2(3, 2),
    scatterPadding: 0.1,
    sizeOptions: <[number, number][]>[
      [.5, 1],
      [1, 10],
      [2, 2],
      [3, 1],
    ],
  }

  props: Readonly<DistributionProps>
  root: Space
  nodes: DistributionNode[]

  constructor(scatteredPlane: ScatteredPlane, props: Partial<DistributionProps>) {
    this.props = { ...Distribution.defaultProps, ...props }

    const { position, size, scatterPadding, sizeOptions, seed } = this.props
    const { col, row } = scatteredPlane.props

    PRNG.seed(seed)

    const sizePicker = PRNG.createPicker(sizeOptions)
    const colSizes = Array.from({ length: col }).map(sizePicker)
    const rowSizes = Array.from({ length: row }).map(sizePicker)

    const { x: px, y: py } = fromVector2Declaration(position)
    const { x: sx, y: sy } = fromVector2Declaration(size)
    const root = new Space(Direction.Horizontal)
      .setSize(sx, sy)
      .setOffset(px - sx / 2, py - sy / 2)

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
    const halfManhattanSize = (sx + sy) / 2
    const nodes = spaces.map(space => {
      const rect = space.rect.clone()
      const uvRect = rect.clone().relativeTo(rootRect)
      const { x, y } = rect.getCenter()
      const manhattanDistance = Math.abs(x - px) + Math.abs(y - py)
      const scatterCoeff = inverseLerp(.5, 1, manhattanDistance / halfManhattanSize)
      rect.centerX += PRNG.between(-scatterPadding, scatterPadding) * scatterCoeff
      rect.centerY += PRNG.between(-scatterPadding, scatterPadding) * scatterCoeff
      return new DistributionNode(
        space,
        rect,
        uvRect,
        scatterCoeff,
      )
    })

    this.root = root
    this.nodes = nodes
  }
}