import { XpMetadata } from '@/types'
import { PageClient } from './page.client'

export const metadata = new XpMetadata({
  slug: 'three-provider',
})

export default function TextHelperPage() {
  return (
    <PageClient />
  )
}