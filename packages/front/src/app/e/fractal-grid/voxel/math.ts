import { Matrix4, Vector3 } from 'three'

const u = new Vector3(1, 0, 1).normalize()
const v = new Vector3(0, 1, -1).normalize() // Temporary
const w = new Vector3().crossVectors(u, v).normalize()
v.crossVectors(w, u).normalize() // Final

export const worldTangentVectors = { u, v, w }
export const worldTangentMatrix = new Matrix4().makeBasis(u, v, w)
