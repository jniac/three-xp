'use client'

import * as THREE from 'three'

import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import * as highOrder from 'some-utils-ts/iteration/high-order'
import { waveform } from 'some-utils-ts/math/waveform'
import { Message } from 'some-utils-ts/message'
import * as observables from 'some-utils-ts/observables'
import { PRNG } from 'some-utils-ts/random/prng'
import { dedent } from 'some-utils-ts/string/dedent'
import { Ticker } from 'some-utils-ts/ticker'

export function leak(leakedProps?: Record<string, any>) {
  const controls = Message.requireInstance(VertigoControls)
  if (typeof window !== 'undefined') {
    Object.assign(window, {
      ...THREE,
      ...observables,
      ...highOrder,
      ...leakedProps,
      PRNG,
      waveform,
      dedent,
      Ticker,
      controls,
    })
  }
}

/**
 * <Leak /> component is used to leak some global objects to the window object.
 */
export function Leak(leakedProps?: Record<string, any>) {
  leak(leakedProps)
  return null
}
