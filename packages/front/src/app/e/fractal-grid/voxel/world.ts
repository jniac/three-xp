/* eslint-disable prefer-const */
import { Group, Vector2 } from 'three'

import { setup } from 'some-utils-three/utils/tree'

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
function* neighborsCoords(x: number, y: number) {
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
    const queue = [this.ensureChunk(0, 0)]
    while (queue.length > 0) {
      const chunk = queue.pop()!
      this.scope.chunkIntersects(chunk)
    }
  }
}
