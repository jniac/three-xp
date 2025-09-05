import { XpMetadata } from '@/types'
import { Client } from './page.client'

export const metadata = new XpMetadata({
  slug: 'matrix-with-shear',
})

export default function MatrixWithShearPage() {
  return (
    <div className='MatrixWithShearPage page'>
      <Client />
    </div>
  )
}
