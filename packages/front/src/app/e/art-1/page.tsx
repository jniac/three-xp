import { Leak } from '@/components/leak'
import { XpMetadata } from '@/types'

import { Art } from './art'

export const metadata = new XpMetadata({
  title: 'art-1',
  slug: 'art-1',
  description: `
    # Color Dancing (Art Experiment 1)
  `,
})

export default function Exp1() {
  return (
    <div className='page'>
      <Art />
      <Leak />
    </div>
  )
}