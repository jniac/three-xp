'use client'

import { ThreeProvider } from '@/tools/three-provider'

import { SvgDemo } from './svg-demo'
import { ThreeDemo } from './three-demo'

export function Client() {
  return (
    <div className='absolute-through p-4 flex flex-col gap-4'>
      <div className='absolute-through'>
        <ThreeProvider>
          <ThreeDemo />
        </ThreeProvider>
      </div>
      <h1 className='text-4xl'>Path with loop</h1>
      <SvgDemo />
    </div>
  )
}