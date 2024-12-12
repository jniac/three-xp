'use client'

import { useEffect, useState } from 'react'

/**
 * How prevent Next.js from loading on the server side the 'three/webgpu' module 
 * (which is not supported in Node.js at the time of writing)?
 * 
 * By using dynamic imports and relying on the client-side rendering.
 */
export function SafeClient() {
  const [Client, setClient] = useState<any>(null)
  useEffect(() => {
    import('./client').then(({ Client }) => {
      setClient(Client)
    })
  }, [])
  return Client
    ? (
      <Client />
    )
    : (
      <div className='layer'>
        loading...
      </div >
    )
}
