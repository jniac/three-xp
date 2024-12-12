import { ThreeWebGPUContext } from 'some-utils-three/webgpu/experimental/context'
import { Ticker } from 'some-utils-ts/ticker'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { EquirectangularReflectionMapping, float, Fn, Group, Mesh, MeshPhysicalNodeMaterial, oscTriangle, positionGeometry, TorusGeometry, uniform } from 'three/webgpu'

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