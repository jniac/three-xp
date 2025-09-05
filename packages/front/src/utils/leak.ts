'use client'

import * as THREE from 'three'

import * as highOrder from 'some-utils-ts/iteration/high-order'
import { waveform } from 'some-utils-ts/math/waveform'
import * as observables from 'some-utils-ts/observables'
import { PRNG } from 'some-utils-ts/random/prng'

export function leak(leakedProps: Record<string, any>) {
  if (typeof window !== 'undefined') {
    Object.assign(window, {
      ...THREE,
      ...observables,
      ...highOrder,
      ...leakedProps,
      PRNG,
      waveform,
    })
  }
}

/**
 * <Leak /> component is used to leak some global objects to the window object.
 */
export function Leak(leakedProps: Record<string, any>) {
  leak(leakedProps)
  return null
}
