import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { float, Fn, oscTriangle, positionGeometry, uniform } from 'three/tsl'
import { EquirectangularReflectionMapping, Group, Mesh, MeshPhysicalNodeMaterial, TorusGeometry } from 'three/webgpu'

import { ThreeWebGPUContext } from 'some-utils-three/experimental/contexts/webgpu'
import { Ticker } from 'some-utils-ts/ticker'

export class Main extends Group {
  parts = (() => {
    const definitionScalar = 2
    const torus = new Mesh(
      new TorusGeometry(1, .33, 128 * definitionScalar, 256 * definitionScalar),
      new MeshPhysicalNodeMaterial({ color: '#ffcc00' }))

    // torus.material.vertexNode = vec4(positionGeometry, 1).mul(modelViewMatrix).mul(cameraProjectionMatrix)
    const uTime = uniform(float(0)).onObjectUpdate(() => Ticker.get('three').time)
    torus.material.positionNode = Fn(() => {
      return positionGeometry.mul(uTime.mul(3).add(positionGeometry.x.mul(20)).sin().remap(-1, 1, 1, 1.1))
    })()
    torus.material.emissiveNode = oscTriangle(positionGeometry.mul(10).mod(1)).pow(3).mul(.33)
    this.add(torus)
    return {
      torus,
    }
  })()

  async *onInitialize(three: ThreeWebGPUContext) {
    // NOTE: RGBELoader trigger the "Multiple instances of Three.js being imported." warning, but it's fine...
    const rgbeLoader = new RGBELoader()
    const url = 'https://threejs.org/examples/textures/equirectangular/pedestrian_overpass_1k.hdr'
    rgbeLoader.load(url, (environmentMap) => {
      environmentMap.mapping = EquirectangularReflectionMapping
      // three.scene.background = environmentMap
      // three.scene.backgroundBlurriness = .5
      three.scene.environment = environmentMap
      three.scene.environmentIntensity = .5
    })
  }
}