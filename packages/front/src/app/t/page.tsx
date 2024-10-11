import { SummaryPage } from '@/components/summary'
import { Metadata } from 'next'

import * as easingGraph from './easing-graph/page'
import * as shaderXplr from './shader-xplr/page'
import * as vertigo from './vertigo/page'

export const metadata: Metadata = {
  title: 'Threejs Tools',
}

export default function ToolsPage() {
  return (
    <SummaryPage
      className='ToolsPage'
      metadata={metadata}
      pages={{
        shaderXplr,
        easingGraph,
        vertigo,
      }}
    />
  )
}