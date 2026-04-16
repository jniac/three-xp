
import { XpMetadata } from '@/types'
import { PageClient } from './page.client'

export const metadata = new XpMetadata({
  title: 'Voxel World',
  slug: 'voxel/voxel',
  status: 'done',
})

export default function Page() {
  return (
    <div className='page'>
      <PageClient />
    </div>
  )
}