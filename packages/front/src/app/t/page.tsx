import { Metadata } from 'next'
import Link from 'next/link'

import * as shaderXplr from './shader-xplr/page'

const pages = {
  shaderXplr,
}

export const metadata: Metadata = {
  title: 'Threejs Tools',
}

export default function ExperimentsPage() {
  return (
    <div className='page gap-1'>
      <h1 className='text-4xl'>{String(metadata.title)}</h1>
      {Object.entries(pages).map(([key, value]) => (
        <div key={key}>
          <span>
            <Link href={`t/${value.metadata.slug}`}>
              {value.metadata.title?.toString()}
            </Link>
          </span>
        </div>
      ))}
    </div>
  )
}