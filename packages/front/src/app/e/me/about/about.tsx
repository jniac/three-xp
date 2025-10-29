
import { ThreeProvider } from 'some-utils-misc/three-provider'

import { DevHideNextJs } from '../atoms/dev-hide-nextjs'
import { AboutDom } from './about-dom'
import { AboutLayoutProvider } from './about-layout'
import { AboutScene } from './about-scene'

import './about.css'

function EnsureLoadFont() {
  return (
    <div style={{ position: 'fixed', fontFamily: 'Lithops', visibility: 'hidden' }}>
      Loading Font
    </div>
  )
}

export function AboutMain() {
  return (
    <AboutLayoutProvider>
      <ThreeProvider
        vertigoControls={{
          fixed: true,
          size: 1.4,
        }}
        fullscreenKey={{ key: 'f', modifiers: 'shift' }}
      >
        <AboutDom />
        <EnsureLoadFont />
        <DevHideNextJs />
        <AboutScene />
      </ThreeProvider>
    </AboutLayoutProvider>
  )
}

export function AboutPage() {
  return (
    <div className='layer p-4 bg-[#eee]'>
      <div className='relative w-full h-full bg-[#220793] rounded-[12px] overflow-hidden'>
        <AboutMain />
      </div>
    </div>
  )
}