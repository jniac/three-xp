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
 * ✅ ALGO!
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
 * ✅ ALGO!
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



export function invertMatrix2(m: Matrix2): Matrix2 {
  const det = m.elements[0] * m.elements[3] - m.elements[1] * m.elements[2]
  if (det === 0) {
    throw new Error('Matrix is not invertible')
  }
  const invDet = 1 / det
  return new Matrix2().set(
    m.elements[3] * invDet,
    -m.elements[1] * invDet,
    -m.elements[2] * invDet,
    m.elements[0] * invDet
  )
}

export class Matrix2 {
  elements: number[]
  constructor() {
    this.elements = [
      1, 0,
      0, 1,
    ]
  }

  set(
    m11: number, m12: number,
    m21: number, m22: number
  ): this {
    const e = this.elements
    e[0] = m11
    e[1] = m21
    e[2] = m12
    e[3] = m22
    return this
  }

  multiplyMatrices(m1: Matrix2, m2: Matrix2): Matrix2 {
    const a = m1.elements
    const b = m2.elements
    return this.set(
      a[0] * b[0] + a[2] * b[1],
      a[1] * b[0] + a[3] * b[1],
      a[0] * b[2] + a[2] * b[3],
      a[1] * b[2] + a[3] * b[3],
    )
  }

  multiply(m: Matrix2): Matrix2 {
    return this.multiplyMatrices(this, m)
  }

  premultiply(m: Matrix2): Matrix2 {
    return this.multiplyMatrices(m, this)
  }

  multiplyVector2(v: Vector2, out = v): Vector2 {
    const e = this.elements
    return out.set(
      e[0] * v.x + e[2] * v.y,
      e[1] * v.x + e[3] * v.y
    )
  }
}
