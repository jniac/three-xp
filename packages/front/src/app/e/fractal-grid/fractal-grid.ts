/* eslint-disable prefer-const */
import { Mesh, TorusKnotGeometry } from 'three'

import { AxesGeometry } from 'some-utils-three/geometries/axis'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { SkyMesh } from 'some-utils-three/objects/sky-mesh'
import { setup } from 'some-utils-three/utils/tree'
import { PRNG } from 'some-utils-ts/random/prng'
import { onTick } from 'some-utils-ts/ticker'

import { fromAngleDeclaration } from 'some-utils-ts/declaration'
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

    yield onTick('three', () => {
      world.scope.updateScope({ aspect: three.aspect })
    })

    function cameraToScope() {
      const [handler] = CameraHandler.instances
      const { width, height } = world.scope.state
      handler.mode = CameraHandler.Mode.Scope
      handler.scopeVertigoControls.dampedVertigo.copy(handler.freeVertigoControls.dampedVertigo)

      const rotation = world.scope.rotation.clone()
      rotation.x += fromAngleDeclaration('20deg')
      handler.scopeVertigoControls.vertigo.set({
        size: [width, height],
        focus: world.scope.position,
        rotation: rotation,
      })
    }

    function cameraToFree() {
      const [handler] = CameraHandler.instances
      handler.mode = CameraHandler.Mode.Free
      handler.freeVertigoControls.dampedVertigo.copy(handler.scopeVertigoControls.dampedVertigo)
    }

    Object.assign(window, { world, three, cameraToScope, cameraToFree })

    setup(new Mesh(new AxesGeometry(), new AutoLitMaterial({ vertexColors: true })), group)

  }, [])

  return null
}
