import { Curve, Vector3 } from 'three'

const defaultParams = {
  /**
   * Total "linear" length of the curve.
   */
  length: 5,

  /**
   * Amplitude of the sine wave.
   */
  amplitude: .1,

  /**
   * Number of period for the given length.
   */
  period: 5,

  /**
   * Should 
   */
  offset: 0,

  /**
   * Controls whether or not the curve should compensate the "y" movement by a 
   * "z" offset (on cosine phase).
   * 
   * - If `null` the value auto fallbacks to 10% of the amplitude parameter.
   */
  zCosineAmplitude: <number | null>null,
}

export class SinCurve extends Curve<Vector3> {
  params: typeof defaultParams

  constructor(userParams: Partial<typeof defaultParams> = {}) {
    super()
    this.params = { ...defaultParams, ...userParams }
  }

  override getPoint(t: number, optionalTarget?: Vector3): Vector3 {
    const {
      length: l,
      amplitude: a,
      period: p,
      offset: o,
      zCosineAmplitude: za,
    } = this.params

    const PI2 = Math.PI * 2

    const tx = t * l + o
    const ty = a * Math.sin((p * t + o) * PI2)
    const tz = (za ?? a * .1) * Math.cos((p * t + o) * PI2)

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
