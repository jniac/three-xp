import { SummaryPage } from '@/components/summary'
import { Metadata } from 'next'

import { voxelPages } from './pages'

export const metadata: Metadata = {
  title: 'Threejs Tools',
}

export default function ToolsPage() {
  return (
    <SummaryPage
      className='ToolsPage'
      path='t'
      metadata={metadata}
      pages={voxelPages}
    />
  )
}
