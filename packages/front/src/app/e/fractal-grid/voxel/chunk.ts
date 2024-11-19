/* eslint-disable prefer-const */
import { AxesHelper, BufferGeometry, ColorRepresentation, IcosahedronGeometry, InstancedMesh, Mesh, Vector2, Vector3 } from 'three'

import { fromVector2Declaration } from 'some-utils-three/declaration'
import { Chunk, createNaiveVoxelGeometry } from 'some-utils-three/experimental/voxel'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { makeColor, makeMatrix4 } from 'some-utils-three/utils/make'
import { setup } from 'some-utils-three/utils/tree'
import { Vector2Declaration } from 'some-utils-ts/declaration'
import { loop2, loop3 } from 'some-utils-ts/iteration/loop'
import { PRNG } from 'some-utils-ts/random/prng'

import { Scope } from './scope'
import { World } from './world'

export const CHUNK_COL = 6
export const CHUNK_ROW = 4
export const BLOCK_SIZE = 4
export const CHUNK_SCALE = 1

export const CHUNK_SIZE = new Vector3(CHUNK_COL, CHUNK_ROW, CHUNK_COL + CHUNK_ROW - 1)

export const CHUNK_CORNERS = [
  new Vector3(0, 0, CHUNK_ROW).multiplyScalar(CHUNK_SCALE),
  new Vector3(0, CHUNK_ROW, 0).multiplyScalar(CHUNK_SCALE),
  new Vector3(CHUNK_COL, 0, CHUNK_ROW + CHUNK_COL - 1).multiplyScalar(CHUNK_SCALE),
  new Vector3(CHUNK_COL, CHUNK_ROW, CHUNK_COL).multiplyScalar(CHUNK_SCALE),
]

export function fromChunkCoords(x: number, y: number, out = new Vector3()) {
  const p = .5 ** y
  const q = p * .5 // .5 ** (y + 1)

  const px = x * CHUNK_COL * p
  const py = CHUNK_ROW * (2 * q - 1)
  const pz = x * CHUNK_COL * p
    + 2 * CHUNK_ROW * (1 - p)

  return out
    .set(px, py, pz)
    .multiplyScalar(CHUNK_SCALE)
}

export const CHUNK_POSITION_LIMIT = new Vector3(0, -CHUNK_ROW, 2 * CHUNK_ROW)

function cube(chunk: Chunk, p: Vector3, size: number, value = 1) {
  const { x: px, y: py, z: pz } = p
  const xMax = px + size
  const yMax = py + size
  const zMax = pz + size
  for (let z = pz; z < zMax; z++) {
    for (let y = py; y < yMax; y++) {
      for (let x = px; x < xMax; x++) {
        chunk.getVoxelState(x, y, z).setInt8(0, value)
      }
    }
  }
}

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
  const size = CHUNK_SIZE.clone().multiplyScalar(BLOCK_SIZE / stride)
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
  const size = CHUNK_SIZE.clone().multiplyScalar(BLOCK_SIZE / stride)
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

export class VoxelGridChunk extends Mesh<BufferGeometry, AutoLitMaterial> {
  _gridCoords: Vector2 = new Vector2()

  chunk: Chunk
  world: World | null = null
  color: ColorRepresentation

  constructor({
    world = <World | null>null,
    color = <ColorRepresentation>(0xffffff * PRNG.random()),
    // color = <ColorRepresentation>0xffffff,
  } = {}) {
    const MAX_VOXELS = Math.ceil(CHUNK_COL * CHUNK_ROW * BLOCK_SIZE * 1.2)
    const chunk = new Chunk(MAX_VOXELS, 1)

    const p = new Vector3()

    for (const { x, y } of loop2(CHUNK_COL, CHUNK_ROW)) {
      p
        .set(x, y, x + CHUNK_ROW - 1 - y)
        .multiplyScalar(BLOCK_SIZE)
      cube(chunk, p, BLOCK_SIZE)
    }

    // Add extra blocks to the top row
    for (let x = 0; x < CHUNK_COL; x += 2) {
      p
        .set(x + 1, CHUNK_ROW - 1, x)
        .multiplyScalar(BLOCK_SIZE)
      cube(chunk, p, BLOCK_SIZE)

      if (PRNG.chance(.8)) {
        p
          .set(x + 1, CHUNK_ROW, x)
          .multiplyScalar(BLOCK_SIZE)
        cube(chunk, p, BLOCK_SIZE)
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
    const geometry = createNaiveVoxelGeometry(chunk.voxelFaces())
    console.timeEnd('geometry')
    const s = CHUNK_SCALE / BLOCK_SIZE
    geometry.scale(s, s, s)

    const material = new AutoLitMaterial({ color })

    super(geometry, material)

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
}
