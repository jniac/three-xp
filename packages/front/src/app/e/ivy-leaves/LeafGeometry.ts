import { BufferAttribute, BufferGeometry, Vector2 } from 'three'

export class LeafGeometry extends BufferGeometry {
  constructor(getPoint: (out: Vector2) => void, {
    uSubdivisions = 10,
    vSubdivisions = 3,
    flipTriangles = false,
  } = {}) {
    super()

    const u_max = uSubdivisions + 1
    const v_max = vSubdivisions + 1

    const halfPointCount = u_max * v_max
    const pointCount = halfPointCount * 2

    const positionArray = new Float32Array(pointCount * 3)
    const uvArray = new Float32Array(pointCount * 2)
    const uv2Array = new Float32Array(pointCount * 2)

    const point = new Vector2()
    const min = new Vector2()
    const max = new Vector2()
    const size = new Vector2()

    for (let v = 0; v <= vSubdivisions; v++) {
      for (let u = 0; u <= uSubdivisions; u++) {
        getPoint(point.set(u / uSubdivisions, v / vSubdivisions))

        min.min(point)
        max.max(point)

        const off3_r = (v * u_max + u) * 3
        const off2_r = (v * u_max + u) * 2

        positionArray[off3_r + 0] = point.x
        positionArray[off3_r + 1] = point.y
        positionArray[off3_r + 2] = 0

        uv2Array[off2_r + 0] = u / uSubdivisions
        uv2Array[off2_r + 1] = v / vSubdivisions

        const off3_l = (v * u_max + u + halfPointCount) * 3
        const off2_l = (v * u_max + u + halfPointCount) * 2

        positionArray[off3_l + 0] = -point.x
        positionArray[off3_l + 1] = point.y
        positionArray[off3_l + 2] = 0

        uv2Array[off2_l + 0] = u / uSubdivisions
        uv2Array[off2_l + 1] = v / vSubdivisions
      }
    }

    size.subVectors(max, min)
    for (let i = 0; i < pointCount; i++) {
      const off2 = i * 2
      uvArray[off2 + 0] = ((positionArray[i * 3 + 0] - min.x) / size.x - 1) / 2
      uvArray[off2 + 1] = (positionArray[i * 3 + 1] - min.y) / size.y
    }

    const triangleCount = uSubdivisions * vSubdivisions * 2 * 2
    const indexArray = new Uint16Array(triangleCount * 3)

    let a, b, c, d
    for (let v = 0; v < vSubdivisions; v++) {
      for (let u = 0; u < uSubdivisions; u++) {
        {
          // right side          
          const off = (v * uSubdivisions + u) * 6

          a = v * u_max + u
          if (flipTriangles === false) {
            b = a + 1
            c = a + u_max
          } else {
            b = a + u_max
            c = a + 1
          }
          d = a + u_max + 1

          indexArray[off + 0] = a
          indexArray[off + 1] = b
          indexArray[off + 2] = c

          indexArray[off + 3] = b
          indexArray[off + 4] = d
          indexArray[off + 5] = c
        }
        {
          // left side
          const off = uSubdivisions * vSubdivisions * 6 + (v * uSubdivisions + u) * 6

          a = halfPointCount + v * u_max + u
          if (flipTriangles === false) {
            b = a + 1
            c = a + u_max
          } else {
            b = a + u_max
            c = a + 1
          }
          d = a + u_max + 1

          indexArray[off + 0] = a
          indexArray[off + 1] = c
          indexArray[off + 2] = b

          indexArray[off + 3] = b
          indexArray[off + 4] = c
          indexArray[off + 5] = d
        }
      }
    }

    this.setAttribute('position', new BufferAttribute(positionArray, 3))
    this.setAttribute('uv', new BufferAttribute(uvArray, 2))
    this.setAttribute('uv2', new BufferAttribute(uv2Array, 2))
    this.setIndex(new BufferAttribute(indexArray, 1))
    this.computeVertexNormals()
  }
}