import { SummaryPage } from '@/components/summary'
import { Metadata } from 'next'

import * as chunk from './chunk/page'

export const voxelPages = {
  chunk,
}

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
