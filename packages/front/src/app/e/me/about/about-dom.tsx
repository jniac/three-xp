'use client'

import { Info } from 'lucide-react'

import { useObservableValue } from 'some-utils-react/hooks/observables'
import { Logo } from '../components/logo'
import { useAboutLayout } from './about-layout'

const aboutText = `
Formé à l’ENSAAMA (Olivier de Serres), je poursuis depuis plus de quinze ans un parcours professionnel à la croisée du design, de l’image et des technologies numériques. Flasheur puis Directeur artistique en agence (TBWA, Euro RSCG), Motion Designer, puis Creative Developer, j’ai eu l’occasion d’explorer différentes facettes de la création visuelle, du graphisme au développement d’outils interactifs en passant par le rendu 3D temps réel.`

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

export function AboutDom() {
  const aboutLayout = useAboutLayout()
  const frame = useObservableValue(aboutLayout.changeObs)
  const [left, right] = aboutLayout.bottom.children
  console.log(left.sizeX.value, right.sizeX.value)
  return (
    <div className='layer thru flex flex-col'>
      <Header />
      <div className='mx-4 h-[2px] bg-[#185DE9] rounded-[1px]' />
      <div className='flex-1 flex flex-row'>
        <div style={{ flex: `${left.sizeX.value} 0` }}>
          <div className='w-full h-full p-4 flex flex-col justify-end items-start'>
            <Info />
          </div>
        </div>
        <div className='my-4 w-[2px] bg-[#185DE9] rounded-[1px]' />
        <div style={{ flex: `${right.sizeX.value} 0` }}>
          <div className='w-full h-full px-16 flex flex-col justify-center items-center text-sm text-[#a2c1ff]'>
            <p>
              {aboutText}
            </p>
            <div className='basis-4' />
            <p>
              {aboutText}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
