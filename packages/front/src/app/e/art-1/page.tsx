import { Leak } from '@/components/leak'
import { ExpMetadata } from '@/types'

import { Artboard } from './art'

export const metadata: ExpMetadata = {
  title: 'art-1',
  slug: 'art-1',
  description: `
    # Color Dancing (Art Experiment 1)
  `,
}

export default function Exp1() {
  return (
    <div className='page'>
      <Artboard />
      <Leak />
    </div>
  )
}