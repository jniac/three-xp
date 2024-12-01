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
        <div className='layer thru flex flex-col p-4 gap-4'>
          <h1 className='text-2xl'>Text Helper</h1>
          <p className='w-[400px]'>
            TextHelper is a utility for rendering text in 3D space. A lot of text, up to millions of characters, can be rendered with a single draw call. It is useful for visualizing large amounts of text data.
          </p>
          <Link href='text-helper/hunger'>👉 Knut Hamsun — Hunger — Demo</Link>
        </div>
      </ThreeProvider>
    </div>
  )
}
