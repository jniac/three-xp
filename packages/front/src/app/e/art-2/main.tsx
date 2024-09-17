'use client'

import { Billboard } from '@/components/billboard'

import { BasicThreeProvider, UseThree } from '@/tools/three/webgl'

import { art } from './art/art'

export function Main() {
  return (
    <div className='absolute-through'>
      <Billboard className='bg-[#ddd]'>
        <BasicThreeProvider>
          <UseThree fn={art} />
        </BasicThreeProvider>
      </Billboard>
    </div>
  )
}