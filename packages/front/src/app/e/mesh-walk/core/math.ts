import { Vector2Like } from 'some-utils-ts/types'
import { Vector2, Vector3 } from 'three'

const distancePointToLine_cache = {
  op: new Vector3(),
  n: new Vector3(),
}
/**
 * Returns the distance from point p to the line defined by origin o and direction v.
 * @param p A point.
 * @param o The origin of the line.
 * @param v The direction vector of the line.
 * @returns
 */
export function distancePointToLine(p: Vector3, o: Vector3, v: Vector3): number {
  const { op, n } = distancePointToLine_cache
  op.subVectors(p, o)
  n.crossVectors(op, v)
  return n.length() / v.length()
}



const findFirstEdgeIntersectionResultCache = {
  valid: false,
  t: 0,
  edgeIndex: -1,
  uv: new Vector2(),
}
/**
 * ## 🧐 ALGO!
 * 
 * Computes the first edge intersection of a movement within a triangle in UV
 * space (using barycentric coordinates).
 * 
 * Notes:
 * - The result is cached and will be overwritten on each call.
 */
export function findFirstEdgeIntersection(
  startUV: Vector2Like,
  deltaUV: Vector2Like) {
  const u = startUV.x
  const v = startUV.y
  const du = deltaUV.x
  const dv = deltaUV.y

  const t0 = du < 0 ? -u / du : Infinity
  const t1 = dv < 0 ? -v / dv : Infinity
  const t2 = du + dv > 0 ? (1 - u - v) / (du + dv) : Infinity

  const t = Math.min(t0, t1, t2)

  const result = findFirstEdgeIntersectionResultCache
  result.valid = t >= 0 && t <= 1
  result.t = t
  result.edgeIndex = t === t0 ? 2 : t === t1 ? 0 : t === t2 ? 1 : -1
  result.uv.set(
    u + du * t,
    v + dv * t
  )
  return result
}



/**
 * ## 🧐 ALGO!
 * 
 * Transposes the intersection UV coordinates from one triangle to another
 * based on the edges involved in the intersection.
 * 
 * Notes:
 * - The result is stored in the `out` parameter.
 * - This function assumes that the triangles are connected along the specified edges.
 * - Edge indices are 0, 1, 2 corresponding to the triangle's edges. 0 is U, 2 is V
 */
export function transposeIntersectionUV(
  t0_I_uv: Vector2,
  t0_I_edge: number,
  t1_I_edge: number,
  out: Vector2,
) {
  const u = t0_I_uv.x
  const v = t0_I_uv.y
  switch (t0_I_edge) {
    case 0: // t0.u
      switch (t1_I_edge) {
        case 0: // t1.u
          return out.set(1 - u, 0)
        case 1: // t1.w
          return out.set(u, 1 - u)
        case 2: // t1.v
          return out.set(0, u)
      }
    case 1: // t0.w
      switch (t1_I_edge) {
        case 0: // t1.u
          return out.set(1 - v, 0)
        case 1: // t1.w
          return out.set(v, u)
        case 2: // t1.v
          return out.set(0, 1 - u)
      }
    case 2: // t0.v
      switch (t1_I_edge) {
        case 0: // t1.u
          return out.set(v, 0)
        case 1: // t1.w
          return out.set(1 - v, v)
        case 2: // t1.v
          return out.set(0, 1 - v)
      }
  }
}



const circleIntersection_cache = {
  AB: new Vector2(),
  ex: new Vector2(),
  ey: new Vector2(),
  p: new Vector2(),
  s0: new Vector2(),
  s1: new Vector2(),
}
export function circleIntersection(
  A: Vector2,
  rA: number,
  B: Vector2,
  rB: number
): Vector2[] {
  const { AB, ex, ey, p, s0, s1 } = circleIntersection_cache
  AB.subVectors(B, A)
  const d = AB.length()

  // No solution cases
  if (d > rA + rB) return []
  if (d < Math.abs(rA - rB)) return []
  if (d === 0 && rA === rB) return [] // infinite solutions

  ex.copy(AB).normalize()

  const x = (rA * rA - rB * rB + d * d) / (2 * d)
  const h2 = rA * rA - x * x

  if (h2 < 0) return []

  const h = Math.sqrt(h2)

  p.copy(A).addScaledVector(ex, x)
  ey.set(-ex.y, ex.x) // perpendicular vector

  if (h === 0) {
    return [p] // tangent
  }

  s0.copy(p).addScaledVector(ey, h)
  s1.copy(p).addScaledVector(ey, -h)

  return [s0, s1]
}


/**
 * ## 🧐 ALGO!
 * 
 * ### What we want?
 * - To compute the positions of T1's vertices in 2D orthogonal space.
 * 
 * ### What we have?
 * - T0's vertices positions in 2D orthogonal space where:
 *    - T0.p0 is at (0,0)
 *    - T0.p1 is at (some_given_length, 0)
 *    - T0.p2 is at (some_given_value, some_given_value)
 * - T1's edge lengths:
 *   - t1_u_length (edge from p0 to p1)
 *   - t1_v_length (edge from p0 to p2)
 *   - t1_w_length (edge from p1 to p2)
 * 
 * ### What's hard here?
 *   - Depending on which edges are involved in the intersection, the known points 
 *     change. We have to handle all combinations of edge intersections.
 * 
 * ### Notes:
 * - Edges are indexed as follows:
 *   - 0: edge from p0 to p1 (u)
 *   - 1: edge from p1 to p2 (w)
 *   - 2: edge from p0 to p2 (v)
 * - Source of confusion:
 *   - u and v refer to the barycentric coordinates within the triangle.
 *   - w refers to the third edge of the triangle.
 *   - So edges in the direct order are: u, w , inverse(v)
 * 
 * @param t0_I_edge 
 * @param t1_I_edge 
 * @param t0_u 
 * @param t0_v 
 * @param t1_u_length 
 * @param t1_v_length 
 * @param t1_w_length 
 * @param t1_p0 
 * @param t1_p1 
 * @param t1_p2 
 */
export function solveTriangle2D(
  // inputs
  // edges involved in the intersection
  t0_I_edge: number,
  t1_I_edge: number,

  // - t0:
  t0_u: Vector2,
  t0_v: Vector2,

  // - t1:
  t1_u_length: number,
  t1_v_length: number,
  t1_w_length: number,

  // outputs
  t1_p0: Vector2,
  t1_p1: Vector2,
  t1_p2: Vector2,
) {
  switch (t0_I_edge) {
    case 0: {
      switch (t1_I_edge) {
        case 0: {
          t1_p0.copy(t0_u)
          t1_p1.set(0, 0)
          const [s,] = circleIntersection(t1_p0, t1_v_length, t1_p1, t1_w_length)
          t1_p2.copy(s)
          break
        }
        case 1: {
          t1_p1.copy(t0_u)
          t1_p2.set(0, 0)
          const [s,] = circleIntersection(t1_p1, t1_w_length, t1_p2, t1_v_length)
          t1_p0.copy(s)
          break
        }
        case 2: {
          t1_p2.copy(t0_u)
          t1_p0.set(0, 0)
          const [s,] = circleIntersection(t1_p2, t1_w_length, t1_p0, t1_u_length)
          t1_p1.copy(s)
          break
        }
      }
      break
    }
    case 1: {
      switch (t1_I_edge) {
        case 0: {
          t1_p0.copy(t0_v)
          t1_p1.copy(t0_u)
          const [s,] = circleIntersection(t1_p0, t1_v_length, t1_p1, t1_w_length)
          t1_p2.copy(s)
          break
        }
        case 1: {
          t1_p1.copy(t0_v)
          t1_p2.copy(t0_u)
          const [s,] = circleIntersection(t1_p1, t1_u_length, t1_p2, t1_v_length)
          t1_p0.copy(s)
          break
        }
        case 2: {
          t1_p2.copy(t0_v)
          t1_p0.copy(t0_u)
          const [s,] = circleIntersection(t1_p2, t1_w_length, t1_p0, t1_u_length)
          t1_p1.copy(s)
          break
        }
      }
      break
    }
    case 2: {
      switch (t1_I_edge) {
        case 0: {
          t1_p0.set(0, 0)
          t1_p1.copy(t0_v)
          const [s,] = circleIntersection(t1_p0, t1_v_length, t1_p1, t1_w_length)
          t1_p2.copy(s)
          break
        }
        case 1: {
          t1_p1.set(0, 0)
          t1_p2.copy(t0_v)
          const [s,] = circleIntersection(t1_p1, t1_w_length, t1_p2, t1_u_length)
          t1_p0.copy(s)
          break
        }
        case 2: {
          t1_p2.set(0, 0)
          t1_p0.copy(t0_v)
          const [s,] = circleIntersection(t1_p2, t1_w_length, t1_p0, t1_v_length)
          t1_p1.copy(s)
          break
        }
      }
      break
    }
  }
}



export class Matrix2 {
  elements: number[]

  constructor() {
    this.elements = [
      1, 0,  // column 1
      0, 1,  // column 2
    ]
  }

  // Accepts matrix in row-major order: (m11, m12, m21, m22)
  // Stores in column-major: [m11, m21, m12, m22]
  set(
    m11: number, m12: number,
    m21: number, m22: number
  ): this {
    const e = this.elements
    e[0] = m11  // col1 row1
    e[1] = m21  // col1 row2
    e[2] = m12  // col2 row1
    e[3] = m22  // col2 row2
    return this
  }

  setBasis(u: Vector2, v: Vector2): this {
    // u is first column, v is second column
    return this.set(
      u.x, v.x,  // row1 col1, row1 col2
      u.y, v.y   // row2 col1, row2 col2
    )
  }

  copy(m: Matrix2): this {
    const te = this.elements
    const me = m.elements
    te[0] = me[0]
    te[1] = me[1]
    te[2] = me[2]
    te[3] = me[3]
    return this
  }

  clone(): Matrix2 {
    return new Matrix2().copy(this)
  }

  invert(): this {
    const e = this.elements
    const det = e[0] * e[3] - e[2] * e[1]  // m11*m22 - m12*m21

    if (det === 0) {
      console.warn('Matrix2: .invert() can\'t invert matrix, determinant is 0')
      return this.set(
        1, 0,
        0, 1
      )
    }

    const detInv = 1 / det
    const m11 = e[3] * detInv    // m22 / det
    const m12 = -e[2] * detInv   // -m12 / det
    const m21 = -e[1] * detInv   // -m21 / det
    const m22 = e[0] * detInv    // m11 / det

    return this.set(
      m11, m12,
      m21, m22
    )
  }

  multiplyMatrices(m1: Matrix2, m2: Matrix2): this {
    const a = m1.elements
    const b = m2.elements

    // Matrix multiplication for column-major storage
    const a11 = a[0], a12 = a[2]  // col1 row1, col2 row1
    const a21 = a[1], a22 = a[3]  // col1 row2, col2 row2
    const b11 = b[0], b12 = b[2]
    const b21 = b[1], b22 = b[3]

    const m11 = a11 * b11 + a12 * b21
    const m12 = a11 * b12 + a12 * b22
    const m21 = a21 * b11 + a22 * b21
    const m22 = a21 * b12 + a22 * b22

    return this.set(
      m11, m12,
      m21, m22
    )
  }

  multiply(m: Matrix2): this {
    return this.multiplyMatrices(this, m)
  }

  premultiply(m: Matrix2): this {
    return this.multiplyMatrices(m, this)
  }

  multiplyVector2(v: Vector2, out = v): Vector2 {
    const e = this.elements
    const x = e[0] * v.x + e[2] * v.y  // m11*x + m12*y
    const y = e[1] * v.x + e[3] * v.y  // m21*x + m22*y
    return out.set(x, y)
  }
}
