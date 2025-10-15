import '@fontsource/barlow/400.css'
import '@fontsource/barlow/500.css'
import './josephm.css'

import { FpsMeter } from 'some-utils-misc/fps-meter'
import { ThreeProvider } from 'some-utils-misc/three-provider'
import { mapWithSeparator } from 'some-utils-ts/iteration/map-with-separator'

import { RDiv } from './atoms/rdiv'
import { Spacer } from './atoms/spacer'
import { MyScene } from './my-scene'
import { ResponsiveProvider } from './responsive'

function Diamond() {
  return (
    <svg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <defs>
        <mask id="circleMask">
          <rect width="32" height="32" fill="black" />
          <circle cx="16" cy="16" r="16" fill="white" />
        </mask>
      </defs>

      <g mask="url(#circleMask)">
        <path d="M16 16L0 0H0L32 0Z" fill="#6060FF" />
        <path d="M16 16L32 0V32L32 32Z" fill="#3D3DE9" />
        <path d="M16 16L0 0V32L0 32Z" fill="#3D3DE9" />
        <path d="M16 16L32 32H0L32 0Z" fill="#2500AD" />
      </g>
    </svg>
  )
}

export function Header() {
  const Separator = () => <div className='px-6' >{'|'}</div>
  const Link = ({ word = '' }) => (
    <div className='cursor-pointer hover:text-[#f30]'>
      {word}
    </div>
  )
  return (
    <div className='flex row items-center thru'>
      <Diamond />
      <Spacer size='10px' />
      <div>
        Joseph M.
      </div>
      <Spacer expand />
      <div className='screen-size-desktop flex row items-center'>
        {mapWithSeparator(['shapes', 'shaders', 'motion', 'interaction'],
          word => <Link key={word} word={word} />,
          ({ index }) => <Separator key={index} />
        )}
      </div>
      <div className='screen-size-mobile'>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5h16" /><path d="M4 12h16" /><path d="M4 19h16" /></svg>
      </div>
    </div>
  )
}

export function JosephM() {
  return (
    <ThreeProvider
      vertigoControls={{
        fixed: true,
        size: 10,
        eventTarget: 'canvas',
      }}
    >
      <ResponsiveProvider>
        <RDiv
          className='ClientPage layer thru flex flex-col p-8 text-[#2500AD]'
          mobile={{ className: 'p-4' }}
        >
          <Header />
          <div className='flex-1 pointer-events-none' />
          <FpsMeter className='text-[#3333] text-xs' />
        </RDiv>

        <MyScene />
      </ResponsiveProvider>
    </ThreeProvider>
  )
}
