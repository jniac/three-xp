'use client'

import { ArrowRight } from 'lucide-react'
import { HTMLAttributes, useState } from 'react'
import { handleKeyboard } from 'some-utils-dom/handle/keyboard'
import { handlePointer } from 'some-utils-dom/handle/pointer'
import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { useEffects } from 'some-utils-react/hooks/effects'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { setup } from 'some-utils-three/utils/tree'
import { Message } from 'some-utils-ts/message'
import { onNextTick, onTick } from 'some-utils-ts/ticker'
import { ToggleMobile } from '../toggle-mobile'
import { WheelGraph } from './wheel/graph'
import { WheelRecorderWidget } from './wheel/recorder'

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

function computeMobilePositionsFromLayout(div: HTMLDivElement): number[] {
  const parent = div.parentElement!
  const sections = [...div.querySelectorAll('section')]
  const mobilePositions = sections.map(section => 0)

  // Middle positions: div are centered in the viewport
  for (let i = 1, max = sections.length - 1; i < max; i++) {
    const section = sections[i]
    const p = section.offsetTop - (parent.clientHeight - section.clientHeight) / 2
    mobilePositions[i] = p
  }

  // Last position: bottom of last section at bottom of viewport
  mobilePositions[sections.length - 1] = parent.scrollHeight - parent.clientHeight

  return mobilePositions
}

function ScrollingContent() {
  const [mobilePositions, setMobilePositions] = useState<number[] | null>(null)

  const { ref } = useEffects<HTMLDivElement>(function* (div) {
    const parent = div.parentElement!

    const mobilePositions = computeMobilePositionsFromLayout(div)
    setMobilePositions(mobilePositions)

    const mobile = new ToggleMobile({
      positions: mobilePositions,
    })

    mobile.on('drag-stop', (type, mobile) => {
      console.log(`${mobile.position.toFixed(2)} -> ${mobile.state.naturalDestination.toFixed(2)} (v: ${mobile.state.velocity.toFixed(2)})`)
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
    let wheelDelta = 0
    let wheelCumulativeDelta = 0
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
        wheelDelta += info.delta.y
        mobile.dragAutoStart(info.delta.y, { distanceThreshold: 50 })
      }
    })

    Object.assign(window, { mobile })

    yield onTick('three', tick => {
      if (usingWheel)
        mobile.dragAutoStop({ velocityThreshold: 200 })

      wheelCumulativeDelta += wheelDelta
      Message.send('LIVE_TICK', { payload: { mobile, wheelDelta, wheelCumulativeDelta } })
      wheelDelta = 0 // reset after sending

      mobile.update(tick.deltaTime)
      parent.scrollTop = mobile.position

      mobile.svgRepresentation({ svg })
    })

    yield handleKeyboard([
      ['ArrowUp', () => {
        mobile.gotoPrevious({ loop: true })
      }],
      ['ArrowDown', () => {
        mobile.gotoNext({ loop: true })
      }],
    ])
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
        {mobilePositions && (
          <div className='flex flex-row'>
            {/* <WheelLoader mobilePositions={mobilePositions} /> */}
            <WheelGraph
              url='/assets/misc/wheel-recording-5s-[huge-acceleration].bin'
              mobilePositions={mobilePositions}
            />
            <WheelGraph
              mobilePositions={mobilePositions}
            />
          </div>
        )}
      </Section>

      <Section />

      <Section bgColor='blue' size='1rem' />

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

      <Section size='10rem' textColor='black' bgColor='#fc0'>
        <SectionChip borderColor='#fc0' />
        <h1 className='text-2xl font-bold'>
          Small section
        </h1>
        <p className='mt-4 max-w-md'>
          You cannot always have something interesting to say. <br />Can you?
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

      <Section size='70vh' bgColor='orange'>
        <SectionChip borderColor='orange' />
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
        <WheelRecorderWidget />
      </div>

      <div className='ScrollingWrapper layer thru'>
        <WrapperChip />
        <ScrollingContent />
      </div>

      <MyScene />
    </ThreeProvider>
  )
}
