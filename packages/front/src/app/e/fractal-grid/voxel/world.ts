/* eslint-disable prefer-const */
import { AxesHelper, Group, LineSegments, Matrix4, Mesh, Vector2, Vector3 } from 'three'

import { AxesGeometry } from 'some-utils-three/geometries/axis'
import { LineHelper } from 'some-utils-three/helpers/line'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { setup } from 'some-utils-three/utils/tree'
import { fromVector2Declaration, Vector2Declaration } from 'some-utils-ts/declaration'
import { calculateExponentialDecayLerpRatio } from 'some-utils-ts/math/misc/exponential-decay'

import { toChunkCoords, VoxelGridChunk } from './chunk'
import { CHUNK_POSITION_LIMIT, WORLD_BASIS, WORLD_EULER, WORLD_MATRIX, WORLD_MATRIX_INVERSE } from './math'
import { Scope } from './scope'

export function combineCoords(x: number, y: number) {
  if (x < -0x8000 || x >= 0x8000 || y < -0x8000 || y >= 0x8000) {
    throw new RangeError(`x and y must be in the range -0x8000 to 0x7fff, received: ${x} (0x${x.toString(16)}), ${y} (0x${y.toString(16)})`)
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

class SuperAxesHelper extends Group {
  parts = (() => {
    const circles = new LineHelper()
    circles
      .circle({ radius: 1, color: AxesGeometry.defaultOptions.zColor })
      .circle({ radius: 1, color: AxesGeometry.defaultOptions.xColor, transform: { rotationY: '90deg' } })
      .circle({ radius: 1, color: AxesGeometry.defaultOptions.yColor, transform: { rotationX: '90deg' } })
      .draw()

    const axes = new Mesh(new AxesGeometry(), new AutoLitMaterial({ vertexColors: true }))

    return {
      axes: setup(axes, this),
      circles: setup(circles, this),
    }
  })()

  drawCircles({
    count = 1,
    step = 1,
  } = {}) {
    for (let i = 1; i < count; i++) {
      const scale = 1 + i * step
      setup(new LineSegments(this.parts.circles.geometry, this.parts.circles.material), {
        parent: this,
        scaleScalar: scale,
      })
    }
    return this
  }
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
    rotation: WORLD_EULER,
  })

  chunkGroup = setup(new Group(), {
    parent: this,
  })

  scopeCoordinates = new Vector2()
  dampedScopeCoordinates = new Vector2()
  worldScale = 1
  scopeOriginPoint = new Vector3()
  scopeCenterChunkPoint = new Vector3()

  scope = setup(new Scope(), this)

  XXX = setup(new SuperAxesHelper(), this.chunkGroup)
  YYY = new Vector2()

  scopeUpdate(deltaTime: number) {
    const r = calculateExponentialDecayLerpRatio(.0001, deltaTime)
    this.dampedScopeCoordinates.lerp(this.scopeCoordinates, r)

    const { x, y } = this.dampedScopeCoordinates
    this.scope.position
      .set(0, 0, 6)
      .addScaledVector(WORLD_BASIS.U, x)

    this.worldScale = 2 ** (y * .33)
    this.setChunkGroupScale(this.worldScale)
  }


  private setChunkGroupScale = (() => {
    const m = new Matrix4()
    return (scale: number) => {
      this.scopeCenterChunkPoint
        .copy(this.scope.position)
        .applyMatrix4(WORLD_MATRIX_INVERSE)

      this.scopeOriginPoint
        .set(this.scopeCenterChunkPoint.x, 0, 0)
        .applyMatrix4(WORLD_MATRIX)

      this.chunkGroup.position
        .copy(this.scopeOriginPoint)
        .addScaledVector(this.scopeOriginPoint, -scale)
      this.chunkGroup.scale
        .setScalar(scale)
      this.chunkGroup
        .updateMatrix()

      this.XXX.position
        .copy(this.scope.position)
        .applyMatrix4(WORLD_MATRIX_INVERSE)
      this.XXX.position.z = 0
      this.XXX.position
        .applyMatrix4(WORLD_MATRIX)
        .applyMatrix4(m.copy(this.chunkGroup.matrix).invert())

      let { x, y } = toChunkCoords(this.XXX.position, this.YYY)
      x = Math.round(x - .5)
      y = Math.round(y + .5)
      this.toWhite()
      this.getChunk(x, y)?.toColor()
    }
  })()

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
    const MAX = 100
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

  toWhite() {
    for (const chunk of this.chunks.values()) {
      chunk.toWhite()
    }
  }

  toColor() {
    for (const chunk of this.chunks.values()) {
      chunk.toColor()
    }
  }
}
