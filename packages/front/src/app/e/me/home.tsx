import '@fontsource/barlow/400.css'
import '@fontsource/barlow/500.css'
import './home.css'

import { FpsMeter } from 'some-utils-misc/fps-meter'
import { ThreeProvider } from 'some-utils-misc/three-provider'
import { mapWithSeparator } from 'some-utils-ts/iteration/map-with-separator'

import { RDiv } from './atoms/rdiv'
import { Spacer } from './atoms/spacer'
import { Logo } from './components/logo'
import { VERSION } from './config'
import { MyScene } from './my-scene'
import { ResponsiveProvider } from './responsive'

export function Menu() {
  const Separator = () => <div className='px-6' >{'|'}</div>
  const Link = ({ word = '' }) => (
    <div className='cursor-pointer hover:text-[#f30]'>
      {word}
    </div>
  )
  return (
    <div className='flex row items-center thru'>
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

export function Header() {
  return (
    <div className='flex row items-center thru'>
      <Logo />
      <Spacer expand />
      <Menu />
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
          data-info={`Joseph M. — Visual Tech Artist — v${VERSION}`}
          className='ClientPage layer thru flex flex-col p-8 text-[#2500AD]'
          mobile={{ className: 'p-4' }}
        >
          <Header />
          <div className='flex-1 pointer-events-none' />
          <div className='flex row gap-2 text-[#3333] text-xs'>
            <span>
              {VERSION}
            </span>
            <span> — </span>
            <FpsMeter />
          </div>
        </RDiv>

        <MyScene />
      </ResponsiveProvider>
    </ThreeProvider>
  )
}
