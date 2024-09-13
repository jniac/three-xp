'use client'

import { HTMLAttributes, useState } from 'react'

import { handleKeyboard } from 'some-utils-dom/handle/keyboard'
import { handleSize } from 'some-utils-dom/handle/size'
import { useLayoutEffects } from 'some-utils-react/hooks/effects'

import styles from './billboard.module.css'

const billboardStyles = [
  styles.frame,
  styles.full,
]

export function Billboard(props: HTMLAttributes<HTMLDivElement>) {
  const [index, setIndex] = useState(0)

  const { ref } = useLayoutEffects<HTMLDivElement>(function* (div) {
    yield handleSize(div, {
      onSize: info => {
        const { x, y } = info.size
        const landscape = x > y
        div.classList.toggle(styles.landscape, landscape)
      },
    })

    let userHaveSwitchedStyle = false
    yield handleKeyboard(document.documentElement, [
      [{ key: 'f', noModifiers: true }, info => {
        info.event.preventDefault()
        if (document.fullscreenElement !== div) {
          div.requestFullscreen()
          userHaveSwitchedStyle = false
        } else {
          if (userHaveSwitchedStyle === false) {
            userHaveSwitchedStyle = true
            setIndex(1)
          } else {
            document.exitFullscreen()
            setIndex(0)
          }
        }
      }],
    ])
  }, [])

  const { children, className } = props
  return (
    <div
      ref={ref}
      className={[
        styles.Billboard,
        styles.landscape,
        billboardStyles[index],
        className ?? '',
      ].join(' ')}
    >
      {children}
    </div>
  )
}
