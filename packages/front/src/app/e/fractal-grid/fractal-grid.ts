import { ColorRepresentation, Mesh, MeshBasicMaterial, PlaneGeometry, TorusKnotGeometry, Vector3 } from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import { Chunk, createNaiveVoxelGeometry } from 'some-utils-three/experimental/voxel'
import { AxesGeometry } from 'some-utils-three/geometries/axis'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { setvertexColors } from 'some-utils-three/utils/geometry'
import { setup } from 'some-utils-three/utils/tree'
import { loop2, loop3 } from 'some-utils-ts/iteration/loop'

import { SkyMesh } from 'some-utils-three/objects/sky-mesh'
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

const BLOCK_SIZE = 4

class VoxelGrid extends Mesh {
  constructor({
    scale = 1,
    col = 4,
    row = 4,
    color = <ColorRepresentation>'#fff',
  } = {}) {
    const chunk = new Chunk(48, 1)

    const p = new Vector3()
    const q = new Vector3()

    const cube = (p: Vector3, size: number) => {
      for (const v of loop3(size, size, size)) {
        const x = p.x + v.x
        const y = p.y + v.y
        const z = p.z + v.z
        chunk.getVoxelState(x, y, z).setInt8(0, 1)
      }
    }

    for (const { x, y } of loop2(col, row)) {
      p.set(x, y, x + col - y)
      q.x = p.x * BLOCK_SIZE
      q.y = p.y * BLOCK_SIZE + BLOCK_SIZE / 2
      q.z = p.z * BLOCK_SIZE
      cube(q, BLOCK_SIZE)
    }

    for (let x = 0; x < col; x++) {
      p.set(x, 0, x + col)
      q.x = p.x * BLOCK_SIZE
      q.y = p.y * BLOCK_SIZE
      q.z = (p.z + 1) * BLOCK_SIZE
      cube(q, 2)
      q.x += 2
      cube(q, 2)
      q.z += 2
      cube(q, 2)
    }

    const scaleScalar = scale / 2 / BLOCK_SIZE
    const geometry = createNaiveVoxelGeometry(chunk.voxelFaces())
      .scale(scaleScalar, scaleScalar, scaleScalar)

    const material = new AutoLitMaterial({ color: '#fff' })

    super(geometry, material)

    setvertexColors(this.geometry, color)
  }
}

export function FractalGrid() {
  useGroup('fractal-grid', function* (group) {
    setup(new Mesh(
      new TorusKnotGeometry(2.5, .025, 512, 32),
      new AutoLitMaterial({ color: '#0cf' })), group).visible = false

    // setup(new BasicGrid(), group)
    // setup(new BasicGrid({ color: 'red' }), { parent: group, x: blockSize * 3 * Math.SQRT2 })
    const p1 = setup(new VoxelGrid({}), group)
    const p2 = setup(new VoxelGrid({
      scale: .5,
      color: '#f5e532'
    }), {
      parent: group,
      y: -(BLOCK_SIZE + .5) / 4,
      z: (BLOCK_SIZE + 1) / 2,
    })
    const p3 = setup(new VoxelGrid({
      scale: .25,
      color: '#3532f5'
    }), {
      parent: group,
      y: -(BLOCK_SIZE + .5) / 4 - (BLOCK_SIZE + .5) / 4 / 2,
      z: (BLOCK_SIZE + 1) / 2 + (BLOCK_SIZE + 1) / 2 / 2,
    })

    setvertexColors(p1.geometry, '#f5327d', 0, 10560 / 4)

    setup(new SkyMesh({ color: '#110512' }), group)

    setup(new Mesh(new AxesGeometry(), new MeshBasicMaterial({ vertexColors: true })), group).visible = false

  }, [])

  return null
}
