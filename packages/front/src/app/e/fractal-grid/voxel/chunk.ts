/* eslint-disable prefer-const */
import { AxesHelper, BufferAttribute, BufferGeometry, ColorRepresentation, DoubleSide, IcosahedronGeometry, InstancedMesh, Mesh, Vector2, Vector3 } from 'three'

import { fromVector2Declaration } from 'some-utils-three/declaration'
import { Chunk, createNaiveVoxelGeometry } from 'some-utils-three/experimental/voxel'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { makeColor, makeMatrix4 } from 'some-utils-three/utils/make'
import { setup } from 'some-utils-three/utils/tree'
import { Vector2Declaration } from 'some-utils-ts/declaration'
import { loop2, loop3 } from 'some-utils-ts/iteration/loop'
import { PRNG } from 'some-utils-ts/random/prng'

import { CHUNK_COL, CHUNK_CORNERS, CHUNK_ROW, CHUNK_SIZE, WORLD_BASIS } from './math'
import { Scope } from './scope'
import { FractalGridWorld } from './world'

const CHUNK_BLOCK_SIZE = 4

/**
 * Converts chunk coordinates `(x, y)` to a plane coordinate `(x, y, x + CHUNK_ROW - 1 - y)`.
 */
function toChunkSlope(x: number, y: number, out = new Vector3()) {
  return out.set(x, y, x - y)
}

export function fromChunkCoords(x: number, y: number, out = new Vector3()) {
  const p = .5 ** y
  const q = p * .5 // .5 ** (y + 1)

  const px = x * CHUNK_COL * p
  const py = CHUNK_ROW * (2 * q - 1)
  const pz = x * CHUNK_COL * p
    + 2 * CHUNK_ROW * (1 - p)

  return out.set(px, py, pz)
}

export function toChunkCoords(px: number, py: number, pz?: number, out?: Vector2): Vector2
export function toChunkCoords(p: Vector3, out?: Vector2): Vector2
export function toChunkCoords(...args: any[]) {
  let px = 0, py = 0
  let out: Vector2 | undefined

  if (typeof args[0] === 'number') {
    [px, py] = args
    out = args[3] ?? new Vector2()
  } else {
    const [p] = args
    px = p.x
    py = p.y
    out = args[1] ?? new Vector2()
  }

  // Step 1: Compute `y` from `py`
  const q = (py / CHUNK_ROW + 1) / 2
  const y = -Math.log2(q) - 1

  // Step 2: Compute `p` from `y`
  const p = 0.5 ** y

  // Step 3: Compute `x` from `px`
  const x = px / (CHUNK_COL * p)

  return out!.set(x, y)
}

function cube(chunk: Chunk, p: Vector3, size: number, value = 1) {
  const { x: px, y: py, z: pz } = p
  const xMax = px + size
  const yMax = py + size
  const zMax = pz + size
  for (let z = pz; z < zMax; z++) {
    for (let y = py; y < yMax; y++) {
      for (let x = px; x < xMax; x++) {
        chunk.getVoxelState(x, y, z + CHUNK_ROW * CHUNK_BLOCK_SIZE).setInt8(0, value)
      }
    }
  }
}

/**
 * Returns `true` if the voxel at `(x, y, z)` is a summit.
 */
function isSummit(chunk: Chunk, x: number, y: number, z: number, stride = 1) {
  const plain = chunk.getVoxelState(x, y, z).getInt8(0) > 0
  if (!plain)
    return false

  const plainX = (chunk.tryGetVoxelState(x - stride, y, z)?.getInt8(0) ?? 0) > 0
  if (plainX)
    return false

  const plainY = (chunk.tryGetVoxelState(x, y + stride, z)?.getInt8(0) ?? 0) > 0
  if (plainY)
    return false

  const plainZ = (chunk.tryGetVoxelState(x, y, z + stride)?.getInt8(0) ?? 0) > 0
  if (plainZ)
    return false

  return true
}

/**
 * Returns `true` if the voxel at `(x, y, z)` is a cavity.
 */
function isCavity(chunk: Chunk, x: number, y: number, z: number, stride = 1) {
  const plain = chunk.getVoxelState(x, y, z).getInt8(0) > 0
  if (plain)
    return false

  const plainX = (chunk.tryGetVoxelState(x + stride, y, z)?.getInt8(0) ?? 0) > 0
  if (!plainX)
    return false

  const plainY = (chunk.tryGetVoxelState(x, y - stride, z)?.getInt8(0) ?? 0) > 0
  if (!plainY)
    return false

  const plainZ = (chunk.tryGetVoxelState(x, y, z - stride)?.getInt8(0) ?? 0) > 0
  if (!plainZ)
    return false

  return true
}

function getSomeSummits(chunk: Chunk, stride = 2) {
  const size = CHUNK_SIZE.clone().multiplyScalar(CHUNK_BLOCK_SIZE / stride)
  const result = [] as Vector3[]
  for (const it of loop3(size)) {
    const x = it.x * stride
    const y = it.y * stride
    const z = it.z * stride
    if (isSummit(chunk, x, y, z, stride)) {
      if (PRNG.chance(1 - it.py))
        result.push(new Vector3(x, y, z))
    }
  }
  return result
}

function getSomeCavities(chunk: Chunk, stride = 2) {
  const size = CHUNK_SIZE.clone().multiplyScalar(CHUNK_BLOCK_SIZE / stride)
  const result = [] as Vector3[]
  for (const it of loop3(size)) {
    const x = it.x * stride
    const y = it.y * stride
    const z = it.z * stride
    if (isCavity(chunk, x, y, z, stride)) {
      if (PRNG.chance(1 - it.py))
        result.push(new Vector3(x, y, z))
    }
  }
  return result
}

/**
 * Returns a "slope" geometry, for debugging purposes.
 */
function createSlopeGeometry() {
  const geometry = new BufferGeometry()

  geometry.index = new BufferAttribute(new Uint16Array([0, 2, 1, 0, 3, 2]), 1)

  const x = CHUNK_COL
  const y = CHUNK_ROW
  const positionArray = new Float32Array(12)
  const offset = new Vector3(0, 0, 1)
  toChunkSlope(0, 0).add(offset).toArray(positionArray, 0)
  toChunkSlope(x, 0).add(offset).toArray(positionArray, 9)
  toChunkSlope(x, y).add(offset).toArray(positionArray, 6)
  toChunkSlope(0, y).add(offset).toArray(positionArray, 3)
  geometry.setAttribute('position', new BufferAttribute(positionArray, 3))

  const normalArray = new Float32Array(12)
  WORLD_BASIS.W.toArray(normalArray, 0)
  WORLD_BASIS.V.toArray(normalArray, 3)
  WORLD_BASIS.W.toArray(normalArray, 6)
  WORLD_BASIS.V.toArray(normalArray, 9)
  geometry.setAttribute('normal', new BufferAttribute(new Float32Array([0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0]), 3))

  const colorArray = new Float32Array(12).fill(1)
  geometry.setAttribute('color', new BufferAttribute(colorArray, 3))

  return geometry
}


const _p = new Vector3()
const _q = new Vector3()

export class FractalGridChunk extends Mesh<BufferGeometry, AutoLitMaterial> {
  _gridCoords: Vector2 = new Vector2()

  chunk: Chunk
  world: FractalGridWorld | null = null
  color: ColorRepresentation

  constructor({
    world = <FractalGridWorld | null>null,
    color = <ColorRepresentation>(0xffffff * PRNG.random()),
    // color = <ColorRepresentation>0xffffff,
  } = {}) {
    const MAX_VOXELS = Math.ceil(CHUNK_COL * CHUNK_ROW * CHUNK_BLOCK_SIZE * 1.2)
    const chunk = new Chunk(MAX_VOXELS, 1)

    for (const { x, y } of loop2(CHUNK_COL, CHUNK_ROW)) {
      toChunkSlope(x, y, _p)
        .multiplyScalar(CHUNK_BLOCK_SIZE)
      cube(chunk, _p, CHUNK_BLOCK_SIZE)
    }

    // Add extra blocks to the top row
    for (let x = 0; x < CHUNK_COL; x += 2) {
      toChunkSlope(x, CHUNK_ROW - 1, _p)
        .add(new Vector3(1, 0, 0))
        .multiplyScalar(CHUNK_BLOCK_SIZE)
      cube(chunk, _p, CHUNK_BLOCK_SIZE)

      if (PRNG.chance(.8)) {
        toChunkSlope(x, CHUNK_ROW - 1, _p)
          .add(new Vector3(1, 1, 0))
          .multiplyScalar(CHUNK_BLOCK_SIZE)
        cube(chunk, _p, CHUNK_BLOCK_SIZE)
      }
    }

    {
      const cavities = getSomeCavities(chunk, 2)
      const summits = getSomeSummits(chunk, 2)
      for (const p of cavities) {
        cube(chunk, p, 2, 1)
      }
      for (const p of summits) {
        cube(chunk, p, 2, 0)
      }
    }

    {
      const cavities = getSomeCavities(chunk, 1)
      const summits = getSomeSummits(chunk, 1)
      for (const p of cavities) {
        if (PRNG.chance(.25))
          cube(chunk, p, 1, 1)
      }
      for (const p of summits) {
        if (PRNG.chance(.25))
          cube(chunk, p, 1, 0)
      }
    }

    console.time('geometry')
    // const geometry = new BufferGeometry()
    const geometry = createNaiveVoxelGeometry(chunk.voxelFaces())
    console.timeEnd('geometry')
    const s = 1 / CHUNK_BLOCK_SIZE
    geometry.scale(s, s, s)

    const material = new AutoLitMaterial({ color })

    super(geometry, new AutoLitMaterial({ color, side: DoubleSide }))

    setup(new Mesh(geometry, material), this)

    setup(new AxesHelper(), this)

    this.chunk = chunk
    this.color = color
    this.world = world
  }

  dots: InstancedMesh | null = null
  createDots() {
    const dots = new InstancedMesh(
      new IcosahedronGeometry(.1, 8),
      new AutoLitMaterial(),
      4)
    setup(dots, this)
    for (const [index, position] of CHUNK_CORNERS.entries()) {
      dots.setMatrixAt(index, makeMatrix4({ position }))
      dots.setColorAt(index, makeColor('#ffffff'))
    }
    this.dots = dots
    return this
  }

  updateDots(scope: Scope) {
    if (!this.dots) {
      this.createDots()
    }
    const dots = this.dots!
    for (const [index, corner] of CHUNK_CORNERS.entries()) {
      dots.setMatrixAt(index, makeMatrix4({ position: corner }))
      const color = scope.isWithin(corner) ? '#00ffa6' : '#ff0000'
      dots.setColorAt(index, makeColor(color))
    }
    dots.instanceMatrix.needsUpdate = true
    dots.instanceColor!.needsUpdate = true
  }

  get gridCoords() {
    return this._gridCoords
  }

  setGridCoords(value: Vector2Declaration) {
    fromVector2Declaration(value, this._gridCoords)
    const { x, y } = this._gridCoords
    this.scale.setScalar(.5 ** y)
    fromChunkCoords(x, y, this.position)
  }

  toWhite() {
    this.material.color.set(0xffffff)
  }

  toColor() {
    this.material.color.set(this.color)
  }
}
