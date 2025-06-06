
import { Metadata } from 'next'

import { SummaryPage } from '@/components/summary'

import * as css3d from './css-3d/page'
import * as easingGraph from './easing-graph/page'
import * as flexibleLayout from './flexible-layout/page'
import * as hashGrid from './hash-grid/page'
import * as noiseDemo from './noise-demo/page'
import * as shaderXplr from './shader-xplr/page'
import * as template from './template/page'
import * as textHelper from './text-helper/page'
import * as vertigo from './vertigo/page'
import * as voxel from './voxel/page'

const pages = {
 'css-3d': css3d,
 'easing-graph': easingGraph,
 'flexible-layout': flexibleLayout,
 'hash-grid': hashGrid,
 'noise-demo': noiseDemo,
 'shader-xplr': shaderXplr,
 'template': template,
 'text-helper': textHelper,
 'vertigo': vertigo,
 'voxel': voxel,
}

export const metadata: Metadata = {
  title: 'Threejs Tools',
}

export default function ExperimentsPage() {
  return (
    <SummaryPage
      className='ExperimentsPage'
      path='t'
      metadata={metadata}
      pages={pages}
    />
  )
}
