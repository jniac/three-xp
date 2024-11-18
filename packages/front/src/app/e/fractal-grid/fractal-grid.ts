/* eslint-disable prefer-const */
import { Mesh, TorusKnotGeometry } from 'three'

import { AxesGeometry } from 'some-utils-three/geometries/axis'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { SkyMesh } from 'some-utils-three/objects/sky-mesh'
import { setup } from 'some-utils-three/utils/tree'
import { PRNG } from 'some-utils-ts/random/prng'
import { onTick } from 'some-utils-ts/ticker'

import { useGroup } from './three-provider'
import { World } from './voxel/world'

export function FractalGrid() {
  useGroup('fractal-grid', function* (group, three) {
    setup(new SkyMesh({ color: '#110512' }), group)

    setup(new Mesh(
      new TorusKnotGeometry(2.5, .025, 512, 32),
      new AutoLitMaterial({ color: '#0cf' })), group).visible = false

    PRNG.seed(98763)
    const world = setup(new World(), group)
    world.ensureChunk(0, -1)
    console.log(world.scope.chunkIntersects(world.ensureChunk(0, 0)))
    console.log(world.scope.chunkIntersects(world.ensureChunk(0, -1)))

    yield onTick('three', () => {
      world.scope.updateScope({ aspect: three.aspect })
      return 'stop'
    })

    setup(new Mesh(new AxesGeometry(), new AutoLitMaterial({ vertexColors: true })), group)

  }, [])

  return null
}
