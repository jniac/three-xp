import { Metadata } from 'next'
import Link from 'next/link'

import * as depthOffset from './depth-offset/page'
import * as webgpu from './webgpu/page'

const experiments = {
  depthOffset,
  webgpu,
}

export const metadata: Metadata = {
  title: 'Three.js experiments',
}
export default function LPage() {
  return (
    <div className='page'>
      <h1 className='mb-4'>Learning</h1>
      {Object.entries(experiments).map(([key, value]) => (
        <div key={key}>
          <span>
            <Link href={`l/${value.metadata.slug}`} className='hover:underline hover:text-[#e08ac6]'>
              {value.metadata.title?.toString()}
            </Link>
          </span>
        </div>
      ))}
    </div>
  )
}
