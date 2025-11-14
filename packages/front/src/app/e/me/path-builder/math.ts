import { AngleDeclaration, Vector2Declaration, fromAngleDeclaration, fromVector2Declaration } from 'some-utils-ts/declaration'
import { Vector2Like } from 'some-utils-ts/types'

export type Transform2DDeclaration = Partial<{
  x: number
  y: number
  scaleX: number
  scaleY: number
  rotation: AngleDeclaration
  position: Vector2Declaration
  scale: Vector2Declaration
}>

const tempMatrix: number[] = [1, 0, 0, 1, 0, 0]

export function transform2DToMatrix3x2(params?: Transform2DDeclaration, out?: number[]): number[] {
  const {
    x = 0,
    y = 0,
    position = { x, y },

    scaleX = 1,
    scaleY = 1,
    scale = { x: scaleX, y: scaleY },

    rotation = 0,
  } = params ?? {}

  out ??= tempMatrix

  const a = fromAngleDeclaration(rotation)
  const cos = Math.cos(a)
  const sin = Math.sin(a)
  const { x: px, y: py } = fromVector2Declaration(position)
  const { x: sx, y: sy } = fromVector2Declaration(scale)

  out[0] = cos * sx
  out[1] = sin * sx
  out[2] = -sin * sy
  out[3] = cos * sy
  out[4] = px
  out[5] = py

  return out
}

const tempPoint: Vector2Like = { x: 0, y: 0 }

export function applyMatrix3x2ToPoint<T extends Vector2Like>(matrix: number[], point: Vector2Like, out?: T): T {
  out ??= tempPoint as T
  const x = point.x
  const y = point.y
  out.x = matrix[0] * x + matrix[2] * y + matrix[4]
  out.y = matrix[1] * x + matrix[3] * y + matrix[5]
  return out
}

export function applyMatrix3x2ToDirection<T extends Vector2Like>(matrix: number[], direction: Vector2Like, out?: T): T {
  out ??= tempPoint as T
  const x = direction.x
  const y = direction.y
  out.x = matrix[0] * x + matrix[2] * y
  out.y = matrix[1] * x + matrix[3] * y
  return out
}
