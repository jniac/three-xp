import { XpMetadata } from '@/types'
import { PageClient } from './page.client'

export const metadata = new XpMetadata({
  slug: 'gpu-compute/game-of-life',
  status: 'done',
})

export default function Page() {
  return (
    <PageClient />
  )
}