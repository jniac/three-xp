
import { Metadata } from 'next'

import { SummaryPage } from '@/components/summary'

import * as depthOffset from './depth-offset/page'
import * as occludedLines from './occluded-lines/page'
import * as translateScale from './translate+scale/page'
import * as webgpuOld from './webgpu-old/page'
import * as webgpuComputeGeometry from './webgpu/compute-geometry/page'
import * as webgpuContextTextureUniform from './webgpu/context-texture-uniform/page'
import * as webgpuNurbs from './webgpu/nurbs/page'
import * as webgpu from './webgpu/page'
import * as webgpuTslDemo from './webgpu/tsl-demo/page'

const pages = {
 'depth-offset': depthOffset,
 'occluded-lines': occludedLines,
 'translate+scale': translateScale,
 'webgpu-old': webgpuOld,
 'webgpu/compute-geometry': webgpuComputeGeometry,
 'webgpu/context-texture-uniform': webgpuContextTextureUniform,
 'webgpu/nurbs': webgpuNurbs,
 'webgpu': webgpu,
 'webgpu/tsl-demo': webgpuTslDemo,
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
