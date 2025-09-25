
import { Metadata } from 'next'

import { SummaryPage } from '@/components/summary'

import * as aoTransparent from './ao-transparent/page'
import * as art1 from './art-1/page'
import * as art2 from './art-2/page'
import * as dotsAndFalloffs from './dots-and-falloffs/page'
import * as fourCircles from './four-circles/page'
import * as fractalGrid from './fractal-grid/page'
import * as fromEarthTo from './from-earth-to/page'
import * as ladyEthereal from './lady-ethereal/page'
import * as layoutGrids from './layout/grids/page'
import * as ovvoLayers from './ovvo/layers/page'
import * as pathWithLoop from './path-with-loop/page'
import * as scatteredPlane from './scattered-plane/page'
import * as twoEnvDemo from './two-env-demo/page'

const pages = {
 'ao-transparent': aoTransparent,
 'art-1': art1,
 'art-2': art2,
 'dots-and-falloffs': dotsAndFalloffs,
 'four-circles': fourCircles,
 'fractal-grid': fractalGrid,
 'from-earth-to': fromEarthTo,
 'lady-ethereal': ladyEthereal,
 'layout/grids': layoutGrids,
 'ovvo/layers': ovvoLayers,
 'path-with-loop': pathWithLoop,
 'scattered-plane': scatteredPlane,
 'two-env-demo': twoEnvDemo,
}

export const metadata: Metadata = {
  title: 'Three.js experiments',
}

export default function ExperimentsPage() {
  return (
    <SummaryPage
      className='ExperimentsPage'
      path='e'
      metadata={metadata}
      pages={pages}
    />
  )
}
