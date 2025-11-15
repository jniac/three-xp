'use client'

import { useEffect } from 'react'

import { handleKeyboard } from 'some-utils-dom/handle/keyboard'

export function FullscreenKeyboardToggle() {
  useEffect(() => {
    const { } = handleKeyboard([
      [{ key: 'f', modifiers: 'shift' }, () => {
        if (document.fullscreenElement) {
          document.exitFullscreen()
        } else {
          document.documentElement.requestFullscreen()
        }
      }]
    ])
  })
  return null
}
