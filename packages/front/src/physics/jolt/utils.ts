import JoltModule from 'jolt-physics/wasm-compat'
import { Euler, Quaternion, Vector3 } from 'three'

import { EulerDeclaration, fromEulerDeclaration } from 'some-utils-three/declaration'
import { Vector3Declaration, fromVector3Declaration } from 'some-utils-ts/declaration'

const _v = new Vector3()
const _e = new Euler()
const _q = new Quaternion()

export function fromRVec3(arg: JoltModule.RVec3, out = new Vector3()): Vector3 {
  out.set(arg.GetX(), arg.GetY(), arg.GetZ())
  return out
}

export function toRVec3(arg: Vector3Declaration, out: JoltModule.RVec3) {
  const { x, y, z } = fromVector3Declaration(arg, _v)
  out.SetX(x)
  out.SetY(y)
  out.SetZ(z)
  return out
}

export function toVec3(arg: Vector3Declaration, out: JoltModule.Vec3) {
  const { x, y, z } = fromVector3Declaration(arg, _v)
  out.SetX(x)
  out.SetY(y)
  out.SetZ(z)
  return out
}

export function fromQuat(arg: JoltModule.Quat, out = new Quaternion()): Quaternion {
  out.set(arg.GetX(), arg.GetY(), arg.GetZ(), arg.GetW())
  return out
}

export function toQuat(arg: EulerDeclaration, out: JoltModule.Quat) {
  fromEulerDeclaration(arg, _e)
  const { x, y, z, w } = _q.setFromEuler(_e)
  out.SetX(x)
  out.SetY(y)
  out.SetZ(z)
  out.SetW(w)
  return out
}

