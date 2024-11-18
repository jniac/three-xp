/* eslint-disable prefer-const */
import { Group, Matrix4, Mesh, Vector3 } from 'three'

import { AxesGeometry } from 'some-utils-three/geometries/axis'
import { LineHelper } from 'some-utils-three/helpers/line'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { setup } from 'some-utils-three/utils/tree'

import { CHUNK_CORNERS, VoxelGridChunk } from './chunk'

export class Scope extends Group {
  parts = (() => {
    return {
      axes: setup(new Mesh(new AxesGeometry(), new AutoLitMaterial({ vertexColors: true })), this),
      lines: setup(new LineHelper(), this),
      debugLines: setup(new LineHelper(), this),
    }
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

      if ((outMinX || outMinY || outMaxX || outMaxY) === false) {
        return true
      }
    }
    return false
  }
}
