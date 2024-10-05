import { Metadata } from 'next'

import { SummaryPage } from '@/components/summary'
import * as depthOffset from './depth-offset/page'
import * as webgpu from './webgpu/page'

const learning = {
  depthOffset,
  webgpu,
}

export const metadata: Metadata = {
  title: 'Three.js learning',
}
export default function LPage() {
  return (
    <SummaryPage
      className='LPage'
      metadata={metadata}
      pages={learning}
    />
  )
}
