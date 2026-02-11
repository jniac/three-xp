import { Matrix3, Matrix4, Vector2, Vector3 } from 'three'

interface ExtrusionBuffers {
  position: Float32Array
  normal: Float32Array
  uv: Float32Array
  index: Uint16Array | Uint32Array
}

const _shared = {
  _v2: new Vector2(),
  _v3: new Vector3(),
  _n3: new Vector3(),
}

function extrudeShapeAlongPath(options: {
  shape: Iterable<Vector2> | (() => Generator<Vector2>)
  shapeLength: number
  shapeIsClosed: boolean
  path: Iterable<Matrix4> | (() => Generator<Matrix4>)
  pathLength: number
  pathIsClosed: boolean
}): ExtrusionBuffers {
  const {
    shape: shapeArg,
    shapeLength,
    shapeIsClosed,

    path: pathArg,
    pathLength,
    pathIsClosed,
  } = options

  const {
    _v2,
    _v3,
    _n3,
  } = _shared

  const shape = typeof shapeArg === 'function' ? shapeArg() : shapeArg
  const path = typeof pathArg === 'function' ? pathArg() : pathArg

  // Calculate buffer sizes
  const shapeVertCount = shapeIsClosed ? shapeLength + 1 : shapeLength
  const pathVertCount = pathIsClosed ? pathLength + 1 : pathLength
  const totalVertices = shapeVertCount * pathVertCount
  const totalQuads = shapeVertCount * pathVertCount
  const indexCount = totalQuads * 6

  // Create buffers
  const position = new Float32Array(totalVertices * 3)
  const normal = new Float32Array(totalVertices * 3)
  const uv = new Float32Array(totalVertices * 2)
  const index = totalVertices > 65535
    ? new Uint32Array(indexCount)
    : new Uint16Array(indexCount)

  // Reconstruct shape points
  const shapePoints: Vector2[] = []
  const shapeIterator = shape[Symbol.iterator]()
  for (let i = 0; i < shapeLength; i++) {
    const { value } = shapeIterator.next()
    shapePoints.push(value.clone())
  }
  if (shapeIsClosed) {
    shapePoints.push(shapePoints[0].clone())
  }

  // Compute shape normals (2D normals in XY plane)
  const shapeNormals: Vector2[] = []
  for (let i = 0; i < shapePoints.length; i++) {
    const prevIdx = i === 0
      ? (shapeIsClosed ? shapePoints.length - 2 : 0)
      : i - 1
    const nextIdx = i === shapePoints.length - 1
      ? (shapeIsClosed ? 1 : shapePoints.length - 1)
      : i + 1

    const prev = shapePoints[prevIdx]
    const next = shapePoints[nextIdx]

    // Compute edge direction and perpendicular normal
    const edge = _v2.subVectors(prev, next)
    const normal = new Vector2(-edge.y, edge.x).normalize()

    shapeNormals.push(normal)
  }

  // Fill vertex buffers ring by ring
  const pathIterator = path[Symbol.iterator]()
  let pathIndex = 0
  const firstMatrix = new Matrix4() // to store first matrix for closed path handling

  for (let p = 0; p < pathLength; p++) {
    const { value: currentMatrix } = pathIterator.next()

    if (p === 0) {
      firstMatrix.copy(currentMatrix)
    }

    // Extract normal matrix (upper 3x3 inverse transpose)
    const normalMatrix = new Matrix3().getNormalMatrix(currentMatrix)

    for (let s = 0; s < shapePoints.length; s++) {
      const vertexIndex = p * shapePoints.length + s
      const posOffset = vertexIndex * 3
      const uvOffset = vertexIndex * 2

      // Transform shape point by path matrix
      const point3D = _v3.set(shapePoints[s].x, shapePoints[s].y, 0)
      point3D.applyMatrix4(currentMatrix)

      position[posOffset] = point3D.x
      position[posOffset + 1] = point3D.y
      position[posOffset + 2] = point3D.z

      // Transform shape normal by normal matrix
      const normal3D = _n3.set(shapeNormals[s].x, shapeNormals[s].y, 0)
      normal3D.applyMatrix3(normalMatrix) // already normalized

      normal[posOffset] = normal3D.x
      normal[posOffset + 1] = normal3D.y
      normal[posOffset + 2] = normal3D.z

      // Compute UVs
      uv[uvOffset] = s / (shapePoints.length - 1)
      uv[uvOffset + 1] = p / (pathLength - 1)
    }

    pathIndex++
  }

  // Handle closed path - duplicate first ring at the end
  if (pathIsClosed) {
    const normalMatrix = new Matrix3().getNormalMatrix(firstMatrix)

    for (let s = 0; s < shapePoints.length; s++) {
      const vertexIndex = pathLength * shapePoints.length + s
      const posOffset = vertexIndex * 3
      const uvOffset = vertexIndex * 2

      const point3D = _v3.set(shapePoints[s].x, shapePoints[s].y, 0)
      point3D.applyMatrix4(firstMatrix)

      position[posOffset] = point3D.x
      position[posOffset + 1] = point3D.y
      position[posOffset + 2] = point3D.z

      const normal3D = _n3.set(shapeNormals[s].x, shapeNormals[s].y, 0)
      normal3D.applyMatrix3(normalMatrix) // already normalized

      normal[posOffset] = normal3D.x
      normal[posOffset + 1] = normal3D.y
      normal[posOffset + 2] = normal3D.z

      uv[uvOffset] = s / (shapePoints.length - 1)
      uv[uvOffset + 1] = 1.0 // UV wraps around
    }
  }

  // Fill index buffer
  let indexOffset = 0
  for (let p = 0; p < pathVertCount - 1; p++) {
    for (let s = 0; s < shapePoints.length - 1; s++) {
      const i0 = p * shapePoints.length + s
      const i1 = p * shapePoints.length + (s + 1)
      const i2 = (p + 1) * shapePoints.length + s
      const i3 = (p + 1) * shapePoints.length + (s + 1)

      // First triangle
      index[indexOffset++] = i0
      index[indexOffset++] = i1
      index[indexOffset++] = i2

      // Second triangle
      index[indexOffset++] = i1
      index[indexOffset++] = i3
      index[indexOffset++] = i2
    }
  }

  return { position, normal, uv, index }
}

export { extrudeShapeAlongPath, type ExtrusionBuffers }
