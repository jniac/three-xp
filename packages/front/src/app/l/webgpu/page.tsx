import { SummaryPage } from '@/components/summary'

import { XpMetadata } from '@/types'

import { pages } from './pages'

export const metadata = new XpMetadata({
  title: 'Threejs Learning WebGPU',
  slug: 'webgpu',
})

export default function ToolsPage() {
  return (
    <SummaryPage
      className='ToolsPage'
      path='../l/webgpu'
      metadata={metadata}
      pages={pages}
    />
  )
}
