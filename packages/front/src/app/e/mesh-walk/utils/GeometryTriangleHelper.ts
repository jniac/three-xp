import { BufferAttribute, BufferGeometry, Vector2, Vector3 } from 'three'

import { fromVector2Declaration } from 'some-utils-three/declaration'
import { Vector2Declaration } from 'some-utils-ts/declaration'

export class GeometryTriangleHelper {
  geometry: BufferGeometry
  triangleIndex: number
  uv: Vector2

  A = new Vector3();
  B = new Vector3();
  C = new Vector3();
  P = new Vector3(); // Point inside the triangle corresponding to the UV coordinate

  constructor(geometry: BufferGeometry, triangleIndex: number, uvArg: Vector2Declaration) {
    this.geometry = geometry
    this.triangleIndex = triangleIndex
    this.uv = fromVector2Declaration(uvArg)

    this.updateVertices()
  }

  getPoint(uv: Vector2Declaration): Vector3 {
    const { x, y } = fromVector2Declaration(uv)
    return new Vector3()
      .addScaledVector(this.A, 1 - x - y)
      .addScaledVector(this.B, x)
      .addScaledVector(this.C, y)
  }

  protected updateVertices() {
    const positionAttr = this.geometry.getAttribute('position') as BufferAttribute
    const indexAttr = this.geometry.index as BufferAttribute
    const i0 = indexAttr.getX(this.triangleIndex * 3)
    const i1 = indexAttr.getX(this.triangleIndex * 3 + 1)
    const i2 = indexAttr.getX(this.triangleIndex * 3 + 2)

    this.A.set(
      positionAttr.getX(i0),
      positionAttr.getY(i0),
      positionAttr.getZ(i0)
    )
    this.B.set(
      positionAttr.getX(i1),
      positionAttr.getY(i1),
      positionAttr.getZ(i1)
    )
    this.C.set(
      positionAttr.getX(i2),
      positionAttr.getY(i2),
      positionAttr.getZ(i2)
    )

    this.P.set(0, 0, 0)
      .addScaledVector(this.A, 1 - this.uv.x - this.uv.y)
      .addScaledVector(this.B, this.uv.x)
      .addScaledVector(this.C, this.uv.y)
  }

  getPointArray() {
    return new Float32Array([
      this.A.x, this.A.y, this.A.z, this.B.x, this.B.y, this.B.z,
      this.B.x, this.B.y, this.B.z, this.C.x, this.C.y, this.C.z,
      this.C.x, this.C.y, this.C.z, this.A.x, this.A.y, this.A.z,
    ])
  }
}
