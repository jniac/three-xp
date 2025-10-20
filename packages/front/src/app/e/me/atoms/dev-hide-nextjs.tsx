'use client'

import { useEffect } from 'react'

export function DevHideNextJs() {
  useEffect(() => {
    const el = document.querySelector('nextjs-portal')
    el?.setAttribute('style', 'display: none !important')
  })
  return null
}
