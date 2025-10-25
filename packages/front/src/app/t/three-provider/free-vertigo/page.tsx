import { XpMetadata } from '@/types'
import { PageClient } from './page.client'

export const metadata = new XpMetadata({
  slug: 'three-provider/free-vertigo',
  status: 'done',
})

export default function TextHelperPage() {
  return (
    <PageClient />
  )
}