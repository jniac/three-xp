import { XpMetadata } from '@/types'
import { Leak } from '@/utils/leak'

import { Art } from './art'

export const metadata = new XpMetadata({
  slug: 'art-1',
  status: 'done',
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