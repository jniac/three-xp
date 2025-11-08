'use client'

import { ArrowRight } from 'lucide-react'
import { HTMLAttributes } from 'react'
import { handlePointer } from 'some-utils-dom/handle/pointer'
import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { useEffects } from 'some-utils-react/hooks/effects'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { setup } from 'some-utils-three/utils/tree'
import { onNextTick, onTick } from 'some-utils-ts/ticker'
import { ToggleMobile } from '../toggle-mobile'
import { WheelLoader } from './wheel/loader'
import { WheelRecorder } from './wheel/recorder'

function MyScene() {
  const three = useThreeWebGL()!
  useGroup('my-scene', function* (group) {
    three.pipeline.basicPasses.fxaa.enabled = false

    setup(new DebugHelper(), group)
      .regularGrid()
  })
  return null
}

function Section({
  children,
  size = '70vh',
  textColor = 'white',
  bgColor = 'red',
  className = '',
}: { size?: string, textColor?: string, bgColor?: string } & HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={`relative flex flex-col rounded-xl p-8 ${className}`}
      style={{ height: size, color: textColor, backgroundColor: bgColor }}
    >
      {children}
    </section>
  )
}

function SectionChip({ borderColor = 'white' }: { borderColor?: string }) {
  return (
    <div
      style={{
        '--size': '1.2rem',
        position: 'absolute',
        top: 'calc((100% - var(--size)) / 2)',
        left: 'calc(var(--size) / -2)',
        width: 'var(--size)',
        height: 'var(--size)',
        backgroundColor: 'currentColor',
        borderRadius: '50%',
        border: `4px solid ${borderColor}`,
      } as React.CSSProperties}>

    </div>
  )
}

function ScrollingContent() {
  const { ref } = useEffects<HTMLDivElement>(function* (div) {
    const parent = div.parentElement!
    const sections = div.querySelectorAll('section')
    const stops = [
      0,
      (parent.scrollHeight - parent.clientHeight) / 2,
      parent.scrollHeight - parent.clientHeight,
    ]
    const mobile = new ToggleMobile({
      positions: stops,
    })

    const svg = mobile.svgRepresentation()
    yield () => svg.remove()
    onNextTick(() => {
      const page = document.querySelector('.ScrollingWrapper')!
      svg.style.position = 'fixed'
      svg.style.top = '0'
      svg.style.left = '0'
      page.appendChild(svg)
    })

    let usingWheel = false
    yield handlePointer(div, {
      onVerticalDrag: info => {
        mobile.dragStart().drag(-info.delta.y)
        usingWheel = false
      },
      onVerticalDragStop: () => {
        mobile.dragStop()
      },

      onWheel: info => {
        usingWheel = true
        mobile.dragAutoStart(info.delta.y, { distanceThreshold: 200 })
      }
    })

    Object.assign(window, { mobile })

    yield onTick('three', tick => {
      if (usingWheel)
        mobile.dragAutoStop({ velocityThreshold: 200 })

      mobile.update(tick.deltaTime)
      parent.scrollTop = mobile.position

      mobile.svgRepresentation({ svg })
    })
  }, [])

  return (
    <div
      ref={ref}
      className='ScrollingContent w-full flex flex-col p-24 gap-8'
    >
      <Section className='gap-4' bgColor='#402b2b'>
        <SectionChip borderColor='#402b2b' />
        <h1 className='text-2xl font-bold'>
          Decay
        </h1>
        <p className='max-w-md'>
          Trying to combine mouse drag & mouse wheel to control a single object
          with multiple stop positions and decay.
        </p>
        <WheelLoader />
      </Section>

      <Section size='10rem' textColor='black' bgColor='#fc0'>
        <SectionChip borderColor='#fc0' />
        <h1 className='text-2xl font-bold'>
          Small section
        </h1>
        <p className='mt-4 max-w-md'>
          Trying to combine mouse drag & mouse wheel to control a single object
          with multiple stop positions and decay.
        </p>
      </Section>

      <Section size='70vh'>
        <SectionChip borderColor='red' />
        <h1 className='text-2xl font-bold'>
          Decay
        </h1>
        <p className='mt-4 max-w-md'>
          Trying to combine mouse drag & mouse wheel to control a single object
          with multiple stop positions and decay.
        </p>
      </Section>
    </div>
  )
}

function WrapperChip({ borderColor = 'white' }: { borderColor?: string }) {
  return (
    <div
      className='flex flex-col items-center justify-center'
      style={{
        '--size': '4rem',
        position: 'fixed',
        top: 'calc((100% - var(--size)) / 2)',
        left: '0',
        width: 'var(--size)',
        height: 'var(--size)',
      } as React.CSSProperties}>
      <ArrowRight size='2rem' />
    </div>
  )
}

export function PageClient() {
  return (
    <ThreeProvider
      vertigoControls={{
        fixed: true,
        size: 32,
        perspective: 0,
      }}
    >
      <div className='fixed top-4 right-4 z-10'>
        <WheelRecorder />
      </div>

      <div className='ScrollingWrapper layer thru'>
        <WrapperChip />
        <ScrollingContent />
      </div>

      <MyScene />
    </ThreeProvider>
  )
}
