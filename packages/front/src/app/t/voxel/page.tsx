import { SummaryPage } from '@/components/summary'
import { XpMetadata } from '@/types'

import { voxelPages } from './pages'

export const metadata = new XpMetadata({
  slug: 't/voxel',
  title: 'Voxel Tools',
  status: 'done',
})


export default function ToolsPage() {
  return (
    <SummaryPage
      className='ToolsPage'
      path='voxel'
      metadata={metadata}
      pages={voxelPages}
    />
  )
}
