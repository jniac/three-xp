
import { Metadata } from 'next'

import { SummaryPage } from '@/components/summary'

import * as css3d from './css-3d/page'
import * as easingGraph from './easing-graph/page'
import * as flexibleLayout from './flexible-layout/page'
import * as shaderXplr from './shader-xplr/page'
import * as template from './template/page'
import * as textHelperHunger from './text-helper/hunger/page'
import * as textHelper from './text-helper/page'
import * as vertigoWidget from './vertigo-widget/page'
import * as vertigo from './vertigo/page'
import * as voxelChunk from './voxel/chunk/page'
import * as voxel from './voxel/page'
import * as voxelWorld from './voxel/world/page'

const pages = {
 'css-3d': css3d,
 'easing-graph': easingGraph,
 'flexible-layout': flexibleLayout,
 'shader-xplr': shaderXplr,
 'template': template,
 'text-helper/hunger': textHelperHunger,
 'text-helper': textHelper,
 'vertigo-widget': vertigoWidget,
 'vertigo': vertigo,
 'voxel/chunk': voxelChunk,
 'voxel': voxel,
 'voxel/world': voxelWorld,
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
