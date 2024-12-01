'use client'

import { ThreeProvider, useThree } from '../three-provider'
import { main } from './main'

export function Setup() {
  useThree(main, [])
  return null
}

export function Client() {
  return (
    <div className={`layer thru`}>
      <ThreeProvider>
        <div className='layer thru p-4'>
          <h1 className='text-3xl font-bold'>
            Knut Hamsum - Hunger Demo
          </h1>
          <p>
            63,862 words
            &nbsp;
            (<span id='instance-count'>X</span>&nbsp;instances)
          </p>
        </div>
        <Setup />
      </ThreeProvider>
    </div>
  )
}
