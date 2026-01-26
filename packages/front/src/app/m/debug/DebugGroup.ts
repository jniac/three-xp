import { DirectionalLight, Group, Mesh, MeshPhysicalMaterial, TorusKnotGeometry, Vector2 } from 'three'

import { anyLoader } from 'some-utils-three/loaders/any-loader'
import { setup } from 'some-utils-three/utils/tree'

export class DebugGroup extends Group {
  constructor() {
    super()

    setup(new DirectionalLight('#fff', 1.5), {
      parent: this,
      position: [10, 10, 10],
    })

    const normalMap = anyLoader.loadTexture('https://threejs.org/examples/textures/golfball.jpg', tex => {
      // const normalMap = anyLoader.loadTexture('https://threejs.org/examples/textures/carbon/Carbon_Normal.png', tex => {
      tex.repeat.set(30, 3)
      tex.wrapS = tex.wrapT = 1000 /* RepeatWrapping */
      tex.flipY = true
    })
    const material = new MeshPhysicalMaterial({
      // wireframe: true,
      // flatShading: true,
      color: '#4d5154',
      normalMap,
      normalScale: new Vector2(1.25, 1.25),
    })
    const mesh1 = setup(new Mesh(new TorusKnotGeometry(10, 3, 256, 32), material) as Mesh, this)
  }
}