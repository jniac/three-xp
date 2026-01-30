import { BufferGeometry, Vector2, Vector3 } from 'three'

import { fromVector2Declaration, Vector2Declaration, Vector3Declaration } from 'some-utils-three/declaration'
import { debugHelper } from 'some-utils-three/helpers/debug'
import { makeMatrix4 } from 'some-utils-three/utils/make'
import { fromVector3Declaration } from 'some-utils-ts/declaration'

import { HashMapArray } from './hash-map'
import { circleIntersection, distancePointToLine, findFirstEdgeIntersection, invertMatrix2, Matrix2, transposeIntersectionUV } from './math'

class TriangleView {
  walker!: GeometryWalker
  triangleIndex!: number

  A = new Vector3()
  B = new Vector3()
  C = new Vector3()

  AB = new Vector3()
  AC = new Vector3()
  AB_length = 0
  AC_length = 0

  constructor(walker: GeometryWalker, triangleIndex: number) {
    this.set(walker, triangleIndex)
  }

  set(walker: GeometryWalker, triangleIndex: number): this {
    this.walker = walker
    this.triangleIndex = triangleIndex

    this.walker.getTriangleVertices(triangleIndex, [this.A, this.B, this.C])
    this.AB.subVectors(this.B, this.A)
    this.AC.subVectors(this.C, this.A)
    this.AB_length = this.AB.length()
    this.AC_length = this.AC.length()

    return this
  }

  clone(): TriangleView {
    return new TriangleView(this.walker, this.triangleIndex)
  }

  static #getPosition_cache = new Vector2();
  getPosition(uvArg: Vector2Declaration, out = new Vector3()): Vector3 {
    const uv = fromVector2Declaration(uvArg, TriangleView.#getPosition_cache)
    return out
      .set(0, 0, 0)
      .addScaledVector(this.A, 1 - uv.x - uv.y)
      .addScaledVector(this.B, uv.x)
      .addScaledVector(this.C, uv.y)
  }

  static #getUV_cache = {
    P: new Vector3(),
    AP: new Vector3(),
  }
  getUV(pointArg: Vector3Declaration, out = new Vector2()): Vector2 {
    const { P, AP } = TriangleView.#getUV_cache
    const { AB, AC } = this
    fromVector3Declaration(pointArg, P)
    AP.subVectors(P, this.A)

    const d00 = AB.dot(AB)
    const d01 = AB.dot(AC)
    const d11 = AC.dot(AC)
    const d20 = AP.dot(AB)
    const d21 = AP.dot(AC)

    const denom = d00 * d11 - d01 * d01
    const v = (d11 * d20 - d01 * d21) / denom
    const w = (d00 * d21 - d01 * d20) / denom

    return out.set(v, w)
  }

  static #getClosestEdgeIndex_cache = {
    P: new Vector3(),
    BC: new Vector3(),
  }
  getClosestEdgeIndex(pointArg: Vector3Declaration): number {
    const { P, BC } = TriangleView.#getClosestEdgeIndex_cache
    const { A, B, C, AB, AC } = this
    fromVector3Declaration(pointArg, P)

    const scoreAB = distancePointToLine(P, A, AB)
    const scoreBC = distancePointToLine(P, B, BC.subVectors(C, B))
    const scoreAC = distancePointToLine(P, A, AC)
    if (scoreAB <= scoreBC) {
      if (scoreAB <= scoreAC) {
        return 0
      } else {
        return 2
      }
    } else {
      if (scoreBC <= scoreAC) {
        return 1
      } else {
        return 2
      }
    }
  }
}

class PathNode {
  walker: GeometryWalker
  triangleIndex: number
  uv0: Vector2
  uv1: Vector2 | null = null;
  next: PathNode | null = null;

  constructor(
    walker: GeometryWalker,
    triangleIndex: number,
    uv0: Vector2,
    uv1?: Vector2
  ) {
    this.walker = walker
    this.triangleIndex = triangleIndex
    this.uv0 = uv0
    this.uv1 = uv1 ?? null
  }

  getPosition0(out = new Vector3()): Vector3 {
    return this.walker.getTriangle(this.triangleIndex).getPosition(this.uv0, out)
  }

  getPosition1(out = new Vector3()): Vector3 {
    if (this.uv1) {
      return this.walker.getTriangle(this.triangleIndex).getPosition(this.uv1, out)
    } else {
      return out.set(0, 0, 0)
    }
  }
}

class Triangle2DSolver {
  t0_p0 = new Vector2() // Always (0,0)
  t0_p1 = new Vector2()
  t0_p1_length = 0
  t0_p2 = new Vector2()
  t0_p2_length = 0
  t0_w = new Vector2()
  t0_w_length = 0

  t1_p0 = new Vector2()
  t1_p1 = new Vector2()
  t1_p2 = new Vector2()
  t1_u = new Vector2()
  t1_v = new Vector2()

  set(
    t0_p1_length: number,
    t0_p2_length: number,
    t0_uv_angle: number,
    t0_I_edge: number,
    t0_I_uv: Vector2,
    t0_delta_uv: Vector2,
    t1_u_length: number,
    t1_v_length: number,
    t1_uv_angle: number,
    t1_I_edge: number,
  ): this {
    this.t0_p1.set(t0_p1_length, 0)
    this.t0_p1_length = t0_p1_length
    this.t0_p2.set(
      t0_p2_length * Math.cos(t0_uv_angle),
      t0_p2_length * Math.sin(t0_uv_angle)
    )
    this.t0_p2_length = t0_p2_length
    this.t0_w.subVectors(this.t0_p2, this.t0_p1)
    this.t0_w_length = this.t0_w.length()

    debugHelper
      .clear()
      .setTransformMatrix(makeMatrix4({ y: -3 }))
      .debugTriangle([new Vector2(0, 0), this.t0_p1, this.t0_p2], { color: 'cyan' })

    return this

    switch (t1_I_edge) {
      case 1:
        // Opposite edge0
        switch (t0_I_edge) {
          // AB
          case 0: {
            this.t1_p1.copy(this.t0_p1)
            this.t1_p2.copy(this.t0_p0)
            const [s0, s1] = circleIntersection(
              this.t1_p1, t1_u_length,
              this.t1_p2, t1_v_length
            )
            throw new Error('Not implemented yet')
            break
          }

          // AC: ✅
          case 2: {
            this.t1_p1.copy(this.t0_p0)
            this.t1_p2.copy(this.t0_p2)
            // Always the first solution?
            const [s0, _] = circleIntersection(
              this.t1_p1, t1_u_length,
              this.t1_p2, t1_v_length
            )
            this.t1_p0.copy(s0)
            this.t1_u.subVectors(this.t1_p1, this.t1_p0)
            this.t1_v.subVectors(this.t1_p2, this.t1_p0)
            debugHelper
              .debugTriangle([this.t1_p0, this.t1_p1, this.t1_p2], { color: '#9ff' })

            const m0 = new Matrix2().set(
              this.t0_p1.x, this.t0_p2.x,
              this.t0_p1.y, this.t0_p2.y,
            )
            const m1_inv = invertMatrix2(new Matrix2().set(
              this.t1_u.x, this.t1_v.x,
              this.t1_u.y, this.t1_v.y,
            ))
            const m_01 = new Matrix2().multiplyMatrices(m0, m1_inv)

            const t1_delta_uv = m_01.multiplyVector2(t0_delta_uv.clone())

            break
          }
        }
    }

    return this
  }
}

export class GeometryWalker {
  pointsBuffer: Float32Array = new Float32Array(0);
  indicesBuffer = null as Uint16Array | null;
  /**
   * Triangle adjacency information, as an array of triangleCount * 3 elements.
   * Each triangle has 3 entries, one per edge, indicating the index of the adjacent triangle,
   * or -1 if there is no adjacent triangle on that edge.
   */
  triangleAdjacency = new Uint16Array(0);

  path: PathNode[] = [];

  get triangleCount() {
    if (this.indicesBuffer) {
      return this.indicesBuffer.length / 3
    } else {
      return this.pointsBuffer.length / 9
    }
  }

  static #getTriangleVertices_cache = {
    ABC: [
      new Vector3(),
      new Vector3(),
      new Vector3(),
    ] as [Vector3, Vector3, Vector3],
  };
  getTriangleVertices(triangleIndex: number, out?: [Vector3, Vector3, Vector3]): [Vector3, Vector3, Vector3] {
    const { ABC } = GeometryWalker.#getTriangleVertices_cache
    const A = out?.[0] ?? ABC[0]
    const B = out?.[1] ?? ABC[1]
    const C = out?.[2] ?? ABC[2]

    let ai: number, bi: number, ci: number
    if (this.indicesBuffer) {
      ai = this.indicesBuffer[triangleIndex * 3 + 0] * 3
      bi = this.indicesBuffer[triangleIndex * 3 + 1] * 3
      ci = this.indicesBuffer[triangleIndex * 3 + 2] * 3
    } else {
      ai = triangleIndex * 9 + 0
      bi = triangleIndex * 9 + 3
      ci = triangleIndex * 9 + 6
    }

    const arr = this.pointsBuffer
    A.set(arr[ai + 0], arr[ai + 1], arr[ai + 2])
    B.set(arr[bi + 0], arr[bi + 1], arr[bi + 2])
    C.set(arr[ci + 0], arr[ci + 1], arr[ci + 2])

    return ABC
  }

  /**
   * Rotates the vertex indices of the specified triangle (permuting the vertices 
   * indices or positions).
   */
  rotateVertexIndex(triangleIndex: number, offset = 1): this {
    offset = (offset % 3 + 3) % 3
    if (this.indicesBuffer) {
      const i0 = this.indicesBuffer[triangleIndex * 3 + 0]
      const i1 = this.indicesBuffer[triangleIndex * 3 + 1]
      const i2 = this.indicesBuffer[triangleIndex * 3 + 2]
      if (offset === 1) {
        this.indicesBuffer[triangleIndex * 3 + 0] = i1
        this.indicesBuffer[triangleIndex * 3 + 1] = i2
        this.indicesBuffer[triangleIndex * 3 + 2] = i0
      } else if (offset === 2) {
        this.indicesBuffer[triangleIndex * 3 + 0] = i2
        this.indicesBuffer[triangleIndex * 3 + 1] = i0
        this.indicesBuffer[triangleIndex * 3 + 2] = i1
      }
    } else {
      const baseIndex = triangleIndex * 9
      const x0 = this.pointsBuffer[baseIndex + 0]
      const y0 = this.pointsBuffer[baseIndex + 1]
      const z0 = this.pointsBuffer[baseIndex + 2]
      const x1 = this.pointsBuffer[baseIndex + 3]
      const y1 = this.pointsBuffer[baseIndex + 4]
      const z1 = this.pointsBuffer[baseIndex + 5]
      const x2 = this.pointsBuffer[baseIndex + 6]
      const y2 = this.pointsBuffer[baseIndex + 7]
      const z2 = this.pointsBuffer[baseIndex + 8]
      if (offset === 1) {
        this.pointsBuffer[baseIndex + 0] = x1
        this.pointsBuffer[baseIndex + 1] = y1
        this.pointsBuffer[baseIndex + 2] = z1
        this.pointsBuffer[baseIndex + 3] = x2
        this.pointsBuffer[baseIndex + 4] = y2
        this.pointsBuffer[baseIndex + 5] = z2
        this.pointsBuffer[baseIndex + 6] = x0
        this.pointsBuffer[baseIndex + 7] = y0
        this.pointsBuffer[baseIndex + 8] = z0
      } else if (offset === 2) {
        this.pointsBuffer[baseIndex + 0] = x2
        this.pointsBuffer[baseIndex + 1] = y2
        this.pointsBuffer[baseIndex + 2] = z2
        this.pointsBuffer[baseIndex + 3] = x0
        this.pointsBuffer[baseIndex + 4] = y0
        this.pointsBuffer[baseIndex + 5] = z0
        this.pointsBuffer[baseIndex + 6] = x1
        this.pointsBuffer[baseIndex + 7] = y1
        this.pointsBuffer[baseIndex + 8] = z1
      }
    }
    return this
  }

  #getTriangle_cache = new TriangleView(this, -1);
  getTriangle(triangleIndex: number, out?: TriangleView): TriangleView {
    return (out ?? this.#getTriangle_cache).set(this, triangleIndex)
  }

  fromGeometry(geometry: BufferGeometry) {
    this.pointsBuffer = geometry.attributes.position.array as Float32Array
    if (geometry.index) {
      this.indicesBuffer = geometry.index.array as Uint16Array
    } else {
      this.indicesBuffer = null
    }
    this.#computeAdjacency()
    return this
  }

  #computeAdjacency() {
    const vertexToTriangleMap = new HashMapArray<Vector3, { triangleIndex: number; localVertexIndex: number }>(
      v => {
        const prime = 31
        let hash = 17
        hash = hash * prime + Math.floor(v.x * 1000000)
        hash = hash * prime + Math.floor(v.y * 1000000)
        hash = hash * prime + Math.floor(v.z * 1000000)
        return hash
      },
      (a, b) => a.x === b.x && a.y === b.y && a.z === b.z,
      v => v.clone()
    )

    const triangleCount = this.triangleCount
    this.triangleAdjacency = new Uint16Array(triangleCount * 3)
    this.triangleAdjacency.fill(0xFFFF)

    for (let triangleIndex = 0; triangleIndex < triangleCount; triangleIndex++) {
      const triangleVertices = this.getTriangleVertices(triangleIndex)
      for (let localVertexIndex = 0; localVertexIndex < 3; localVertexIndex++) {
        const vertex = triangleVertices[localVertexIndex]
        vertexToTriangleMap.add(vertex, { triangleIndex, localVertexIndex })
      }
    }

    for (let triangleIndex = 0; triangleIndex < triangleCount; triangleIndex++) {
      const [v0, v1, v2] = this.getTriangleVertices(triangleIndex)
      const candidates0 = vertexToTriangleMap.get(v0)!.filter(e => e.triangleIndex !== triangleIndex)
      const candidates1 = vertexToTriangleMap.get(v1)!.filter(e => e.triangleIndex !== triangleIndex)
      const candidates2 = vertexToTriangleMap.get(v2)!.filter(e => e.triangleIndex !== triangleIndex)
      const edge0 = candidates1.findIndex(e1 => candidates0.some(e0 => e0.triangleIndex === e1.triangleIndex))
      const edge1 = candidates2.findIndex(e2 => candidates1.some(e1 => e1.triangleIndex === e2.triangleIndex))
      const edge2 = candidates0.findIndex(e0 => candidates2.some(e2 => e2.triangleIndex === e0.triangleIndex))
      this.triangleAdjacency[triangleIndex * 3 + 0] = edge0 >= 0 ? candidates1[edge0].triangleIndex : 0xFFFF
      this.triangleAdjacency[triangleIndex * 3 + 1] = edge1 >= 0 ? candidates2[edge1].triangleIndex : 0xFFFF
      this.triangleAdjacency[triangleIndex * 3 + 2] = edge2 >= 0 ? candidates0[edge2].triangleIndex : 0xFFFF
    }
  }

  static #getTriangleAdjacency_cache = [0, 0, 0] as [number, number, number];
  /**
   * Notes:
   * - ⚠️ The returned array is a shared cache, do not store it.
   */
  getTriangleAdjacency(triangleIndex: number): [number, number, number] {
    const cache = GeometryWalker.#getTriangleAdjacency_cache
    const normalize = (index: number) => index === 0xFFFF ? -1 : index
    cache[0] = normalize(this.triangleAdjacency[triangleIndex * 3 + 0])
    cache[1] = normalize(this.triangleAdjacency[triangleIndex * 3 + 1])
    cache[2] = normalize(this.triangleAdjacency[triangleIndex * 3 + 2])
    return cache
  }

  solver = new Triangle2DSolver()
  walk(
    startTriangleIndex: number,
    startUVArg: Vector2Declaration,
    deltaUVArg: Vector2Declaration,
    maxIterations: number = 100
  ) {
    const startUV = fromVector2Declaration(startUVArg)
    const deltaUV = fromVector2Declaration(deltaUVArg)
    const uv0 = new Vector2().copy(startUV)
    const uv1 = new Vector2().copy(startUV).add(deltaUV)

    const intersection = findFirstEdgeIntersection(startUV, deltaUV)

    this.path = []

    let currentTriangleIndex = startTriangleIndex

    const tri0 = new TriangleView(this, currentTriangleIndex)
    const tri1 = tri0.clone()

    if (intersection.valid === false) {
      // No intersection, stay in the same triangle
      this.path.push(new PathNode(this, currentTriangleIndex, uv0.clone(), uv1.clone()))
    } else {
      // Moved to another triangle, first push the segment in the starting triangle
      this.path.push(new PathNode(this, currentTriangleIndex, uv0.clone(), intersection.uv.clone()))

      tri0.set(this, currentTriangleIndex)
      const edgeIndex0 = intersection.edgeIndex

      const nextTriangleIndex = this.getTriangleAdjacency(currentTriangleIndex)[edgeIndex0]

      tri1.set(this, nextTriangleIndex)

      // console.log('intersection.edgeIndex', intersection.edgeIndex, 'nextTriangleIndex', nextTriangleIndex)
      const intersectionPoint = tri0.getPosition(intersection.uv)
      const edgeIndex1 = tri1.getClosestEdgeIndex(intersectionPoint)

      this.solver.set(
        // Triangle 0
        tri0.AB_length,
        tri0.AC_length,
        tri0.AB.angleTo(tri0.AC),
        edgeIndex0,
        intersection.uv,
        deltaUV,
        // Triangle 1
        tri1.AB_length,
        tri1.AC_length,
        tri1.AB.angleTo(tri1.AC),
        edgeIndex1,
      )

      const t1_I_uv = new Vector2()
      transposeIntersectionUV(
        intersection.uv,
        edgeIndex0,
        edgeIndex1,
        t1_I_uv,
      )
      console.log(edgeIndex0, edgeIndex1, 't1_I_uv', ...t1_I_uv)
      debugHelper
        .resetTransformMatrix()
        .point(tri1.getPosition(t1_I_uv), { color: 'orange', size: 0.5, shape: 'x-thin' })

      // Compute 2D transformation from triangle 1 to triangle 2
    }
  }
}
