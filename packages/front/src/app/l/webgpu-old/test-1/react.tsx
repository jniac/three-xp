'use client'

import { useThree } from '@/tools/three/webgpu'

import { createGrid } from './create'

export function Test1() {
  useThree(createGrid)
  return (
    <div>
      <h1 className='uppercase'>
        test-1
      </h1>
    </div>
  )
}