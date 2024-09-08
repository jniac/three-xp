'use client'

import { useState } from 'react'

import { handleKeyboard } from 'some-utils-dom/handle/keyboard'
import { useEffects } from 'some-utils-react/hooks/effects'

import { ArtGl } from './art-gl'
import { ArtSvg } from './art-svg'

import styles from './style.module.css'

export function Art() {
  return (
    <div className='relative'>
      <ArtGl />
      <ArtSvg />
    </div>
  )
}

export function Artboard() {
  const artStyles = [
    styles.square,
    styles.full,
  ]
  const [index, setIndex] = useState(0)

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
      [{ code: 'KeyS', noModifiers: true }, info => {
        info.event.preventDefault()
        setIndex(i => (i + 1) % artStyles.length)
      }],
    ])
  }, [])

  return (
    <div
      ref={ref}
      className={[styles.Artboard, artStyles[index]].join(' ')}
    >
      <Art />
    </div>
  )
}
