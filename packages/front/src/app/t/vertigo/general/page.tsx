import { XpMetadata } from '@/types'
import { PageClient } from './page.client'

export const metadata = new XpMetadata({
  slug: 'vertigo',
  status: 'done',
})

export default function Page() {
  return (
    <div className='VertigoWidgetPage page'>
      <PageClient />
    </div>
  )
}