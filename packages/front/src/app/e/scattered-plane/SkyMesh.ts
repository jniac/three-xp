import { BackSide, IcosahedronGeometry, Mesh, MeshBasicMaterial } from 'three'

export class SkyMesh extends Mesh {
  constructor() {
    const geometry = new IcosahedronGeometry(40, 1)
    const material = new MeshBasicMaterial({
      // color: '#181c41',
      color: '#aeb4e9',
      side: BackSide,
    })
    super(geometry, material)

    this.onBeforeRender = (renderer, scene, camera) => {
      this.position.copy(camera.position)
    }
  }
}
