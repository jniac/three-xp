
import { Metadata } from 'next'

import { SummaryPage } from '@/components/summary'

import * as depthOffset from './depth-offset/page'
import * as dragAndDecayClean from './drag-and-decay/clean/page'
import * as dragAndDecayDebugDragMobile from './drag-and-decay/debug/drag-mobile/page'
import * as dragAndDecayScroll from './drag-and-decay/scroll/page'
import * as dragAndDecayToggle from './drag-and-decay/toggle/page'
import * as occludedLines from './occluded-lines/page'
import * as transformWithShear0Intro from './transform-with-shear/0-intro/page'
import * as transformWithShear1Shear from './transform-with-shear/1-shear/page'
import * as transformWithShear2Decompose from './transform-with-shear/2-decompose/page'
import * as transformWithShear3TransformWithShear from './transform-with-shear/3-transform-with-shear/page'
import * as translateScale from './translate+scale/page'
import * as webgpuOld from './webgpu-old/page'
import * as webgpu from './webgpu/page'

const pages = {
  'depth-offset': depthOffset,
  'drag-and-decay/clean': dragAndDecayClean,
  'drag-and-decay/debug/drag-mobile': dragAndDecayDebugDragMobile,
  'drag-and-decay/scroll': dragAndDecayScroll,
  'drag-and-decay/toggle': dragAndDecayToggle,
  'occluded-lines': occludedLines,
  'transform-with-shear/0-intro': transformWithShear0Intro,
  'transform-with-shear/1-shear': transformWithShear1Shear,
  'transform-with-shear/2-decompose': transformWithShear2Decompose,
  'transform-with-shear/3-transform-with-shear': transformWithShear3TransformWithShear,
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
