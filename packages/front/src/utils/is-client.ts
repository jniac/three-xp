import { useEffect, useState } from 'react'

/**
 * C'mon nextjs. Why "use client" is not enough? Why do I have to write this?
 * 
 * Usage:
 * ```
 * function MyClientComponent(props: Props) { ... }
 * 
 * function MyComponent(props: Props) {
 *   // Skip rendering on server
 *   return useIsClient() && (
 *     <MyClientComponent {...props} />
 *   )
 * }
 * ```
 */
export function useIsClient() {
  // `useState` is used to prevent rendering on server
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}
