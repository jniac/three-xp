'use client'

import { main } from './main'
import { ThreeProvider, useThree } from './three-provider'

import s from './client.module.css'

export function Setup() {
  useThree(main, [])
  return null
}

export function Client() {
  return (
    <div className={`layer thru ${s.Client}`}>
      <ThreeProvider>
        <Setup />
      </ThreeProvider>
    </div>
  )
}
