'use client'

import { useEffect } from 'react'
import * as mathBasic from 'some-utils-ts/math/basic'
import { transition } from 'some-utils-ts/math/easing'
import * as exponentialDecay from 'some-utils-ts/math/misc/exponential-decay'

export function Cheat() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      function threexp() {
        const { pathname, search, hash } = window.location
        let githubUrl = `https://jniac.github.io/three-xp${pathname}`
        if (search) githubUrl += search
        if (hash) githubUrl += hash
        window.location.href = githubUrl
      }
      Object.assign(window, {
        threexp,
        transition,
        ...mathBasic,
        ...exponentialDecay,
      })
    }
  }, [])
  return null
}
