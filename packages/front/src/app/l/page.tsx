
import { Metadata } from 'next'

import { SummaryPage } from '@/components/summary'

import * as depthOffset from './depth-offset/page'
import * as occludedLines from './occluded-lines/page'
import * as translateScale from './translate+scale/page'
import * as webgpuOld from './webgpu-old/page'
import * as webgpu from './webgpu/page'

const pages = {
 'depth-offset': depthOffset,
 'occluded-lines': occludedLines,
 'translate+scale': translateScale,
 'webgpu-old': webgpuOld,
 'webgpu': webgpu,
}

export const metadata: Metadata = {
  title: 'Three.js learnings',
}

export default function ExperimentsPage() {
  return (
    <SummaryPage
      className='ExperimentsPage'
      path='l'
      metadata={metadata}
      pages={pages}
    />
  )
}
