
import { Metadata } from 'next'

import { SummaryPage } from '@/components/summary'

import * as depthOffset from './depth-offset/page'
import * as matrixWithShear0Intro from './matrix-with-shear/0-intro/page'
import * as matrixWithShear1Shear from './matrix-with-shear/1-shear/page'
import * as matrixWithShear2Decompose from './matrix-with-shear/2-decompose/page'
import * as matrixWithShear3TransformWithShear from './matrix-with-shear/3-transform-with-shear/page'
import * as occludedLines from './occluded-lines/page'
import * as translateScale from './translate+scale/page'
import * as webgpuOld from './webgpu-old/page'
import * as webgpu from './webgpu/page'

const pages = {
 'depth-offset': depthOffset,
 'matrix-with-shear/0-intro': matrixWithShear0Intro,
 'matrix-with-shear/1-shear': matrixWithShear1Shear,
 'matrix-with-shear/2-decompose': matrixWithShear2Decompose,
 'matrix-with-shear/3-transform-with-shear': matrixWithShear3TransformWithShear,
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
