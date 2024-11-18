/* eslint-disable prefer-const */
import { Mesh, TorusKnotGeometry } from 'three'

import { AxesGeometry } from 'some-utils-three/geometries/axis'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { SkyMesh } from 'some-utils-three/objects/sky-mesh'
import { setup } from 'some-utils-three/utils/tree'
import { PRNG } from 'some-utils-ts/random/prng'
import { onTick } from 'some-utils-ts/ticker'

import { CameraHandler } from './camera-handler'
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
    yield world.destroy
    world.scope.updateScope({ aspect: three.aspect })
    world.ensureScopeChunks()

    const cameraHandler = new CameraHandler()
      .initialize(three.camera, three.renderer.domElement)

    yield onTick('three', tick => {
      cameraHandler.onTick(tick, three.aspect)
      world.scope.updateScope({ aspect: three.aspect })
    })

    Object.assign(window, { world, cameraHandler })

    setup(new Mesh(new AxesGeometry(), new AutoLitMaterial({ vertexColors: true })), group)

  }, [])

  return null
}
