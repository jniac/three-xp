import { Metadata } from 'next'

import { SummaryPage } from '@/components/summary'

import * as depthOffset from './depth-offset/page'
import * as occludedLines from './occluded-lines/page'
import * as webgpu from './webgpu/page'

const learning = {
  depthOffset,
  webgpu,
  occludedLines,
}

export const metadata: Metadata = {
  title: 'Three.js learning',
}

export default function LPage() {
  return (
    <SummaryPage
      path='l'
      className='LPage'
      metadata={metadata}
      pages={learning}
    />
  )
}
