'use client'

import { main } from './main'
import { ThreeProvider, useThree } from './three-provider'

import Link from 'next/link'
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
        <div className='layer thru p-4'>
          <Link href='text-helper/hunger'>Knut Hamsun — Hunger — Demo</Link>
        </div>
      </ThreeProvider>
    </div>
  )
}
