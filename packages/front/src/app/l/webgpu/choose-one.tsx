'use client'

import { useState } from 'react'

import { Test1 } from './test-1/react'
import { Test2 } from './test-2/react'

const test = {
  Test1,
  Test2,
}

export function ChooseOne() {
  const options = Object.values(test)
  const [index, setIndex] = useState(0)
  const Test = options[index]
  return (
    <div className='wraps p-8 flex flex-col gap-2'>
      <select
        className='self-start border rounded-lg p-1 pr-3'
        onChange={event => setIndex(Number.parseInt(event.target.value))}
      >
        {options.map((Test, index) => (
          <option key={index} value={index}>{Test.name}</option>
        ))}
      </select>
      <Test />
    </div>
  )
}
