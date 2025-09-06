import { XpMetadata } from '@/types'
import { Client } from './page.client'

export const metadata = new XpMetadata({
  slug: '3-transform-with-shear',
  status: 'done',
})

export default function MatrixWithShearPage() {
  return (
    <div className='MatrixWithShearPage page'>
      <Client />
    </div>
  )
}
