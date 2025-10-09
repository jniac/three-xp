import { XpMetadata } from '@/types'

import { ClientPage } from './page.client'

export const metadata = new XpMetadata({
  slug: 'me',
})

export default function FractalGridPage() {
  return (
    <ClientPage />
  )
}
