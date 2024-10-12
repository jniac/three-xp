import { Metadata } from 'next'

import { SummaryPage } from '@/components/summary'

import * as contextTest from './context-test/page'

export const metadata: Metadata = {
  title: 'Miscellaneous',
}

export default function MiscellaneousPage() {
  return (
    <SummaryPage
      className='MiscellaneousPage'
      path='m'
      metadata={metadata}
      pages={{
        contextTest,
      }}
    />
  )
}
