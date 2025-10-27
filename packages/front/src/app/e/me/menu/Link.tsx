'use client'

export function Link({ word = '' }) {
  return (
    <button
      className='cursor-pointer hover:text-[#f30]'
      onClick={() => alert(`Coming soon. Work in progress (27/10/25).`)}
    >
      {word}
    </button>
  )
}
