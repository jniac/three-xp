
import { Metadata } from 'next'

import { SummaryPage } from '@/components/summary'

import * as contextTest from './context-test/page'
import * as debug from './debug/page'
import * as modelPreview from './model-preview/page'

const pages = {
  'context-test': contextTest,
  'debug': debug,
  'model-preview': modelPreview,
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
