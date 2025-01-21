import { BufferGeometry, CatmullRomCurve3, Group, Line, LineBasicMaterial, Mesh, MeshBasicNodeMaterial, SphereGeometry, Vector3 } from 'three/webgpu'

import { ThreeWebGPUContext } from 'some-utils-three/experimental/contexts/webgpu'

export class Main extends Group {
  parts = (() => {
    const sphere = new Mesh(
      new SphereGeometry(1),
      new MeshBasicNodeMaterial({ wireframe: true }),
    )
    this.add(sphere)

    const a = new Vector3(-3, 3, 3)
    const b = new Vector3(4, 1, -3)
    const c = new Vector3(5, -1, -2)
    const d = new Vector3(7, -2, 2)
    const e = new Vector3(-2, 0, 4)
    const controlPoints = [a, b, c, d, e]

    const curve = new CatmullRomCurve3(controlPoints)
    curve.curveType = 'centripetal'
    curve.closed = true

    // Visualize the curve geometry
    const geometry = new BufferGeometry().setFromPoints(curve.getPoints(100))
    const material = new LineBasicMaterial({ color: 0xff0000 })
    const curveObject = new Line(geometry, material)

    this.add(curveObject)
  })()

  async *onInitialize(three: ThreeWebGPUContext) {

  }
}