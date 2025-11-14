import { Curve, Vector3 } from 'three'

const defaultParams = {
  length: 5,
  amplitude: .1,
  period: 5,
  offset: 0,
}

export class SinCurve extends Curve<Vector3> {
  params: typeof defaultParams

  constructor(userParams: Partial<typeof defaultParams> = {}) {
    super()
    this.params = { ...defaultParams, ...userParams }
  }

  override getPoint(t: number, optionalTarget?: Vector3): Vector3 {
    const { length: l, amplitude: a, period: p, offset: o } = this.params
    const PI2 = Math.PI * 2

    const tx = t * l
    const ty = a * Math.sin((p * t + o) * PI2)
    const tz = 0

    return (optionalTarget ?? new Vector3()).set(tx, ty, tz)
  }

  override getTangent(t: number, optionalTarget?: Vector3): Vector3 {
    const { length: l, amplitude: a, period: p, offset: o } = this.params
    const PI2 = Math.PI * 2

    const tx = l
    const ty = a * p * PI2 * Math.cos((p * t + o) * PI2) // derivative of sin(c . t + d) is c . cos(c . t + d)
    const tz = 0

    return (optionalTarget ?? new Vector3()).set(tx, ty, tz).normalize()
  }
}
