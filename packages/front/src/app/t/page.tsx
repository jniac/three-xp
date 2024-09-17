import { SummaryPage } from '@/components/summary'
import { Metadata } from 'next'

import * as shaderXplr from './shader-xplr/page'

export const metadata: Metadata = {
  title: 'Threejs Tools',
}

export default function ToolsPage() {
  return (
    <SummaryPage
      className='ToolsPage'
      metadata={metadata}
      pages={{
        shaderXplr,
      }}
    />
  )
}