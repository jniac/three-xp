'use client'

import * as observables from 'some-utils-ts/observables'

function cheat() {
  if (typeof window !== 'undefined') {
    Object.assign(window, {
      ...observables,
    })
  }
}

export function Cheat() {
  cheat()
  return null
}
