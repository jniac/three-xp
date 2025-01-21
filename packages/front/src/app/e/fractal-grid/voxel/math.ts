import { Euler, Matrix4, Plane, Vector3 } from 'three'

export const CHUNK_COL = 6
export const CHUNK_ROW = 4

export const CHUNK_SIZE = new Vector3(CHUNK_COL, CHUNK_ROW, CHUNK_COL + CHUNK_ROW - 1)

export const CHUNK_CORNERS = [
  new Vector3(0, 0, CHUNK_ROW),
  new Vector3(0, CHUNK_ROW, 0),
  new Vector3(CHUNK_COL, 0, CHUNK_ROW + CHUNK_COL - 1),
  new Vector3(CHUNK_COL, CHUNK_ROW, CHUNK_COL),
]

export const WORLD_LIMIT = new Vector3(0, -2 * CHUNK_ROW, 2 * CHUNK_ROW)

const U = new Vector3(1, 0, 1).normalize()
const V = new Vector3(0, 1, -1).normalize() // Temporary
const W = new Vector3().crossVectors(U, V).normalize()
V.crossVectors(W, U).normalize() // Final

export const WORLD_BASIS = { U, V, W }
export const WORLD_MATRIX = new Matrix4().makeBasis(U, V, W).setPosition(WORLD_LIMIT)
export const WORLD_MATRIX_INVERSE = new Matrix4().copy(WORLD_MATRIX).invert()
export const WORLD_EULER = new Euler().setFromRotationMatrix(WORLD_MATRIX)
export const WORLD_PLANE = new Plane().setFromNormalAndCoplanarPoint(W, WORLD_LIMIT)
