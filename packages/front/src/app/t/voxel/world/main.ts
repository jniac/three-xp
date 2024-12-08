import { DoubleSide, Group, Mesh, Raycaster, TorusKnotGeometry, Vector3 } from 'three'

import { createNaiveVoxelGeometry, World } from 'some-utils-three/experimental/voxel'
import { SimpleGridHelper } from 'some-utils-three/helpers/grid'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { SkyMesh } from 'some-utils-three/objects/sky-mesh'
import { setup } from 'some-utils-three/utils/tree'
import { loop3 } from 'some-utils-ts/iteration/loop'
import { PRNG } from 'some-utils-ts/random/prng'

import { leak } from '@/utils/leak'
import { LineHelper } from 'some-utils-three/helpers/line'

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
        new TorusKnotGeometry(10, 3, 32, 6),
        new AutoLitMaterial({ wireframe: true, side: DoubleSide })
      ), this)
    knot.visible = false

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

    this.createAllChunkMeshes(world)

    return { sky }
  })()

  createAllChunkMeshes(world: World) {
    for (const { superChunkIndex, chunkIndex, chunk } of world.enumerateChunks()) {
      const color = PRNG.pick([
        '#ffdd55',
        '#55ddff',
        '#dd55ff',
        '#55ffdd',
        '#ff55dd',
        '#ddff55',
        '#ff5555',
      ])

      const geometry = createNaiveVoxelGeometry(chunk.voxelFaces())
      const material = new AutoLitMaterial({ color })

      const { x, y, z } = world.metrics.fromIndexes(superChunkIndex, chunkIndex, 0)
      setup(new Mesh(geometry, material), {
        parent: this,
        x,
        y,
        z,
      })
    }

    const box3 = world.computeBounds()
    const lines = setup(new LineHelper(), this)
    lines
      .box({ box3, asIntBox3: true })
      .draw()
  }

  createOneUniqueMesh(world: World) {

  }
}
