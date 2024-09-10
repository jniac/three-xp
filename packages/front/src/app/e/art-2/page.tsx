import { ExpMetadata } from '@/types'

import { Art } from './art'

export const metadata: ExpMetadata = {
  title: 'art-2',
  slug: 'art-2',
  description: `
    # Graphic Art 2
  `,
}

export default function Exp1() {
  return (
    <div className='Art2 page'>
      <Art />
    </div>
  )
}