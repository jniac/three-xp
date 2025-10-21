
import { Info } from 'lucide-react'
import { ThreeProvider } from 'some-utils-misc/three-provider'

import { DevHideNextJs } from '../atoms/dev-hide-nextjs'
import { Logo } from '../components/logo'
import { AboutLayoutProvider } from './about-layout'
import { AboutScene } from './about-scene'

import './about.css'

const aboutText = `
Formé à l’ENSAAMA (BTS Communication Visuelle option multimédia), je poursuis depuis plus de quinze ans un parcours professionnel à la croisée du design, de l’image et des technologies numériques. Flasheur puis Directeur artistique en agence (TBWA, Euro RSCG), Motion Designer, puis Creative Developer, j’ai eu l’occasion d’explorer différentes facettes de la création visuelle, du graphisme au développement d’outils interactifs en passant par le rendu 3D temps réel.`

function Header() {
  const blueColors = {
    diamondTop: '#8BB2FF',
    diamondSides: '#4A86FF',
    diamondBottom: '#185DE9',
    text: '#4A86FF',
  }
  const yellowColors = {
    diamondTop: '#FAF392',
    diamondSides: '#ECDE0D',
    diamondBottom: '#B6AD1B',
    text: '#ECDE0D',
  }
  return (
    <div className='relative flex p-4'>
      <Logo
        colors={blueColors}
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
              // fixed: true,
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
                <div className='flex-1'>
                  <div className='w-full h-full px-16 flex flex-col justify-center items-center text-xs text-[#a2c1ff]'>
                    {aboutText}
                  </div>
                </div>
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