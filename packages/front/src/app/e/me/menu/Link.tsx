'use client'

import { onClickWIP } from '../wip'

export function Link({ word = '' }) {
  return (
    <button
      className='cursor-pointer hover:text-[#f30]'
      onClick={onClickWIP}
    >
      {word}
    </button>
  )
}


