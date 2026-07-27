
import { Metadata } from 'next'

import { SummaryPage } from '@/components/summary'

import * as aoTransparent from './ao-transparent/page'
import * as art1 from './art-1/page'
import * as art2 from './art-2/page'
import * as art3 from './art-3/page'
import * as art3StencilTestDirectTest from './art-3/stencil-test/direct-test/page'
import * as art3StencilTestSimple from './art-3/stencil-test/simple/page'
import * as art4 from './art-4/page'
import * as circlePackingP0 from './circle-packing/p0/page'
import * as circlePackingP1 from './circle-packing/p1/page'
import * as depthPlay from './depth-play/page'
import * as dotsAndFalloffs from './dots-and-falloffs/page'
import * as fibonacciSphere from './fibonacci-sphere/page'
import * as fourCircles from './four-circles/page'
import * as fractalGrid from './fractal-grid/page'
import * as fromEarthTo from './from-earth-to/page'
import * as glass from './glass/page'
import * as ivyLeaves from './ivy-leaves/page'
import * as ladyEthereal from './lady-ethereal/page'
import * as me from './me/page'
import * as meshWalk from './mesh-walk/page'
import * as nineCircles from './nine-circles/page'
import * as ovvoLayers from './ovvo/layers/page'
import * as pathWithLoop from './path-with-loop/page'
import * as pixelatedShadow from './pixelated-shadow/page'
import * as proceduralTree from './procedural-tree/page'
import * as scatteredPlane from './scattered-plane/page'
import * as scroll from './scroll/page'
import * as twoEnvDemo from './two-env-demo/page'
import * as waterXp1 from './water/xp1/page'
import * as waterXp2 from './water/xp2/page'
import * as zigZag from './zig-zag/page'

const pages = {
  'ao-transparent': aoTransparent,
  'art-1': art1,
  'art-2': art2,
  'art-3': art3,
  'art-3/stencil-test/direct-test': art3StencilTestDirectTest,
  'art-3/stencil-test/simple': art3StencilTestSimple,
  'art-4': art4,
  'circle-packing/p0': circlePackingP0,
  'circle-packing/p1': circlePackingP1,
  'depth-play': depthPlay,
  'dots-and-falloffs': dotsAndFalloffs,
  'fibonacci-sphere': fibonacciSphere,
  'four-circles': fourCircles,
  'fractal-grid': fractalGrid,
  'from-earth-to': fromEarthTo,
  'glass': glass,
  'ivy-leaves': ivyLeaves,
  'lady-ethereal': ladyEthereal,
  'me': me,
  'mesh-walk': meshWalk,
  'nine-circles': nineCircles,
  'ovvo/layers': ovvoLayers,
  'path-with-loop': pathWithLoop,
  'pixelated-shadow': pixelatedShadow,
  'procedural-tree': proceduralTree,
  'scattered-plane': scatteredPlane,
  'scroll': scroll,
  'two-env-demo': twoEnvDemo,
  'water/xp1': waterXp1,
  'water/xp2': waterXp2,
  'zig-zag': zigZag,
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
