import { BufferAttribute, BufferGeometry, Material, Mesh, MeshNormalMaterial, Vector3 } from 'three'

// Types for half-edge structure
export interface HVertex {
  position: Vector3
  halfEdge: HalfEdge | null
  index: number
}

export interface HalfEdge {
  vertex: HVertex
  face: Face | null
  next: HalfEdge | null
  twin: HalfEdge | null
  index: number
}

export interface Face {
  halfEdge: HalfEdge | null
  index: number
}

export interface EdgeKey {
  start: number
  end: number
}

export class HalfEdgeMesh {
  private vertices: HVertex[] = []
  private halfEdges: HalfEdge[] = []
  private faces: Face[] = []
  private edgeMap: Map<string, HalfEdge> = new Map()

  // Convert from Three.js geometry to Half-Edge Mesh
  fromGeometry(geometry: BufferGeometry): HalfEdgeMesh {
    this.clear()

    if (!geometry.index) {
      console.warn('Geometry must be indexed for half-edge conversion')
      return this
    }

    // Get position data
    const positions = geometry.getAttribute('position')
    const indices = geometry.index.array

    // Create vertices
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i)
      const y = positions.getY(i)
      const z = positions.getZ(i)

      this.vertices.push({
        position: new Vector3(x, y, z),
        halfEdge: null,
        index: i
      })
    }

    // Process triangles to create faces and half-edges
    for (let i = 0; i < indices.length; i += 3) {
      const v1 = indices[i]
      const v2 = indices[i + 1]
      const v3 = indices[i + 2]

      this.createFace(v1, v2, v3)
    }

    // Link twin half-edges
    this.linkTwinHalfEdges()

    return this
  }

  // Convert Half-Edge Mesh back to Three.js geometry
  toGeometry(geometry?: BufferGeometry): BufferGeometry {
    const result = geometry ?? new BufferGeometry()

    if (this.faces.length === 0) {
      return result
    }

    // Collect vertex positions
    const positions = new Float32Array(this.vertices.length * 3)
    for (let i = 0; i < this.vertices.length; i++) {
      const vertex = this.vertices[i]
      positions[i * 3] = vertex.position.x
      positions[i * 3 + 1] = vertex.position.y
      positions[i * 3 + 2] = vertex.position.z
    }

    // Collect triangles
    const indices: number[] = []
    for (const face of this.faces) {
      const faceVertices = this.getFaceVertices(face)

      if (faceVertices.length === 3) {
        // Triangle face
        indices.push(
          faceVertices[0].index,
          faceVertices[1].index,
          faceVertices[2].index
        )
      } else if (faceVertices.length > 3) {
        // Polygon face - triangulate using ear clipping
        const triangles = this.triangulatePolygon(faceVertices)
        for (const triangle of triangles) {
          indices.push(triangle[0], triangle[1], triangle[2])
        }
      }
    }

    result.setAttribute('position', new BufferAttribute(positions, 3))
    result.setIndex(indices)
    result.computeVertexNormals()
    result.computeBoundingBox()
    result.computeBoundingSphere()

    return result
  }

  // Create a mesh for Three.js rendering
  toMesh(material?: Material): Mesh {
    const geometry = this.toGeometry()
    return new Mesh(geometry, material || new MeshNormalMaterial())
  }

  // Create a triangular face
  private createFace(v1Index: number, v2Index: number, v3Index: number): Face {
    const v1 = this.vertices[v1Index]
    const v2 = this.vertices[v2Index]
    const v3 = this.vertices[v3Index]

    // Create face
    const face: Face = {
      halfEdge: null,
      index: this.faces.length
    }
    this.faces.push(face)

    // Create half-edges
    const he1 = this.createHalfEdge(v1, face)
    const he2 = this.createHalfEdge(v2, face)
    const he3 = this.createHalfEdge(v3, face)

    // Link half-edges in a loop
    he1.next = he2
    he2.next = he3
    he3.next = he1

    // Set face's half-edge pointer
    face.halfEdge = he1

    // Store edges for twin linking
    this.addEdgeToMap(v1Index, v2Index, he1)
    this.addEdgeToMap(v2Index, v3Index, he2)
    this.addEdgeToMap(v3Index, v1Index, he3)

    // Set vertex half-edge pointers if not set
    if (v1.halfEdge === null) v1.halfEdge = he1
    if (v2.halfEdge === null) v2.halfEdge = he2
    if (v3.halfEdge === null) v3.halfEdge = he3

    return face
  }

  // Create a half-edge
  private createHalfEdge(vertex: HVertex, face: Face): HalfEdge {
    const halfEdge: HalfEdge = {
      vertex,
      face,
      next: null,
      twin: null,
      index: this.halfEdges.length
    }
    this.halfEdges.push(halfEdge)
    return halfEdge
  }

  // Generate edge key for map
  private getEdgeKey(start: number, end: number): string {
    return `${Math.min(start, end)}-${Math.max(start, end)}`
  }

  // Add edge to map for twin linking
  private addEdgeToMap(start: number, end: number, halfEdge: HalfEdge): void {
    const key = this.getEdgeKey(start, end)
    this.edgeMap.set(key, halfEdge)
  }

  // Link opposite half-edges (twins)
  private linkTwinHalfEdges(): void {
    const processed = new Set<string>()

    for (const [key, halfEdge] of this.edgeMap) {
      if (processed.has(key)) continue

      const [startStr, endStr] = key.split('-')
      const start = parseInt(startStr)
      const end = parseInt(endStr)
      const reverseKey = this.getEdgeKey(end, start)

      if (this.edgeMap.has(reverseKey)) {
        const twin = this.edgeMap.get(reverseKey)!
        halfEdge.twin = twin
        twin.twin = halfEdge

        processed.add(key)
        processed.add(reverseKey)
      }
    }
  }

  // Get all vertices of a face in order
  getFaceVertices(face: Face): HVertex[] {
    const faceVertices: HVertex[] = []
    const startEdge = face.halfEdge

    if (!startEdge) return faceVertices

    let currentEdge: HalfEdge | null = startEdge

    do {
      faceVertices.push(currentEdge.vertex)
      currentEdge = currentEdge.next
    } while (currentEdge && currentEdge !== startEdge)

    return faceVertices
  }

  // Get all half-edges around a vertex (radial order)
  getVertexHalfEdges(vertex: HVertex): HalfEdge[] {
    const result: HalfEdge[] = []
    const startEdge = vertex.halfEdge

    if (!startEdge) return result

    let currentEdge: HalfEdge | null = startEdge

    do {
      result.push(currentEdge)
      // Move to next half-edge around vertex
      if (currentEdge.twin) {
        currentEdge = currentEdge.twin.next
      } else {
        break
      }
    } while (currentEdge && currentEdge !== startEdge)

    return result
  }

  // Get adjacent faces of a vertex
  getAdjacentFaces(vertex: HVertex): Face[] {
    const adjacentFaces: Face[] = []
    const vertexEdges = this.getVertexHalfEdges(vertex)

    for (const he of vertexEdges) {
      if (he.face && !adjacentFaces.includes(he.face)) {
        adjacentFaces.push(he.face)
      }
    }

    return adjacentFaces
  }

  // Get all vertices adjacent to a vertex
  getAdjacentVertices(vertex: HVertex): HVertex[] {
    const adjacentVertices: HVertex[] = []
    const vertexEdges = this.getVertexHalfEdges(vertex)

    for (const he of vertexEdges) {
      // The vertex at the end of this half-edge is adjacent
      if (he.next && he.next.vertex !== vertex) {
        adjacentVertices.push(he.next.vertex)
      }
    }

    return adjacentVertices
  }

  // Get boundary edges (edges without twins)
  getBoundaryEdges(): HalfEdge[] {
    return this.halfEdges.filter(he => he.twin === null)
  }

  // Check if mesh is closed (no boundary edges)
  isClosed(): boolean {
    return this.getBoundaryEdges().length === 0
  }

  // Edge collapse operation
  edgeCollapse(edgeToCollapse: HalfEdge): boolean {
    if (!edgeToCollapse || !edgeToCollapse.twin) {
      return false
    }

    const v1 = edgeToCollapse.vertex
    const v2 = edgeToCollapse.twin.vertex

    // Average position
    v1.position.add(v2.position).multiplyScalar(0.5)

    // Get all faces adjacent to v2
    const facesToRemove = this.getAdjacentFaces(v2)

    // Redirect all half-edges from v2 to v1
    for (const he of this.halfEdges) {
      if (he.vertex === v2) {
        he.vertex = v1
      }
    }

    // Remove faces that would become degenerate
    for (const face of facesToRemove) {
      this.removeFace(face)
    }

    // Remove vertex v2
    const v2Index = this.vertices.indexOf(v2)
    if (v2Index !== -1) {
      this.vertices.splice(v2Index, 1)
    }

    // Update indices
    this.reindex()

    return true
  }

  // Face split operation
  faceSplit(face: Face, position: Vector3): HVertex | null {
    if (!face.halfEdge) return null

    // Create new vertex at center
    const faceVertices = this.getFaceVertices(face)
    const center = new Vector3()
    for (const vertex of faceVertices) {
      center.add(vertex.position)
    }
    center.divideScalar(faceVertices.length)
    center.lerp(position, 0.5) // Blend with provided position

    const newVertex: HVertex = {
      position: center,
      halfEdge: null,
      index: this.vertices.length
    }
    this.vertices.push(newVertex)

    // Remove old face
    this.removeFace(face)

    // Create new triangular faces from center to each edge
    for (let i = 0; i < faceVertices.length; i++) {
      const v1 = faceVertices[i]
      const v2 = faceVertices[(i + 1) % faceVertices.length]
      this.createFace(v1.index, v2.index, newVertex.index)
    }

    return newVertex
  }

  // Remove a face
  private removeFace(face: Face): void {
    if (!face.halfEdge) return

    // Get all half-edges of this face
    const faceEdges: HalfEdge[] = []
    let currentEdge: HalfEdge | null = face.halfEdge

    do {
      if (!currentEdge) break
      faceEdges.push(currentEdge)
      currentEdge = currentEdge.next
    } while (currentEdge && currentEdge !== face.halfEdge)

    // Remove half-edges from global list
    for (const edge of faceEdges) {
      const edgeIndex = this.halfEdges.indexOf(edge)
      if (edgeIndex !== -1) {
        this.halfEdges.splice(edgeIndex, 1)
      }
    }

    // Remove face
    const faceIndex = this.faces.indexOf(face)
    if (faceIndex !== -1) {
      this.faces.splice(faceIndex, 1)
    }
  }

  // Triangulate polygon using ear clipping
  private triangulatePolygon(vertices: HVertex[]): number[][] {
    const triangles: number[][] = []

    if (vertices.length < 3) return triangles
    if (vertices.length === 3) {
      return [[vertices[0].index, vertices[1].index, vertices[2].index]]
    }

    // Simple fan triangulation for convex polygons
    for (let i = 1; i < vertices.length - 1; i++) {
      triangles.push([
        vertices[0].index,
        vertices[i].index,
        vertices[i + 1].index
      ])
    }

    return triangles
  }

  // Reindex all elements
  private reindex(): void {
    for (let i = 0; i < this.vertices.length; i++) {
      this.vertices[i].index = i
    }

    for (let i = 0; i < this.halfEdges.length; i++) {
      this.halfEdges[i].index = i
    }

    for (let i = 0; i < this.faces.length; i++) {
      this.faces[i].index = i
    }
  }

  // Clear the mesh
  clear(): void {
    this.vertices = []
    this.halfEdges = []
    this.faces = []
    this.edgeMap.clear()
  }

  // Getter methods
  getVertices(): HVertex[] { return this.vertices }
  getHalfEdges(): HalfEdge[] { return this.halfEdges }
  getFaces(): Face[] { return this.faces }

  // Validation method to check mesh consistency
  validate(): boolean {
    // Check if all half-edges have valid vertices and faces
    for (const he of this.halfEdges) {
      if (!he.vertex || !he.face) {
        console.warn(`HalfEdge ${he.index} has null vertex or face`)
        return false
      }

      if (!he.next) {
        console.warn(`HalfEdge ${he.index} has null next pointer`)
        return false
      }
    }

    // Check if all vertices have at least one half-edge
    for (const vertex of this.vertices) {
      if (!vertex.halfEdge) {
        console.warn(`Vertex ${vertex.index} has null halfEdge pointer`)
        return false
      }
    }

    // Check face loops
    for (const face of this.faces) {
      if (!face.halfEdge) {
        console.warn(`Face ${face.index} has null halfEdge pointer`)
        return false
      }

      // Verify face loop is closed
      const faceVertices = this.getFaceVertices(face)
      if (faceVertices.length < 3) {
        console.warn(`Face ${face.index} has less than 3 vertices`)
        return false
      }
    }

    return true
  }

  // Compute mesh statistics
  getStatistics(): {
    vertices: number
    edges: number
    faces: number
    isClosed: boolean
    boundaryEdges: number
  } {
    const boundaryEdges = this.getBoundaryEdges().length
    const edges = this.halfEdges.length / 2 + boundaryEdges

    return {
      vertices: this.vertices.length,
      edges: edges,
      faces: this.faces.length,
      isClosed: this.isClosed(),
      boundaryEdges: boundaryEdges
    }
  }
}