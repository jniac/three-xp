import { Group, Mesh, TorusKnotGeometry, Vector3 } from 'three'

import { Chunk, createNaiveVoxelGeometry } from 'some-utils-three/experimental/voxel'
import { SimpleGridHelper } from 'some-utils-three/helpers/grid'
import { LineHelper } from 'some-utils-three/helpers/line'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { SkyMesh } from 'some-utils-three/objects/sky-mesh'
import { setup } from 'some-utils-three/utils/tree'
import { loop3 } from 'some-utils-ts/iteration/loop'
import { PRNG } from 'some-utils-ts/random/prng'

function nearestPointOnCircle(
  circleX: number,
  circleY: number,
  radius: number,
  pointX: number,
  pointY: number
): [x: number, y: number] {
  // Compute the vector from the circle's center to the point
  const vectorX = pointX - circleX
  const vectorY = pointY - circleY

  // Compute the magnitude of the vector
  const distance = Math.sqrt(vectorX * vectorX + vectorY * vectorY)

  // Normalize the vector
  const unitVectorX = vectorX / distance
  const unitVectorY = vectorY / distance

  // Scale the vector by the radius
  const nearestX = circleX + unitVectorX * radius
  const nearestY = circleY + unitVectorY * radius

  return [nearestX, nearestY]
}

export class Main extends Group {
  parts = (() => {
    setup(new Mesh(new TorusKnotGeometry(10, .4, 512, 64), new AutoLitMaterial()), this)
    setup(new SimpleGridHelper(), {
      parent: this,
      rotationX: '90deg',
    })

    const sky = setup(new SkyMesh(), this)

    const SIZE = 16

    const v1 = new Vector3()
    const v2 = new Vector3()

    {
      const chunk = new Chunk(SIZE)
      for (const { x, y, z } of loop3(SIZE, SIZE, SIZE)) {
        v1.set(x, y, z)
        const [nx, nz] = nearestPointOnCircle(SIZE / 2, SIZE / 2, SIZE / 3, x, z)
        v2.set(nx, SIZE / 6, nz)
        const full = v1.distanceTo(v2) < SIZE / 6
        chunk.getVoxelState(x, y, z).setUint8(0, full ? 1 : 0)
      }
      const voxels = setup(new Mesh(
        createNaiveVoxelGeometry(chunk.voxelFaces()),
        new AutoLitMaterial({ color: '#ffdd55' })), {
        parent: this,
        x: -SIZE,
        z: -SIZE,
      })
    }

    {
      const chunk = new Chunk(SIZE)
      for (const { x, y, z } of loop3(SIZE, SIZE, SIZE)) {
        v1.set(x, y, z)
        const [nx, nz] = nearestPointOnCircle(SIZE / 2, SIZE / 2, SIZE / 2, x, z)
        v2.set(nx, SIZE / 4, nz)
        const full = v1.distanceTo(v2) < SIZE / 4
        chunk.getVoxelState(x, y, z).setUint8(0, full ? 1 : 0)
      }
      const voxels = setup(new Mesh(
        createNaiveVoxelGeometry(chunk.voxelFaces()),
        new AutoLitMaterial({ color: '#ff5566' })), {
        parent: this,
        x: 0,
        z: -SIZE,
      })
    }

    {
      const chunk = new Chunk(SIZE)
      for (const { x, y, z } of loop3(SIZE, SIZE, SIZE)) {
        const full = v1.set(x, y, z).length() < SIZE - 1
        chunk.getVoxelState(x, y, z).setUint8(0, full ? 1 : 0)
      }
      setup(new Mesh(
        createNaiveVoxelGeometry(chunk.voxelFaces()),
        new AutoLitMaterial({ color: '#55ff96' })), {
        parent: this,
        x: SIZE * -2,
      })
    }

    {
      // Non-cube chunk:
      const chunk = new Chunk(new Vector3(12, 24, 4), 1)
      for (const { x, y, z } of loop3(chunk.size)) {
        const full = Math.random() < .5
        chunk.getVoxelState(x, y, z).setUint8(0, full ? 1 : 0)
      }
      setup(new Mesh(
        createNaiveVoxelGeometry(chunk.voxelFaces()),
        new AutoLitMaterial({ color: '#cfedff' })), {
        parent: this,
        position: [16, 0, -12],
      })
    }

    {
      // Bounds test:
      const chunk = new Chunk(SIZE)
      for (const { x, y, z } of loop3(SIZE, SIZE, SIZE)) {
        const full = (x === 0 || y === 0 || z === 0 || x === SIZE - 1 || y === SIZE - 1 || z === SIZE - 1) && PRNG.chance(.66)
        chunk.getVoxelState(x, y, z).setUint8(0, full ? 1 : 0)
      }
      console.log(chunk.computeBounds())
      setup(new Mesh(
        createNaiveVoxelGeometry(chunk.voxelFaces()),
        new AutoLitMaterial({ color: '#9900ff' })), {
        parent: this,
        x: -SIZE,
        z: -2 * SIZE,
      })
    }

    {
      // Bounds test:
      const chunk = new Chunk(SIZE)
      const p = new Vector3()
      const halfSize = SIZE / 2
      for (const { x, y, z } of loop3(SIZE, SIZE, SIZE)) {
        p.set(x - halfSize, y - halfSize, z - halfSize)
        const d = p.lengthSq() - halfSize * halfSize * .25
        if (PRNG.chance(1 - d * .05)) {
          chunk.getVoxelState(x, y, z).setUint8(0, 1)
        }
      }
      const mesh = setup(new Mesh(
        createNaiveVoxelGeometry(chunk.voxelFaces()),
        new AutoLitMaterial({ color: '#00ddff' })), {
        parent: this,
        x: -SIZE,
        z: 0,
      })
      const lines = setup(new LineHelper(), { parent: mesh })
      lines
        .box({
          box3: chunk.computeBounds(),
          asIntBox3: true,
        })
        .draw()
    }


    // setup(new Mesh(voxels.geometry, new MeshBasicMaterial({ color: 'red', wireframe: true })), this)

    return { sky }
  })()
}
