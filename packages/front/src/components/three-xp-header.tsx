import Link from 'next/link'
import { ReactNode } from 'react'

export function ThreeXpHeader(props: { children?: ReactNode }) {
  return (
    <div className='ThreeXpHeader absolute inset-0 flex flex-col'>
      <header className='p-2'>
        <h1 className='text-xs'>
          <Link href='/e'>Three XP</Link>
        </h1>
      </header>
      <div className='relative flex-1'>
        {props.children}
      </div>
    </div>
  )

}