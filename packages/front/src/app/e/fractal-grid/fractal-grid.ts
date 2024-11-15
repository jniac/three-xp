/* eslint-disable prefer-const */
import { ColorRepresentation, Mesh, MeshBasicMaterial, PlaneGeometry, TorusKnotGeometry, Vector2, Vector3 } from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import { fromVector2Declaration } from 'some-utils-three/declaration'
import { Chunk, createNaiveVoxelGeometry } from 'some-utils-three/experimental/voxel'
import { AxesGeometry } from 'some-utils-three/geometries/axis'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { SkyMesh } from 'some-utils-three/objects/sky-mesh'
import { setvertexColors } from 'some-utils-three/utils/geometry'
import { setup } from 'some-utils-three/utils/tree'
import { Vector2Declaration } from 'some-utils-ts/declaration'
import { loop2, loop3 } from 'some-utils-ts/iteration/loop'

import { PRNG } from 'some-utils-ts/random/prng'
import { useGroup } from './three-provider'

const blockSize = 4

class BasicGrid extends Mesh {
  constructor({
    col = 3,
    row = 3,
    color = <ColorRepresentation>'#fff',
  } = {}) {
    const walls = mergeGeometries([
      new PlaneGeometry(blockSize, blockSize).translate(0, 0, blockSize * -.5),
      new PlaneGeometry(blockSize, blockSize).rotateY(Math.PI * -.5).translate(blockSize * .5, 0, 0),
    ])
    const block = mergeGeometries([
      walls,
      new PlaneGeometry(blockSize, blockSize).rotateX(Math.PI * -.5).translate(0, blockSize * -.5, 0),
    ])
    const partialBlock = mergeGeometries([
      walls,
      new PlaneGeometry(blockSize / 2, blockSize / 2).rotateX(Math.PI * -.5).translate(blockSize * -.25, blockSize * -.5, blockSize * -.25),
      new PlaneGeometry(blockSize / 2, blockSize / 2).rotateX(Math.PI * -.5).translate(blockSize * .25, blockSize * -.5, blockSize * -.25),
      new PlaneGeometry(blockSize / 2, blockSize / 2).rotateX(Math.PI * -.5).translate(blockSize * .25, blockSize * -.5, blockSize * +.25),
    ])
    block.rotateY(Math.PI * .25)
    partialBlock.rotateY(Math.PI * .25)
    const geometry = mergeGeometries(Array.from({ length: row * col }, (_, index) => {
      const i = index % col
      const j = Math.floor(index / col)
      const tx = i - (col - 1) * .5 + -.5 * (j % 2)
      const ty = j - (row - 1) * .5
      const x = tx * blockSize * Math.SQRT2
      const y = ty * blockSize
      const z = ty * blockSize * Math.SQRT2 * -.5
      return (j > 0 ? block : partialBlock).clone().translate(x, y, z)
    }))
    const material = new AutoLitMaterial({ color: '#fff' })

    super(geometry, material)

    setvertexColors(this.geometry, color)
  }
}

const CHUNK_COL = 8
const CHUNK_ROW = 4
const CHUNK_SCALE = .5
const BLOCK_SIZE = 4

class VoxelGridChunk extends Mesh {
  _gridCoords: Vector2 = new Vector2()

  siblings = {
    ne: <VoxelGridChunk | null>null,
    n: <VoxelGridChunk | null>null,
    nw: <VoxelGridChunk | null>null,
    w: <VoxelGridChunk | null>null,
    sw: <VoxelGridChunk | null>null,
    s1: <VoxelGridChunk | null>null,
    s2: <VoxelGridChunk | null>null,
    se: <VoxelGridChunk | null>null,
    e: <VoxelGridChunk | null>null,
  }

  constructor({
    color = <ColorRepresentation>(0xffffff * PRNG.random()),
  } = {}) {
    const chunk = new Chunk(128, 1)

    const p = new Vector3()

    const cube = (p: Vector3, size: number) => {
      for (const v of loop3(size, size, size)) {
        const x = p.x + v.x
        const y = p.y + v.y
        const z = p.z + v.z
        chunk.getVoxelState(x, y, z).setInt8(0, 1)
      }
    }

    for (const { x, y } of loop2(CHUNK_COL, CHUNK_ROW)) {
      p.set(x, y, x + CHUNK_ROW - 1 - y)
        .multiplyScalar(BLOCK_SIZE)
      cube(p, BLOCK_SIZE)
    }

    for (let x = 0; x < CHUNK_COL; x += 2) {
      p.set(x + 1, CHUNK_ROW - 1, x)
        .multiplyScalar(BLOCK_SIZE)
      cube(p, BLOCK_SIZE)
    }

    const s = CHUNK_SCALE / BLOCK_SIZE
    const geometry = createNaiveVoxelGeometry(chunk.voxelFaces())
      .scale(s, s, s)

    const material = new AutoLitMaterial({ color: '#fff' })

    super(geometry, material)

    setvertexColors(this.geometry, color)
  }

  get gridCoords() {
    return this._gridCoords
  }

  setGridCoords(value: Vector2Declaration) {
    fromVector2Declaration(value, this._gridCoords)
    const { x, y } = this._gridCoords

    const scalar = .5 ** y
    this.scale.setScalar(scalar)

    let px = x * CHUNK_SCALE * CHUNK_COL * (.5 ** y)
    let py = 0
    let pz = x * CHUNK_SCALE * CHUNK_COL * (.5 ** y)
    for (let i = Math.min(0, y); i < Math.max(0, y); i++) {
      py += -CHUNK_SCALE * CHUNK_ROW * (.5 ** (i + 1)) * (i < 0 ? -1 : 1)
      pz += CHUNK_SCALE * CHUNK_ROW * (.5 ** i) * (i < 0 ? -1 : 1)
    }

    this.position.set(px, py, pz)
  }
}

export function FractalGrid() {
  useGroup('fractal-grid', function* (group) {
    setup(new Mesh(
      new TorusKnotGeometry(2.5, .025, 512, 32),
      new AutoLitMaterial({ color: '#0cf' })), group).visible = false

    const create = (x: number, y: number) => {
      const chunk = setup(new VoxelGridChunk(), group)
      chunk.setGridCoords([x, y])
      return chunk
    }

    PRNG.reset()
    create(0, -1)
    create(0, 0)
    create(1, 0)
    create(0, 1)
    create(1, 1)
    create(0, 2)
    create(1, 2)
    create(2, 2)
    create(3, 2)

    setup(new SkyMesh({ color: '#110512' }), group)

    setup(new Mesh(new AxesGeometry(), new MeshBasicMaterial({ vertexColors: true })), group)

  }, [])

  return null
}
