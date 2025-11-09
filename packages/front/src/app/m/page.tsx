
import { Metadata } from 'next'

import { SummaryPage } from '@/components/summary'

import * as contextTest from './context-test/page'

const pages = {
  'context-test': contextTest,
}

export const metadata: Metadata = {
  title: 'Miscellaneous',
}

export default function ExperimentsPage() {
  return (
    <SummaryPage
      className='ExperimentsPage'
      path='m'
      metadata={metadata}
      pages={pages}
    />
  )
}
