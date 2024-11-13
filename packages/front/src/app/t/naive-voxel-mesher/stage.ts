import { Group, Mesh, TorusKnotGeometry, Vector3 } from 'three'

import { Chunk, createNaiveVoxelGeometry } from 'some-utils-three/experimental/voxel'
import { SimpleGridHelper } from 'some-utils-three/helpers/grid'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { SkyMesh } from 'some-utils-three/objects/sky-mesh'
import { setup } from 'some-utils-three/utils/tree'
import { loop3 } from 'some-utils-ts/iteration/loop'

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

export class Stage extends Group {
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

      console.log(chunk.getVoxelState(0, 2, 4).getUint8(0))
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
    // setup(new Mesh(voxels.geometry, new MeshBasicMaterial({ color: 'red', wireframe: true })), this)

    return { sky }
  })()
}
