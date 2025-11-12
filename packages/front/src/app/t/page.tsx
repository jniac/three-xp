
import { Metadata } from 'next'

import { SummaryPage } from '@/components/summary'

import * as css3d from './css-3d/page'
import * as easingGraph from './easing-graph/page'
import * as flexibleLayout from './flexible-layout/page'
import * as fuzzyRange from './fuzzy-range/page'
import * as gpuComputeGameOfLife from './gpu-compute/game-of-life/page'
import * as gpuComputePen from './gpu-compute/pen/page'
import * as gpuComputeWater from './gpu-compute/water/page'
import * as hashGrid from './hash-grid/page'
import * as layoutGrids from './layout/grids/page'
import * as noiseDemo from './noise-demo/page'
import * as randomUtils from './random-utils/page'
import * as shaderForgeInstances from './shader-forge/instances/page'
import * as shaderXplr from './shader-xplr/page'
import * as slerpVectors from './slerp-vectors/page'
import * as template2 from './template-2/page'
import * as template from './template/page'
import * as textHelper from './text-helper/page'
import * as threeProviderColor from './three-provider/color/page'
import * as threeProviderFreeVertigo from './three-provider/free-vertigo/page'
import * as threeProviderPointer from './three-provider/pointer/page'
import * as tickerBasic from './ticker/basic/page'
import * as transformWithShear from './transform-with-shear/page'
import * as variableDemo from './variable/demo/page'
import * as vertexBendBasic from './vertex-bend/basic/page'
import * as vertexBendUmbellifer from './vertex-bend/umbellifer/page'
import * as vertigo from './vertigo/page'
import * as voxel from './voxel/page'

const pages = {
  'css-3d': css3d,
  'easing-graph': easingGraph,
  'flexible-layout': flexibleLayout,
  'fuzzy-range': fuzzyRange,
  'gpu-compute/game-of-life': gpuComputeGameOfLife,
  'gpu-compute/pen': gpuComputePen,
  'gpu-compute/water': gpuComputeWater,
  'hash-grid': hashGrid,
  'layout/grids': layoutGrids,
  'noise-demo': noiseDemo,
  'random-utils': randomUtils,
  'shader-forge/instances': shaderForgeInstances,
  'shader-xplr': shaderXplr,
  'slerp-vectors': slerpVectors,
  'template-2': template2,
  'template': template,
  'text-helper': textHelper,
  'three-provider/color': threeProviderColor,
  'three-provider/free-vertigo': threeProviderFreeVertigo,
  'three-provider/pointer': threeProviderPointer,
  'ticker/basic': tickerBasic,
  'transform-with-shear': transformWithShear,
  'variable/demo': variableDemo,
  'vertex-bend/basic': vertexBendBasic,
  'vertex-bend/umbellifer': vertexBendUmbellifer,
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
