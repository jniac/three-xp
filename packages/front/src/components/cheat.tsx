'use client'

import * as observables from 'some-utils-ts/observables'

function cheat() {
  Object.assign(window, {
    ...observables,
  })
}

export function Cheat() {
  cheat()
  return null
}
