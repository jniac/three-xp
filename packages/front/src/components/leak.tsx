'use client'

import * as highOrder from 'some-utils-ts/iteration/high-order'
import * as observables from 'some-utils-ts/observables'
import { PRNG } from 'some-utils-ts/random/prng'

function leak() {
  if (typeof window !== 'undefined') {
    Object.assign(window, {
      ...observables,
      ...highOrder,
      PRNG,
    })
  }
}

/**
 * <Leak /> component is used to leak some global objects to the window object.
 */
export function Leak() {
  leak()
  return null
}
