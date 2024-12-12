'use client'


import { ThreeInstance, ThreeProvider } from '../utils/three-webgpu-provider'
import { Main } from './main'

export function Client() {
  return (
    <div className='layer bg-[#3d313d]'>
      <ThreeProvider vertigoControls={{ size: 2 }}>
        <ThreeInstance value={Main} />
      </ThreeProvider>
    </div>
  )
}
