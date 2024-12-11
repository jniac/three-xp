import { SummaryPage } from '@/components/summary'

import { XpMetadata } from '@/types'

import * as pages from './pages'

export const metadata = new XpMetadata({
  title: 'Threejs Learning WebGPU',
  slug: 'webgpu',
})

export default function ToolsPage() {
  return (
    <SummaryPage
      className='ToolsPage'
      path='../l'
      metadata={metadata}
      pages={pages}
    />
  )
}
