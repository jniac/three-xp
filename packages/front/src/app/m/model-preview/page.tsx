import { XpMetadata } from '@/types'

import { PageClient } from './page.client'

export const metadata = new XpMetadata({
  slug: 'preview',
})

export default function Page() {
  return (
    <PageClient />
  )
}
