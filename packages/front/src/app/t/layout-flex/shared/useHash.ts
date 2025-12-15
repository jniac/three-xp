import { useEffect, useState } from 'react'

export function useHash(initialHash = '') {
  const [hash, setStateHash] = useState(initialHash)

  useEffect(() => {
    setStateHash(window.location.hash)
  }, [])

  function setHash(newHash: string | null) {
    if (typeof window !== 'undefined') {
      console.log('setHash', { newHash })
      window.location.hash = newHash ?? ''
      window.history.replaceState(null, '', newHash ?? '')
    }
    setStateHash(newHash ?? '')
  }
  return [hash, setHash] as const
}
