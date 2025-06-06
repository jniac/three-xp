import { SummaryPage } from '@/components/summary'
import { XpMetadata } from '@/types'

import { voxelPages } from './pages'

export const metadata = new XpMetadata({
  slug: 't/vertigo',
  title: 'Vertigo Tool',
  status: 'done',
})

export default function Page() {
  return (
    <SummaryPage
      className='ToolsPage'
      path='vertigo'
      metadata={metadata}
      pages={voxelPages}
    />
  )
}
