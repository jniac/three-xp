'use client'

import { handleKeyboard } from 'some-utils-dom/handle/keyboard'
import { useEffects } from 'some-utils-react/hooks/effects'

import { Art } from './art'

import styles from './style.module.css'

export function Artboard() {
  const { ref } = useEffects<HTMLDivElement>(function* (div) {
    yield handleKeyboard(document.documentElement, [
      [{ code: /f/i, noModifiers: true }, info => {
        info.event.preventDefault()
        if (document.fullscreenElement === div) {
          document.exitFullscreen()
        } else {
          div.requestFullscreen()
        }
      }],
    ])
  }, [])

  return (
    <div
      ref={ref}
      className={styles.Artboard}>
      <Art />
    </div>
  )
}
