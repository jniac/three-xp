/* eslint-disable prefer-const */
import { ColorRepresentation, Mesh, PlaneGeometry } from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { setVertexColors } from 'some-utils-three/utils/geometry'

const blockSize = 4

export class BasicGrid extends Mesh {
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

    setVertexColors(this.geometry, color)
  }
}
