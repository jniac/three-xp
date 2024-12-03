import { DoubleSide, Group, Mesh, Raycaster, TorusKnotGeometry, Vector3 } from 'three'

import { leak } from '@/utils/leak'
import { createNaiveVoxelGeometry, World } from 'some-utils-three/experimental/voxel'
import { SimpleGridHelper } from 'some-utils-three/helpers/grid'
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

const raycaster = new Raycaster()
function isPointInsideMesh(point: Vector3, mesh: Mesh) {
  raycaster.set(point, new Vector3(1, 0, 0)) // Arbitrary direction
  const intersections = raycaster.intersectObject(mesh, true)
  return intersections.length % 2 === 1 // Odd -> inside, Even -> outside
}

export class Main extends Group {
  parts = (() => {
    PRNG.reset()

    const knot = setup(
      new Mesh(
        new TorusKnotGeometry(10, 2, 64, 16),
        new AutoLitMaterial({ wireframe: true, side: DoubleSide })
      ), this)

    setup(new SimpleGridHelper({ size: 24 }), {
      parent: this,
      rotationX: '90deg',
    })
    const sky = setup(new SkyMesh(), this)

    const world = new World()
    leak({ world })

    const plainVoxel = new DataView(new ArrayBuffer(world.voxelStateByteSize))
    plainVoxel.setUint8(0, 1)

    const p = new Vector3()
    for (let { x, y, z } of loop3(24, 24, 24)) {
      x -= 12
      y -= 12
      z -= 12
      p.set(x + .5, y + .5, z + .5)
      if (isPointInsideMesh(p, knot))
        world.setVoxelState(x, y, z, plainVoxel)
    }

    for (let { x, y, z } of loop3(2, 2, 2)) {
      x -= 1
      y -= 1
      z -= 1
      const chunk = world.tryGetChunk(x, y, z)
      if (chunk) {
        const color = PRNG.pick([
          '#ffdd55',
          '#55ddff',
          '#dd55ff',
          '#55ffdd',
          '#ff55dd',
          '#ddff55',
          '#ff5555',
        ])
        setup(new Mesh(
          createNaiveVoxelGeometry(chunk.voxelFaces()),
          new AutoLitMaterial({ color })), {
          parent: this,
          x: x * 16,
          y: y * 16,
          z: z * 16,
        })
      }
    }

    return { sky }
  })()
}
