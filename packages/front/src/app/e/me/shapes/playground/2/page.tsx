import { HideNextjsPortal } from '@/utils/hide-nextjs'

import { meMetadata } from '../../../config'
import { PageClient } from './page.client'

export const metadata = meMetadata

export default function Page() {
  return (
    <>
      <PageClient />
      <HideNextjsPortal />
    </>
  )
}
