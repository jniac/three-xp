import React from 'react'

import { ChooseOne } from './choose-one'
import { ThreeProvider } from './three-provider'

export default function WebgpuPage() {
  return (
    <div className='WebgpuPage page'>
      <ThreeProvider>
        <ChooseOne />
      </ThreeProvider>
    </div>
  )
}
