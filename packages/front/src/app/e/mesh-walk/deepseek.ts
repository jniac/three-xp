import * as THREE from 'three'

export interface TriangleWalkResult {
  triangleIndex: number
  uv: THREE.Vector2
  edgeHit?: number // 0, 1, or 2 for which edge was crossed
}

export class MeshTriangleWalker {
  protected geometry: THREE.BufferGeometry
  protected positions: Float32Array
  protected indices: Uint32Array | Uint16Array
  protected triangles: THREE.Vector3[][]

  constructor(geometry: THREE.BufferGeometry) {
    this.geometry = geometry
    this.positions = geometry.getAttribute('position').array as Float32Array
    this.indices = geometry.index?.array as Uint32Array | Uint16Array

    // Precompute triangle vertices for faster access
    this.triangles = this.precomputeTriangles()
  }

  protected precomputeTriangles(): THREE.Vector3[][] {
    const triangles: THREE.Vector3[][] = []

    if (!this.geometry.index) {
      // Non-indexed geometry
      for (let i = 0; i < this.positions.length / 9; i++) {
        const v0 = new THREE.Vector3(
          this.positions[i * 9],
          this.positions[i * 9 + 1],
          this.positions[i * 9 + 2]
        )
        const v1 = new THREE.Vector3(
          this.positions[i * 9 + 3],
          this.positions[i * 9 + 4],
          this.positions[i * 9 + 5]
        )
        const v2 = new THREE.Vector3(
          this.positions[i * 9 + 6],
          this.positions[i * 9 + 7],
          this.positions[i * 9 + 8]
        )
        triangles.push([v0, v1, v2])
      }
    } else {
      // Indexed geometry
      for (let i = 0; i < this.indices.length; i += 3) {
        const idx0 = this.indices[i]
        const idx1 = this.indices[i + 1]
        const idx2 = this.indices[i + 2]

        const v0 = new THREE.Vector3(
          this.positions[idx0 * 3],
          this.positions[idx0 * 3 + 1],
          this.positions[idx0 * 3 + 2]
        )
        const v1 = new THREE.Vector3(
          this.positions[idx1 * 3],
          this.positions[idx1 * 3 + 1],
          this.positions[idx1 * 3 + 2]
        )
        const v2 = new THREE.Vector3(
          this.positions[idx2 * 3],
          this.positions[idx2 * 3 + 1],
          this.positions[idx2 * 3 + 2]
        )
        triangles.push([v0, v1, v2])
      }
    }

    return triangles
  }

  /**
   * Main function: Walk from a starting point in UV space across triangles
   */
  walk(
    startTriangleIndex: number,
    startUV: THREE.Vector2,
    deltaUV: THREE.Vector2,
    maxIterations: number = 100
  ): TriangleWalkResult {
    let currentTriangle = startTriangleIndex
    let currentUV = startUV.clone()
    let remainingDelta = deltaUV.clone()

    // If we're already outside the triangle, find the containing triangle first
    if (!this.isPointInTriangle(currentTriangle, currentUV)) {
      const result = this.findContainingTriangle(currentUV)
      if (!result) {
        throw new Error("Starting point is outside mesh bounds")
      }
      currentTriangle = result.triangleIndex
      currentUV = result.uv
    }

    let iterations = 0

    while (remainingDelta.length() > 0.0001 && iterations < maxIterations) {
      // Try to move within current triangle
      const result = this.moveInTriangle(currentTriangle, currentUV, remainingDelta)

      if (result.reachedTarget) {
        // We reached the target without leaving the triangle
        currentUV = result.newUV!
        break
      } else {
        // We hit an edge, need to cross to adjacent triangle
        const crossResult = this.crossToAdjacentTriangle(
          currentTriangle,
          result.edgeHit!,
          result.edgeUV!,
          result.remainingDelta!
        )

        if (!crossResult.success) {
          // Hit mesh boundary or can't find adjacent triangle
          console.warn("Hit mesh boundary")
          break
        }

        // Update for next iteration
        currentTriangle = crossResult.triangleIndex!
        currentUV = crossResult.entryUV!
        remainingDelta = crossResult.remainingDelta!
      }

      iterations++
    }

    return {
      triangleIndex: currentTriangle,
      uv: currentUV
    }
  }

  /**
   * Move within a single triangle
   * Returns whether we hit an edge or reached the target
   */
  private moveInTriangle(
    triangleIndex: number,
    startUV: THREE.Vector2,
    deltaUV: THREE.Vector2
  ): {
    reachedTarget: boolean
    newUV?: THREE.Vector2
    edgeHit?: number
    edgeUV?: THREE.Vector2
    remainingDelta?: THREE.Vector2
  } {
    const endUV = startUV.clone().add(deltaUV)

    // Check if end point is inside triangle
    if (this.isPointInTriangle(triangleIndex, endUV)) {
      return {
        reachedTarget: true,
        newUV: endUV
      }
    }

    // Find intersection with triangle edges
    const edges = [
      [0, 1], // Edge from UV (0,0) to (1,0)
      [1, 2], // Edge from UV (1,0) to (0,1)
      [2, 0]  // Edge from UV (0,1) to (0,0)
    ]

    let closestIntersection: THREE.Vector2 | null = null
    let closestEdge = -1
    let closestT = Infinity

    for (let edgeIdx = 0; edgeIdx < 3; edgeIdx++) {
      const [uv1Idx, uv2Idx] = edges[edgeIdx]
      const uv1 = this.getUVForVertex(triangleIndex, uv1Idx)
      const uv2 = this.getUVForVertex(triangleIndex, uv2Idx)

      const intersection = this.lineSegmentIntersection(
        startUV,
        endUV,
        uv1,
        uv2
      )

      if (intersection && intersection.t < closestT && intersection.t > 0) {
        closestT = intersection.t
        closestEdge = edgeIdx
        closestIntersection = intersection.point
      }
    }

    if (closestEdge === -1 || !closestIntersection) {
      // No intersection found (shouldn't happen if start is inside)
      return {
        reachedTarget: true,
        newUV: endUV
      }
    }

    // Calculate remaining delta after hitting edge
    const traveledVector = closestIntersection.clone().sub(startUV)
    const remainingDelta = deltaUV.clone().sub(traveledVector)

    return {
      reachedTarget: false,
      edgeHit: closestEdge,
      edgeUV: closestIntersection,
      remainingDelta: remainingDelta
    }
  }

  /**
   * Cross from current triangle to adjacent triangle through an edge
   */
  private crossToAdjacentTriangle(
    currentTriangle: number,
    edgeIndex: number,
    edgeUV: THREE.Vector2,
    remainingDelta: THREE.Vector2
  ): {
    success: boolean
    triangleIndex?: number
    entryUV?: THREE.Vector2
    remainingDelta?: THREE.Vector2
  } {
    // Find adjacent triangle (you need adjacency information)
    // This requires knowing which triangles share edges
    const adjacentTriangle = this.findAdjacentTriangle(currentTriangle, edgeIndex)

    if (adjacentTriangle === -1) {
      return { success: false }
    }

    // Transform remaining delta to new triangle's coordinate system
    const transformedDelta = this.transformDeltaToAdjacentTriangle(
      currentTriangle,
      edgeIndex,
      adjacentTriangle,
      remainingDelta
    )

    // Convert edge position to new triangle's UV coordinates
    const entryUV = this.convertEdgePointToAdjacentUV(
      currentTriangle,
      edgeIndex,
      adjacentTriangle,
      edgeUV
    )

    return {
      success: true,
      triangleIndex: adjacentTriangle,
      entryUV: entryUV,
      remainingDelta: transformedDelta
    }
  }

  /**
   * Transform the remaining movement vector from current triangle to adjacent triangle
   * This maintains the same geometric direction in 3D space
   */
  private transformDeltaToAdjacentTriangle(
    currentTriangle: number,
    edgeIndex: number,
    adjacentTriangle: number,
    deltaUV: THREE.Vector2
  ): THREE.Vector2 {
    // Get the edge in 3D space
    const edgeVertices = this.getEdgeVertices(currentTriangle, edgeIndex)
    const v0 = edgeVertices[0]
    const v1 = edgeVertices[1]

    // Create basis for current triangle
    const currentVerts = this.triangles[currentTriangle]
    const currentBasis = this.createBarycentricBasis(currentVerts[0], currentVerts[1], currentVerts[2])

    // Create basis for adjacent triangle
    const adjacentVerts = this.triangles[adjacentTriangle]
    const adjacentBasis = this.createBarycentricBasis(adjacentVerts[0], adjacentVerts[1], adjacentVerts[2])

    // Convert deltaUV to 3D vector in current triangle's plane
    const delta3D = new THREE.Vector3()
    delta3D.addScaledVector(currentBasis.u, deltaUV.x)
    delta3D.addScaledVector(currentBasis.v, deltaUV.y)

    // Project this 3D vector onto adjacent triangle's plane
    const normalAdjacent = adjacentBasis.normal
    const projectedDelta = delta3D.clone().sub(
      normalAdjacent.clone().multiplyScalar(delta3D.dot(normalAdjacent))
    )

    // Express projected vector in adjacent triangle's UV coordinates
    const uComp = projectedDelta.dot(adjacentBasis.u)
    const vComp = projectedDelta.dot(adjacentBasis.v)

    return new THREE.Vector2(uComp, vComp)
  }

  /**
   * Convert a point on an edge to UV coordinates in the adjacent triangle
   */
  private convertEdgePointToAdjacentUV(
    currentTriangle: number,
    edgeIndex: number,
    adjacentTriangle: number,
    edgePointUV: THREE.Vector2
  ): THREE.Vector2 {
    // Get barycentric coordinates of edge point in current triangle
    const barycentric = this.uvToBarycentric(currentTriangle, edgePointUV)

    // Map edge barycentric coordinates to adjacent triangle
    // Edge vertices have specific mapping between triangles
    const edgeMapping = this.getEdgeVertexMapping(currentTriangle, edgeIndex, adjacentTriangle)

    // Create barycentric coordinates for adjacent triangle
    const newBarycentric = new THREE.Vector3(0, 0, 0)

    // Map vertices based on edge orientation
    // This depends on how triangles share the edge
    for (let i = 0; i < 3; i++) {
      const mappedIndex = edgeMapping[i]
      if (mappedIndex !== -1) {
        newBarycentric.setComponent(mappedIndex, barycentric.getComponent(i))
      }
    }

    // Convert back to UV coordinates
    return this.barycentricToUV(adjacentTriangle, newBarycentric)
  }

  /**
   * Find which triangle shares the given edge
   * This requires precomputed adjacency information
   */
  protected findAdjacentTriangle(triangleIndex: number, edgeIndex: number): number {
    // Implementation depends on your data structure
    // Here's a brute-force approach for small meshes:
    const currentTri = this.triangles[triangleIndex]
    const edgeVerts = this.getEdgeVertices(triangleIndex, edgeIndex)

    for (let i = 0; i < this.triangles.length; i++) {
      if (i === triangleIndex) continue

      const tri = this.triangles[i]

      // Check if this triangle shares the edge
      if (this.trianglesShareEdge(currentTri, tri, edgeVerts)) {
        return i
      }
    }

    return -1 // No adjacent triangle (boundary edge)
  }

  // Helper methods

  private getEdgeVertices(triangleIndex: number, edgeIndex: number): [THREE.Vector3, THREE.Vector3] {
    const tri = this.triangles[triangleIndex]
    switch (edgeIndex) {
      case 0: return [tri[0], tri[1]]
      case 1: return [tri[1], tri[2]]
      case 2: return [tri[2], tri[0]]
      default: throw new Error("Invalid edge index")
    }
  }

  private trianglesShareEdge(tri1: THREE.Vector3[], tri2: THREE.Vector3[], edgeVerts: [THREE.Vector3, THREE.Vector3]): boolean {
    const [v0, v1] = edgeVerts

    // Check if both vertices of the edge are in tri2
    const hasV0 = tri2.some(v => v.distanceToSquared(v0) < 0.0001)
    const hasV1 = tri2.some(v => v.distanceToSquared(v1) < 0.0001)

    return hasV0 && hasV1
  }

  private getEdgeVertexMapping(currentTriangle: number, edgeIndex: number, adjacentTriangle: number): number[] {
    // This maps vertex indices from current triangle to adjacent triangle
    // Returns array where index i in current triangle maps to mappedIndex[i] in adjacent
    // or -1 if vertex is not shared

    const currentTri = this.triangles[currentTriangle]
    const adjacentTri = this.triangles[adjacentTriangle]

    const mapping = [-1, -1, -1]

    for (let i = 0; i < 3; i++) {
      const currentVert = currentTri[i]

      for (let j = 0; j < 3; j++) {
        if (adjacentTri[j].distanceToSquared(currentVert) < 0.0001) {
          mapping[i] = j
          break
        }
      }
    }

    return mapping
  }

  private createBarycentricBasis(v0: THREE.Vector3, v1: THREE.Vector3, v2: THREE.Vector3): {
    u: THREE.Vector3
    v: THREE.Vector3
    normal: THREE.Vector3
  } {
    const u = v1.clone().sub(v0)
    const v = v2.clone().sub(v0)
    const normal = new THREE.Vector3().crossVectors(u, v).normalize()

    return { u, v, normal }
  }

  private uvToBarycentric(triangleIndex: number, uv: THREE.Vector2): THREE.Vector3 {
    // Convert UV coordinates (in triangle's parametric space) to barycentric coordinates
    const u = uv.x
    const v = uv.y
    return new THREE.Vector3(1 - u - v, u, v)
  }

  private barycentricToUV(triangleIndex: number, barycentric: THREE.Vector3): THREE.Vector2 {
    // Convert barycentric coordinates to UV coordinates
    return new THREE.Vector2(barycentric.y, barycentric.z)
  }

  private getUVForVertex(triangleIndex: number, vertexIndex: number): THREE.Vector2 {
    // UV coordinates for triangle vertices in parametric space
    switch (vertexIndex) {
      case 0: return new THREE.Vector2(0, 0) // v0
      case 1: return new THREE.Vector2(1, 0) // v1
      case 2: return new THREE.Vector2(0, 1) // v2
      default: throw new Error("Invalid vertex index")
    }
  }

  private isPointInTriangle(triangleIndex: number, uv: THREE.Vector2): boolean {
    // Check if point is inside triangle in UV space
    const u = uv.x
    const v = uv.y
    return u >= 0 && v >= 0 && (u + v) <= 1
  }

  private lineSegmentIntersection(
    p1: THREE.Vector2, p2: THREE.Vector2,
    q1: THREE.Vector2, q2: THREE.Vector2
  ): { point: THREE.Vector2; t: number } | null {
    // Line segment intersection in 2D
    const r = p2.clone().sub(p1)
    const s = q2.clone().sub(q1)

    const cross = r.cross(s)

    if (Math.abs(cross) < 0.0001) {
      // Lines are parallel
      return null
    }

    const qp = q1.clone().sub(p1)
    const t = qp.cross(s) / cross
    const u = qp.cross(r) / cross

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      const intersection = p1.clone().add(r.multiplyScalar(t))
      return { point: intersection, t: t }
    }

    return null
  }

  private findContainingTriangle(uv: THREE.Vector2): TriangleWalkResult | null {
    // Brute-force search for triangle containing point
    for (let i = 0; i < this.triangles.length; i++) {
      if (this.isPointInTriangle(i, uv)) {
        return {
          triangleIndex: i,
          uv: uv.clone()
        }
      }
    }
    return null
  }
}

export class OptimizedTriangleWalker extends MeshTriangleWalker {
  private adjacency!: Map<string, number> // Maps edge to adjacent triangle
  private edgeToAdjacent!: Map<number, number[]> // triangleIndex -> [adjacentTriangle0, adjacentTriangle1, adjacentTriangle2]

  constructor(geometry: THREE.BufferGeometry) {
    super(geometry)
    this.precomputeAdjacency()
  }

  protected precomputeAdjacency(): void {
    this.adjacency = new Map()
    this.edgeToAdjacent = new Map()

    const positions = this.geometry.getAttribute('position').array as Float32Array
    const indices = this.geometry.index?.array as Uint32Array | Uint16Array

    if (!indices) return

    // Build edge map
    for (let i = 0; i < indices.length; i += 3) {
      const triIndex = i / 3
      const v0 = indices[i]
      const v1 = indices[i + 1]
      const v2 = indices[i + 2]

      // Store edges with sorted vertices
      const edges = [
        [Math.min(v0, v1), Math.max(v0, v1)],
        [Math.min(v1, v2), Math.max(v1, v2)],
        [Math.min(v2, v0), Math.max(v2, v0)]
      ]

      for (let edgeIdx = 0; edgeIdx < 3; edgeIdx++) {
        const [a, b] = edges[edgeIdx]
        const edgeKey = `${a}-${b}`

        if (this.adjacency.has(edgeKey)) {
          // Edge already exists, so this is the adjacent triangle
          const existingTriangle = this.adjacency.get(edgeKey)!

          // Store adjacency in both directions
          this.setAdjacent(triIndex, edgeIdx, existingTriangle)
          this.setAdjacent(existingTriangle, this.findEdgeIndex(existingTriangle, a, b), triIndex)

          // Remove from map since edge is now paired
          this.adjacency.delete(edgeKey)
        } else {
          // First time seeing this edge
          this.adjacency.set(edgeKey, triIndex)
        }
      }
    }

    // Remaining edges in adjacency map are boundary edges
  }

  private setAdjacent(triangleIndex: number, edgeIndex: number, adjacentTriangle: number): void {
    if (!this.edgeToAdjacent.has(triangleIndex)) {
      this.edgeToAdjacent.set(triangleIndex, [-1, -1, -1])
    }
    const adj = this.edgeToAdjacent.get(triangleIndex)!
    adj[edgeIndex] = adjacentTriangle
  }

  private findEdgeIndex(triangleIndex: number, v1: number, v2: number): number {
    const indices = this.geometry.index!.array as Uint32Array | Uint16Array
    const base = triangleIndex * 3
    const triVerts = [indices[base], indices[base + 1], indices[base + 2]]

    // Check each edge
    const edges = [
      [triVerts[0], triVerts[1]],
      [triVerts[1], triVerts[2]],
      [triVerts[2], triVerts[0]]
    ]

    for (let i = 0; i < 3; i++) {
      const [a, b] = edges[i]
      if ((a === v1 && b === v2) || (a === v2 && b === v1)) {
        return i
      }
    }

    return -1
  }

  protected findAdjacentTriangle(triangleIndex: number, edgeIndex: number): number {
    const adj = this.edgeToAdjacent.get(triangleIndex)
    if (!adj) return -1

    return adj[edgeIndex]
  }
}