'use client'

import * as observables from 'some-utils-ts/observables'
import { PRNG } from 'some-utils-ts/random/prng'

function cheat() {
  if (typeof window !== 'undefined') {
    Object.assign(window, {
      ...observables,
      PRNG,
    })
  }
}

export function Cheat() {
  cheat()
  return null
}
