/* eslint-disable prefer-const */
import { Group, Matrix4, Vector3 } from 'three'

import { Vertigo, VertigoProps } from 'some-utils-three/camera/vertigo'
import { LineHelper } from 'some-utils-three/helpers/line'
import { setup } from 'some-utils-three/utils/tree'

import { fromAngleDeclaration } from 'some-utils-ts/declaration'
import { VoxelGridChunk } from './chunk'
import { CHUNK_CORNERS, WORLD_MATRIX } from './math'

export class Scope extends Group {
  static instances = [] as Scope[]
  static current() {
    if (this.instances.length === 0)
      throw new Error(`No Scope!`)
    return this.instances[this.instances.length - 1]
  }

  parts = (() => {
    return {
      lines: setup(new LineHelper(), this),
      debugLines: setup(new LineHelper(), this),
    }
  })()

  state = {
    width: 4,
    height: 4,
  }

  matrixWorldInverse = new Matrix4()

  constructor() {
    super()

    Scope.instances.push(this)

    this.position.set(0, 0, 6)
    this.rotation.setFromRotationMatrix(WORLD_MATRIX, Vertigo.default.rotation.order)
    this.rotation.x += fromAngleDeclaration('20deg')

    this.updateMatrix()
    this.updateMatrixWorld()
    this.matrixWorldInverse.copy(this.matrixWorld).invert()
  }

  destroy = () => {
    const index = Scope.instances.indexOf(this)
    if (index === -1) throw new Error(`Scope instance not found`)
    Scope.instances.splice(index, 1)
  }

  updateScope({ aspect = 1, size = 4 } = {}) {
    const width = aspect > 1 ? size : size * aspect
    const height = width / aspect

    if (width === this.state.width && height === this.state.height)
      return

    this.parts.lines
      .clear()
      .circle({ radius: 1 })
      .rectangle([-width / 2, -height / 2, width, height])
      .plus([0, 0], .2)
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

  static _chunkIntersectsVectors = [new Vector3(), new Vector3(), new Vector3(), new Vector3()]
  chunkIntersects(chunk: VoxelGridChunk) {
    // Important: updateMatrixWorld() must be called first to ensure the matrices are up to date.
    this.updateMatrixWorld()
    chunk.updateMatrixWorld()

    let outMinX = true
    let outMinY = true
    let outMaxX = true
    let outMaxY = true

    const w2 = this.state.width / 2
    const h2 = this.state.height / 2

    for (let i = 0; i < 4; i++) {
      const { x, y, z } = Scope._chunkIntersectsVectors[i]
        .copy(CHUNK_CORNERS[i])
        .applyMatrix4(chunk.matrixWorld)
        .applyMatrix4(this.matrixWorldInverse)

      // Draw debug lines
      // this.parts.debugLines
      //   .line([x, y, 0], [x, y, z])
      //   .draw()

      outMinX &&= x < -w2
      outMaxX &&= x > w2
      outMinY &&= y < -h2
      outMaxY &&= y > h2

      const out = outMinX || outMinY || outMaxX || outMaxY
      if (out === false) {
        return true
      }
    }
    return false
  }

  toVertigoProps(): VertigoProps {
    const { width, height } = this.state
    return {
      perspective: .5,
      size: [width, height],
      focus: this.position,
      rotation: this.rotation,
    }
  }
}
