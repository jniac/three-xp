import { BoxGeometry, Color, InstancedMesh, Material, Matrix4, Vector3 } from 'three'

import { fromVector3Declaration, Vector3Declaration } from 'some-utils-three/declaration'
import { SmoothBoxGeometry } from 'some-utils-three/geometries/SmoothBoxGeometry'
import { makeMatrix4 } from 'some-utils-three/utils/make'
import { loop3 } from 'some-utils-ts/iteration/loop'
import { RandomUtils as R } from 'some-utils-ts/random/random-utils'


const voxelGeometry = new BoxGeometry(1, 1, 1)
const voxelSmoothGeometry = new SmoothBoxGeometry(1, 1, 1, 4, 0.05)
const _matrix = new Matrix4()

const defaultOptions = {
  size: <Vector3Declaration>16,
  align: <Vector3Declaration>.5,
  randomColor: <boolean | number>false,
  smoothVoxels: false,
}

export class VoxelInstances extends InstancedMesh {
  readonly size: Vector3
  align: Vector3
  buffer: Uint8Array

  constructor(options?: Partial<typeof defaultOptions>, material?: Material) {
    const {
      size: sizeArg,
      align: alignArg,
      randomColor,
      smoothVoxels,
    } = { ...defaultOptions, ...options }
    const size = fromVector3Declaration(sizeArg)

    const count = size.x * size.y * size.z
    super(smoothVoxels ? voxelSmoothGeometry : voxelGeometry, material, count)

    this.buffer = new Uint8Array(count)
    this.size = size
    this.align = fromVector3Declaration(alignArg)

    if (randomColor) {
      const color = new Color()
      R.setRandom('parkmiller', typeof randomColor === 'number' ? randomColor : 123456)
      for (let i = 0; i < count; i++) {
        this.setColorAt(i, color.setHSL(R.f(), R.f(.5, 1), R.f(.25, .75)))
      }
    }

    this.update()
  }

  update() {
    const position = new Vector3()
    for (const { i, x, y, z } of loop3(this.size)) {
      position.set(x, y, z).sub(this.align)
      this.setMatrixAt(i, makeMatrix4({ position }))
    }
    this.instanceMatrix.needsUpdate = true
  }

  #setVoxel(i: number, x: number, y: number, z: number, byte: number) {
    const vx = x + .5 - this.align.x * this.size.x
    const vy = y + .5 - this.align.y * this.size.y
    const vz = z + .5 - this.align.z * this.size.z
    const s = byte ? 1 : 0
    _matrix.makeScale(s, s, s).setPosition(vx, vy, vz)
    this.setMatrixAt(i, _matrix)
    this.buffer[i] = byte ? 1 : 0
    this.instanceMatrix.needsUpdate = true
  }

  setVoxel(x: number, y: number, z: number, byte: number): this {
    const i = x + this.size.x * (y + this.size.y * z)
    this.#setVoxel(i, x, y, z, byte)
    return this
  }

  setEachVoxel(callback: (x: number, y: number, z: number) => number): this {
    for (const { i, x, y, z } of loop3(this.size)) {
      const value = callback(x, y, z)
      this.#setVoxel(i, x, y, z, value)
    }
    return this
  }
}