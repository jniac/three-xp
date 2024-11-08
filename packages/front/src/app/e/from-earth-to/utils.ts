import { Vector3Like } from 'some-utils-ts/types'
import { Vector3 } from 'three'

/**
 * Binds user data to an object through getters and setters.
 * 
 * Usage: 
 * ```
 * userData = bindUserData(existingUserData, {
 *   spherize: {
 *     bind: [this.uniforms.uSpherize, 'value'],
 *     meta: 'Slider(0, 1)',
 *   },
 * })
 * ```
 */
export function bindUserData(target: object, data: Record<string, { bind: [any, string]; meta?: string }>) {
  for (const [name, prop] of Object.entries(data)) {
    const [bindTarget, bindKey = 'value'] = prop.bind
    Object.defineProperty(target, name, {
      enumerable: true,
      get: () => bindTarget[bindKey],
      set: value => bindTarget[bindKey] = value,
    })
    if (prop.meta) {
      Object.defineProperty(target, `${name}_meta`, {
        enumerable: true,
        get: () => prop.meta,
      })
    }
  }
  return target
}

/**
 * Converts spherical coordinates to cartesian coordinates.
 */
export function fromSpherical<T extends Vector3Like = Vector3>({ theta = 0, phi = 0, radius = 1 } = {}, out?: T) {
  out ??= new Vector3() as unknown as T
  out.x = radius * Math.cos(theta) * Math.cos(phi)
  out.y = radius * Math.sin(theta)
  out.z = radius * Math.cos(theta) * Math.sin(phi)
  return out
}

export function randomPointOnUnitSphere(out = new Vector3()): Vector3 {
  // Generate random values for θ (azimuthal) and φ (polar)
  const theta = Math.random() * 2 * Math.PI  // Azimuthal angle (0 to 2π)
  const phi = Math.acos(2 * Math.random() - 1)  // Polar angle (0 to π)

  // Convert spherical coordinates to Cartesian coordinates
  out.x = Math.sin(phi) * Math.cos(theta)
  out.y = Math.sin(phi) * Math.sin(theta)
  out.z = Math.cos(phi)

  return out
}
