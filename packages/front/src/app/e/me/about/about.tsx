
import { Info } from 'lucide-react'
import { ThreeProvider } from 'some-utils-misc/three-provider'

import { DevHideNextJs } from '../atoms/dev-hide-nextjs'
import { Logo } from '../components/logo'
import { AboutLayoutProvider } from './about-layout'
import { AboutScene } from './about-scene'

import './about.css'

function Header() {
  return (
    <div className='relative flex p-4'>
      <Logo
        colors={{
          diamondTop: '#FAF392',
          diamondSides: '#ECDE0D',
          diamondBottom: '#B6AD1B',
          text: '#ECDE0D',
        }}
      />
    </div>
  )
}

function EnsureLoadFont() {
  return (
    <div style={{ position: 'fixed', fontFamily: 'Lithops', visibility: 'hidden' }}>
      Loading Font
    </div>
  )
}

export function AboutPage() {
  return (
    <div className='layer p-4 bg-[#eee]'>
      <div className='relative w-full h-full bg-[#220793] rounded-[12px] overflow-hidden'>
        <AboutLayoutProvider>
          <ThreeProvider
            vertigoControls={{
              size: 1.4,
            }}
          >
            <div className='layer thru flex flex-col'>
              <Header />
              <div className='mx-4 h-[2px] bg-[blue] rounded-[1px]' />
              <div className='flex-1 flex flex-row'>
                <div className='flex-1'>
                  <div className='w-full h-full p-4 flex flex-col justify-end items-start'>
                    <Info />
                  </div>
                </div>
                <div className='my-4 w-[2px] bg-[blue] rounded-[1px]' />
                <div className='flex-1' />
              </div>
            </div>
            <EnsureLoadFont />
            <DevHideNextJs />
            <AboutScene />
          </ThreeProvider>
        </AboutLayoutProvider>
      </div>
    </div>
  )
}