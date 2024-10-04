
import { XpMetadata } from '@/types'
import { ServerProof } from './server-proof'

export const metadata = new XpMetadata({
  slug: 'webgpu',
  description: `
    # WebGPU first steps
  `,
})

export default function WebgpuPage() {
  return (
    <div className='WebgpuPage page'>
      <ServerProof />
    </div>
  )
}
