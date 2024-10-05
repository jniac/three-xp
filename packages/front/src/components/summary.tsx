import Link from 'next/link'
import { Metadata } from 'next/types'
import { HTMLAttributes } from 'react'

import { makeClassName } from 'some-utils-react/utils/classname'

import { XpMetadata } from '@/types'

type Props = HTMLAttributes<HTMLDivElement> & {
  metadata: Metadata
  pages: Record<string, { metadata: XpMetadata }>
}

export function SummaryPage(props: Props) {
  const { className, metadata, pages, children } = props
  return (
    <div className={makeClassName(className, 'page gap-1')}>
      <h1 className='text-3xl mb-4'>{String(metadata.title)}</h1>
      {Object.entries(pages).map(([key, value]) => (
        <div key={key}>
          <span>
            <Link href={`t/${value.metadata.slug}`}>
              {value.metadata.title.toString()}
            </Link>
          </span>
        </div>
      ))}
      {children}
    </div>
  )
}
