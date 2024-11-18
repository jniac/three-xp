/* eslint-disable prefer-const */
import { Group, Vector2 } from 'three'

import { setup } from 'some-utils-three/utils/tree'

import { fromVector2Declaration, Vector2Declaration } from 'some-utils-ts/declaration'
import { VoxelGridChunk } from './chunk'
import { Scope } from './scope'

export function combineCoords(x: number, y: number) {
  if (x < -0x8000 || x >= 0x8000 || y < -0x8000 || y >= 0x8000) {
    throw new RangeError(`x and y must be in the range -0x8000 to 0x7fff`)
  }
  x += 0x8000
  y += 0x8000
  return (x << 16) | y
}

export function splitCoords(value: number, out = new Vector2()) {
  out.x = (value >> 16) - 0x8000
  out.y = (value & 0xffff) - 0x8000
  return out
}

const _neighborsCoordsVector = new Vector2()
function neighborsCoords(x: number, y: number): Generator<Vector2>
function neighborsCoords(chunkCoords: Vector2Declaration): Generator<Vector2>
function* neighborsCoords(...args: [number, number] | [Vector2Declaration]): Generator<Vector2> {
  let [x, y] = (() => {
    if (args.length === 1) {
      const { x, y } = fromVector2Declaration(args[0])
      return [x, y]
    } else {
      return args
    }
  })()

  yield _neighborsCoordsVector.set(Math.floor((x - 1) / 2), y - 1)
  yield _neighborsCoordsVector.set(Math.floor((x + 1) / 2), y - 1)
  yield _neighborsCoordsVector.set(x - 1, y)
  yield _neighborsCoordsVector.set(x + 1, y)
  yield _neighborsCoordsVector.set(x * 2 - 1, y + 1)
  yield _neighborsCoordsVector.set(x * 2, y + 1)
  yield _neighborsCoordsVector.set(x * 2 + 1, y + 1)
  yield _neighborsCoordsVector.set(x * 2 + 2, y + 1)
}

export class World extends Group {
  scope = setup(new Scope(), this)

  chunks = new Map<number, VoxelGridChunk>()

  destroy = () => {
    this.scope.destroy()
  }

  getChunk(x: number, y: number) {
    return this.chunks.get(combineCoords(x, y)) ?? null
  }

  ensureChunk(x: number, y: number) {
    const index = combineCoords(x, y)
    const chunk = this.chunks.get(index)
    if (chunk) {
      return chunk
    } else {
      const chunk = setup(new VoxelGridChunk({ world: this }), this)
      this.chunks.set(combineCoords(x, y), chunk)
      chunk.setGridCoords([x, y])
      return chunk
    }
  }

  ensureChunkNeighbors(x: number, y: number) {
    const chunk = this.ensureChunk(x, y)
    for (const coords of neighborsCoords(x, y)) {
      this.ensureChunk(coords.x, coords.y)
    }
  }

  ensureScopeChunks() {
    const processed = new Set<number>([combineCoords(0, 0)])
    const queue = [this.ensureChunk(0, 0)]
    const MAX = 50
    let count = 0
    while (queue.length > 0) {
      if (count++ > MAX) {
        console.error(`Exceeded maximum chunk count of ${MAX}`)
        break
      }
      const chunk = queue.pop()!
      if (this.scope.chunkIntersects(chunk)) {
        for (const coords of neighborsCoords(chunk.gridCoords)) {
          const index = combineCoords(coords.x, coords.y)
          if (!processed.has(index)) {
            processed.add(index)
            queue.push(this.ensureChunk(coords.x, coords.y))
          }
        }
      }
    }
  }
}
