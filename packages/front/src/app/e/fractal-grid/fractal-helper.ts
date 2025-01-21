import { Group, Mesh, Ray, Vector2, Vector3, Vector4 } from 'three'

import { AxesGeometry } from 'some-utils-three/geometries/axis'
import { LineHelper } from 'some-utils-three/helpers/line'
import { TextHelper } from 'some-utils-three/helpers/text-helper'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { setup } from 'some-utils-three/utils/tree'
import { loop2Array } from 'some-utils-ts/iteration/loop'

import { CHUNK_COL, CHUNK_ROW, WORLD_EULER, WORLD_LIMIT, WORLD_PLANE } from './voxel/math'

/**
 * Convert a 2D coordinate `(x, y)` to a 3D world position.
 */
function fromCoordinates(x: number, y: number, out = new Vector4()) {
  const p = 2 ** y
  const f = 2 * (1 - 1 / p)
  const s = 1 / p // scale
  out.x = x * CHUNK_COL * s
  out.y = -CHUNK_ROW * f
  out.z = CHUNK_ROW * f + x * CHUNK_COL * s
  out.w = s
  return out
}

/**
 * Convert a 3D world position to a 2D coordinate `(x, y)`.
 */
function toCoordinates(x: number, y: number, out = new Vector2()) {
  const f = -y / CHUNK_ROW
  const s = 1 - f / 2
  out.y = -Math.log2(s)
  out.x = x / (CHUNK_COL * s)
  return out
}

/**
 * Convert a 3D world position to a 2D coordinate `(x, y)`.
 */
function toFloorCoordinates(x: number, y: number, out = new Vector2()) {
  const f = -y / CHUNK_ROW
  const s = 1 - f / 2
  out.y = Math.floor(-Math.log2(s))
  out.x = Math.floor(x / CHUNK_COL * (2 ** out.y))
  return out
}

export class FractalHelper extends Group {
  internal = (() => {
    function f(x: number, y: number) {
      const p = fromCoordinates(x, y)
      const q = toCoordinates(p.x, p.y)
      console.log(x, y, p, q)
    }
    const points = [
      new Vector3(0, 0, 0),
      new Vector3(0, -CHUNK_ROW, CHUNK_ROW),
      new Vector3(CHUNK_COL, -CHUNK_ROW, CHUNK_COL + CHUNK_ROW),
      new Vector3(CHUNK_COL, 0, CHUNK_COL),
    ]
    const lines = setup(new LineHelper(), this)
    for (let i = 0; i < 12; i++) {
      const p = 2 ** i
      const f = 2 * (1 - 1 / p)
      const scale = 1 / p
      const offset = new Vector3(0, -CHUNK_ROW * f, CHUNK_ROW * f)
      lines.polygon(points.map(p => p.clone().multiplyScalar(scale).add(offset)))
    }
    lines.polyline([[0, 0, 0], WORLD_LIMIT])
    lines.draw()
    setup(new Mesh(new AxesGeometry(), new AutoLitMaterial({ vertexColors: true })), {
      parent: this,
      position: WORLD_LIMIT,
      rotation: WORLD_EULER,
    })

    const positions = loop2Array(4, 8)

    const text = setup(new TextHelper({
      lineCount: 1,
      lineLength: 14,
    }), this)

    const pointerLine = setup(new LineHelper(100), this)

    for (const p of positions) {
      const { x, y, z, w } = fromCoordinates(p.x, p.y)
      // const pStr = `${x.toFixed(0)},${y.toFixed(0)},${z.toFixed(0)}`
      text.setTextAt(p.i + 1, `${p.x},${p.y}`, {
        textColor: 'white',
        textOpacity: 0,
        backgroundColor: 'white',
        backgroundOpacity: 1,
        position: [x, y, z],
        size: 2 * w,
      })
    }

    const pointerText = setup(new TextHelper({
      lineCount: 2,
      lineLength: 16,
    }), this)

    return {
      positions,
      text,
      pointerText,
      pointerLine,
    }
  })()

  updatePointer(ray: Ray) {
    const position = ray.intersectPlane(WORLD_PLANE, new Vector3())

    if (!position)
      return

    const { text, pointerText } = this.internal

    const coords = toFloorCoordinates(position.x, position.y)

    if (Number.isNaN(coords.x) || Number.isNaN(coords.y))
      return

    const scale = 1 / (2 ** toCoordinates(position.x, position.y, new Vector2()).y)

    for (const p of this.internal.positions) {
      const backgroundColor = p.x === coords.x && p.y === coords.y ? '#ffff66' : 'white'
      text.data.setColorAt(p.i + 1, {
        backgroundColor,
      })
    }
    text.dataTexture.needsUpdate = true
    text.material.needsUpdate = true

    pointerText.setTextAt(0, `${coords.x},${coords.y}`, {
      textColor: '#ffff66',
      textOpacity: 0,
      backgroundColor: '#ffff66',
      backgroundOpacity: 1,
      position,
      size: 3 * scale,
    })

    const v = fromCoordinates(coords.x, coords.y)
    this.internal.pointerLine
      .clear()
      .line(position, [v.x, v.y, v.z], { color: '#ffff66' })
      .draw()
  }
}
