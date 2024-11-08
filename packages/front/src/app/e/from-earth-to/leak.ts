'use client'

import { useThree } from 'some-three-editor/editor-provider'
import { Ticker } from 'some-utils-ts/ticker'

export function Leak() {
  useThree(function* (three) {
    Object.assign(window, {
      three,
      Ticker,
    })
  }, [])
  return null
}
