import { BufferGeometry, Line, LineBasicMaterial, Vector2 } from 'three'

export class WireRect extends Line {
  constructor(width = 1, height = 1) {
    const w2 = width / 2
    const h2 = height / 2
    const geometry = new BufferGeometry().setFromPoints([
      new Vector2(-w2, -h2),
      new Vector2(+w2, -h2),
      new Vector2(+w2, +h2),
      new Vector2(-w2, +h2),
      new Vector2(-w2, -h2),
    ])
    super(geometry, new LineBasicMaterial())
  }
}
