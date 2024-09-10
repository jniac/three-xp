import Link from 'next/link'

export default function LPage() {
  return (
    <div className='wraps flex flex-col items-center justify-center'>
      <h1>Learning</h1>
      <Link href='l/webgpu'>webgpu</Link>
    </div>
  )
}