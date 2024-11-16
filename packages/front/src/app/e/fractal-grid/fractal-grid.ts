/* eslint-disable prefer-const */
import { ColorRepresentation, Group, IcosahedronGeometry, InstancedMesh, Matrix4, Mesh, PlaneGeometry, TorusKnotGeometry, Vector2, Vector3 } from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import { fromVector2Declaration } from 'some-utils-three/declaration'
import { Chunk, createNaiveVoxelGeometry } from 'some-utils-three/experimental/voxel'
import { AxesGeometry } from 'some-utils-three/geometries/axis'
import { LineHelper } from 'some-utils-three/helpers/line'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { SkyMesh } from 'some-utils-three/objects/sky-mesh'
import { setvertexColors } from 'some-utils-three/utils/geometry'
import { makeColor, makeMatrix4 } from 'some-utils-three/utils/make'
import { setup } from 'some-utils-three/utils/tree'
import { Vector2Declaration } from 'some-utils-ts/declaration'
import { loop2, loop3 } from 'some-utils-ts/iteration/loop'
import { PRNG } from 'some-utils-ts/random/prng'
import { onTick } from 'some-utils-ts/ticker'

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

const CHUNK_COL = 6
const CHUNK_ROW = 4
const CHUNK_SCALE = .5
const BLOCK_SIZE = 4
// const CHUNK_GEOM_OFFSET = new Vector3(-CHUNK_COL * CHUNK_SCALE * .5, -CHUNK_ROW * CHUNK_SCALE / 2, -(CHUNK_COL - 1) * CHUNK_SCALE)
const CHUNK_GEOM_OFFSET = new Vector3()

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
      .translate(CHUNK_GEOM_OFFSET.x, CHUNK_GEOM_OFFSET.y, CHUNK_GEOM_OFFSET.z)

    const material = new AutoLitMaterial({ color: '#fff' })

    super(geometry, material)

    setvertexColors(this.geometry, color)
    this.createDots()
  }

  getCornersCoords(out = [new Vector3(), new Vector3(), new Vector3(), new Vector3()] as const) {
    out[0].set(0, 0, CHUNK_ROW).multiplyScalar(CHUNK_SCALE).add(CHUNK_GEOM_OFFSET)
    out[1].set(0, CHUNK_ROW, 0).multiplyScalar(CHUNK_SCALE).add(CHUNK_GEOM_OFFSET)
    out[2].set(CHUNK_COL, 0, CHUNK_ROW + CHUNK_COL - 1).multiplyScalar(CHUNK_SCALE).add(CHUNK_GEOM_OFFSET)
    out[3].set(CHUNK_COL, CHUNK_ROW, CHUNK_COL).multiplyScalar(CHUNK_SCALE).add(CHUNK_GEOM_OFFSET)
    return out
  }

  dots: InstancedMesh | null = null
  createDots() {
    const dots = new InstancedMesh(
      new IcosahedronGeometry(.1, 8),
      new AutoLitMaterial(),
      4)
    setup(dots, this)
    for (const [index, position] of this.getCornersCoords().entries()) {
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
    for (const [index, corner] of this.getCornersCoords().entries()) {
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

    const p = .5 ** y
    const q = p * .5 // .5 ** (y + 1)

    const px = x * CHUNK_COL * p
    const py = CHUNK_ROW * (2 * q - 1)
    const pz = x * CHUNK_COL * p
      + 2 * CHUNK_ROW * (1 - p)

    this.scale.setScalar(p)
    this.position
      .set(px, py, pz)
      .multiplyScalar(CHUNK_SCALE)
  }
}

class Scope extends Group {
  parts = (() => {
    const axes = setup(new Mesh(new AxesGeometry(), new AutoLitMaterial({ vertexColors: true })), this)
    const lines = setup(new LineHelper(), this)
    return { axes, lines }
  })()

  state = {
    width: 4,
    height: 4,
  }

  uvw: [Vector3, Vector3, Vector3]
  matrixWorldInverse = new Matrix4()

  constructor() {
    super()

    this.matrixAutoUpdate = false

    const u = new Vector3(1, 0, 1).normalize()
    const v = new Vector3(0, 1, -1).normalize()
    const w = new Vector3().crossVectors(u, v).normalize()

    this.uvw = [u, v, w]

    v.crossVectors(w, u).normalize()
    this.matrix.makeBasis(u, v, w)
    this.matrix.setPosition(new Vector3(0, 0, 4))
    this.matrixWorld.copy(this.matrix)
    this.matrixWorldInverse.copy(this.matrix).invert()
  }

  updateScope({ aspect = 1, width = 5 } = {}) {
    const height = width / aspect
    this.parts.lines
      .clear()
      .circle({ radius: 1 })
      .rectangle([-width / 2, -height / 2, width, height])
      .draw()

    this.parts.lines.geometry.computeBoundingSphere()

    this.state.width = width
    this.state.height = height
  }

  isWithin(point: Vector3) {
    const { x, y } = point.clone().applyMatrix4(this.matrixWorldInverse)
    const { width, height } = this.state
    return x >= -width / 2 && x <= width / 2
      && y >= -height / 2 && y <= height / 2
  }
}

export function FractalGrid() {
  useGroup('fractal-grid', function* (group, three) {
    setup(new Mesh(
      new TorusKnotGeometry(2.5, .025, 512, 32),
      new AutoLitMaterial({ color: '#0cf' })), group).visible = false

    const create = (x: number, y: number) => {
      const chunk = setup(new VoxelGridChunk(), group)
      chunk.setGridCoords([x, y])
      return chunk
    }

    PRNG.reset()
    const chunk = create(0, 0)
    Object.assign(window, { chunk })
    create(0, 1)

    setup(new SkyMesh({ color: '#110512' }), group)

    const scope = setup(new Scope(), group)

    yield onTick('three', () => {
      scope.updateScope({ aspect: three.aspect })
      chunk.updateDots(scope)
    })

    // setup(new Mesh(new AxesGeometry(), new MeshBasicMaterial({ vertexColors: true })), group)

  }, [])

  return null
}
