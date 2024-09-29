'use client'

import { ThreeProvider, useThree } from 'some-three-editor/editor-provider'

import { art } from './art'

function Art() {
  useThree(art)
  return null
}

export function Main() {
  return (
    <div className='absolute-through'>
      <ThreeProvider>
        <Art />
      </ThreeProvider>
    </div>
  )
}