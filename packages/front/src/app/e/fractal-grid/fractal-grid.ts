/* eslint-disable prefer-const */
import { IcosahedronGeometry, Mesh, TorusKnotGeometry, Vector3 } from 'three'

import { AxesGeometry } from 'some-utils-three/geometries/axis'
import { LineHelper } from 'some-utils-three/helpers/line'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { SkyMesh } from 'some-utils-three/objects/sky-mesh'
import { setup } from 'some-utils-three/utils/tree'
import { PRNG } from 'some-utils-ts/random/prng'
import { onTick } from 'some-utils-ts/ticker'

import { CameraHandler } from './camera-handler'
import { FractalHelper } from './fractal-helper'
import { useGroup } from './three-provider'
import { WORLD_PLANE } from './voxel/math'
import { FractalGridWorld } from './voxel/world'

export function FractalGrid() {
  useGroup('fractal-grid', function* (group, three) {
    setup(new SkyMesh({ color: '#110512' }), group)

    setup(new LineHelper(), group).grid2().draw()

    const helper = setup(new FractalHelper(), group)

    setup(new Mesh(
      new TorusKnotGeometry(2.5, .025, 512, 32),
      new AutoLitMaterial({ color: '#0cf' })), group).visible = false

    PRNG.seed(98763)
    const world = setup(new FractalGridWorld(), group)
    yield world.destroy
    world.visible = false
    world.scope.updateScope({ aspect: three.aspect })
    world.ensureScopeChunks()

    const cameraHandler = new CameraHandler()
      .initialize(three.camera, three.renderer.domElement)

    const intersection = new Vector3()
    const intersectionSphere = setup(new Mesh(new IcosahedronGeometry(.1), new AutoLitMaterial({ color: '#f0f' })), group)

    yield onTick('three', tick => {
      cameraHandler.onTick(tick, three.aspect)
      world.scope.updateScope({ aspect: three.aspect })

      three.pointer.ray.intersectPlane(WORLD_PLANE, intersection)
      intersectionSphere.position.copy(intersection)
      helper.updatePointer(three.pointer.ray)
    })

    world.toColor()
    world.getChunk(0, 0)?.toWhite()

    Object.assign(window, { world, cameraHandler })

    setup(new Mesh(new AxesGeometry(), new AutoLitMaterial({ vertexColors: true })), group)

  }, [])

  return null
}
