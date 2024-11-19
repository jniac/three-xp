/* eslint-disable prefer-const */
import { AxesHelper, Group, IcosahedronGeometry, Mesh, Vector2 } from 'three'

import { setup } from 'some-utils-three/utils/tree'
import { fromVector2Declaration, Vector2Declaration } from 'some-utils-ts/declaration'

import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { CHUNK_POSITION_LIMIT, VoxelGridChunk } from './chunk'
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

  const v = _neighborsCoordsVector
  yield v.set(Math.floor((x - 1) / 2), y - 1)
  yield v.set(Math.floor((x + 1) / 2), y - 1)
  yield v.set(x - 1, y)
  yield v.set(x + 1, y)
  yield v.set(x * 2 - 1, y + 1)
  yield v.set(x * 2, y + 1)
  yield v.set(x * 2 + 1, y + 1)
  yield v.set(x * 2 + 2, y + 1)
}

export class World extends Group {
  static instances = [] as World[]
  static current() {
    if (this.instances.length === 0)
      throw new Error(`No World!`)
    return this.instances[this.instances.length - 1]
  }

  origin = setup(new AxesHelper(), {
    parent: this,
    position: CHUNK_POSITION_LIMIT,
  })

  chunkWrapper = setup(new Group(), {
    parent: this,
    position: CHUNK_POSITION_LIMIT,
  })
  chunkGroup = setup(new Group(), {
    parent: this.chunkWrapper,
    position: CHUNK_POSITION_LIMIT.clone().negate(),
  })
  sphere = setup(new Mesh(new IcosahedronGeometry(1, 8), new AutoLitMaterial({ wireframe: true })), {
    parent: this.chunkWrapper,
  })

  scope = setup(new Scope(), this)

  chunks = new Map<number, VoxelGridChunk>()

  constructor() {
    super()
    World.instances.push(this)
  }

  destroy = () => {
    this.scope.destroy()
    this.chunks.clear()
    this.clear()

    const index = World.instances.indexOf(this)
    if (index === -1)
      throw new Error(`World instance not found`)
    World.instances.splice(index, 1)
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
      const chunk = setup(new VoxelGridChunk({ world: this }), this.chunkGroup)
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

  white() {
    for (const chunk of this.chunks.values()) {
      chunk.material.color.set(0xffffff)
    }
  }

  color() {
    for (const chunk of this.chunks.values()) {
      chunk.material.color.set(chunk.color)
    }
  }
}
