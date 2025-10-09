import { XpMetadata } from '@/types'

import { ClientPage } from './page.client'

export const metadata = new XpMetadata({
  slug: 'depth-play',
  status: 'done',
})

export default function FractalGridPage() {
  return (
    <ClientPage />
  )
}
