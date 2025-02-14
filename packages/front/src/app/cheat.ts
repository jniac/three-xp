'use client'

import { useEffect } from 'react'
import * as mathBasic from 'some-utils-ts/math/basic'
import { transition } from 'some-utils-ts/math/easing'
import * as exponentialDecay from 'some-utils-ts/math/misc/exponential-decay'

export function Cheat() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      Object.assign(window, {
        transition,
        ...mathBasic,
        ...exponentialDecay,
      })
    }
  }, [])
  return null
}
