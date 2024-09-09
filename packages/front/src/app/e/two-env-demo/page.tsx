
import { ExpMetadata } from '@/types'

import { Demo } from './demo'

export const metadata: ExpMetadata = {
  title: 'two-env-demo',
  slug: 'two-env-demo',
  description: `
    # Graphic Art 2
  `,
}

export default function Exp1() {
  return (
    <div className='Demo page'>
      <Demo />
    </div>
  )
}