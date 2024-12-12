'use client'

import { ThreeInstance, ThreeProvider } from '../utils/three-webgpu-provider'
import { Main } from './main'

export function Client() {
  return (
    <div className='layer bg-[#1b161b]'>
      <ThreeProvider vertigoControls={{ size: 4 }}>
        <ThreeInstance value={Main} />
      </ThreeProvider>
    </div>
  )
}
