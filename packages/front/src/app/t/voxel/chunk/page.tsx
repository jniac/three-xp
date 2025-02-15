
import { XpMetadata } from '@/types'
import { Client } from './client'

export const metadata = new XpMetadata({
  title: 'Voxel Chunk',
  slug: 'voxel/chunk',
  status: 'done',
})

export default function VertigoWidgetPage() {
  return (
    <div className='VertigoWidgetPage page'>
      <Client />
    </div>
  )
}