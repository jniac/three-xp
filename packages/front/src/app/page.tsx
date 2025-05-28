import Link from 'next/link'

export default function Home() {
  return (
    <div className='w-screen h-screen flex flex-col justify-center items-center'>
      <Link href='e'>
        /e<span style={{ opacity: .33 }}>xperiments</span>
      </Link>
      <Link href='l'>
        /l<span style={{ opacity: .33 }}>earning</span>
      </Link>
      <Link href='t'>
        /t<span style={{ opacity: .33 }}>ools</span>
      </Link>

      <footer className='fixed w-screen bottom-0 p-4 flex flex-row justify-end'>
        <div>
          <Link
            className='text-[#e08ac6] hover:text-[#4d9fce]'
            href='https://github.com/jniac/three-xp'>
            Github
          </Link>
        </div>
      </footer>
    </div>
  )
}
