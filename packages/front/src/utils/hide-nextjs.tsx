'use client'

import { useEffect } from 'react'

export function HideNextjsPortal() {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.querySelector<HTMLElement>('nextjs-portal')?.style.setProperty('display', 'none')
      const id = window.setInterval(() => {
        document.querySelector<HTMLElement>('nextjs-portal')?.style.setProperty('display', 'none')
      }, 500)
      return () => window.clearInterval(id)
    }
  })
  return null
}
