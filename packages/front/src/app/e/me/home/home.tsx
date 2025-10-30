import '@fontsource/barlow/400.css'
import '@fontsource/barlow/500.css'
import './home.css'

import { FpsMeter } from 'some-utils-misc/fps-meter'
import { ThreeProvider } from 'some-utils-misc/three-provider'

import { RDiv } from '../atoms/rdiv'
import { Spacer } from '../atoms/spacer'
import { Logo } from '../components/logo'
import { VERSION } from '../config'
import { Menu } from '../menu/menu'
import { ResponsiveProvider } from '../responsive'
import { HomeScene } from './home.scene'
import { Overlay } from './overlay'

export function Header() {
  return (
    <div className='flex row items-center thru'>
      <Logo />
      <Spacer expand />
      <Menu />
    </div>
  )
}

export function Home() {
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
          className='ClientPage layer thru flex flex-col p-8 text-[#2500AD] select-none'
          mobile={{ className: 'p-4' }}
        >
          <Header />
          <div className='flex-1 pointer-events-none' />
          <div className='flex row gap-2 pb-2 text-[#3333] text-xs'>
            <span>
              {VERSION}
            </span>
            <span> — </span>
            <FpsMeter />
          </div>
          <Overlay />
        </RDiv>

        <HomeScene />
      </ResponsiveProvider>
    </ThreeProvider>
  )
}
