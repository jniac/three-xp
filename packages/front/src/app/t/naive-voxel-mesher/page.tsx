
import { XpMetadata } from '@/types'
import { Main } from './main'

export const metadata = new XpMetadata({
  slug: 'naive-voxel-mesher',
})

export default function VertigoWidgetPage() {
  return (
    <div className='VertigoWidgetPage page'>
      <Main />
    </div>
  )
}