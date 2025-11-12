'use client'

import { useEffects } from 'some-utils-react/hooks/effects'
import { onTick, Ticker } from 'some-utils-ts/ticker'

import { handleAnyUserInteraction } from 'some-utils-dom/handle/any-user-interaction'
import { handleKeyboard } from 'some-utils-dom/handle/keyboard'
import { handlePointer } from 'some-utils-dom/handle/pointer'
import { Message } from 'some-utils-ts/message'
import { Float32Variable } from 'some-utils-ts/misc/variables'
import { Section } from './components'
import { ScrollMobile } from './scroll-mobile'
import { computeStops } from './utils'

import '@fontsource/ibm-plex-mono'
import '@fontsource/ibm-plex-mono/700.css'
import { useTriggerRender } from 'some-utils-react/hooks/render'

const colors = {
  oldRed: '#cf324c',
  beige: '#fafad1',
  yellowButton: '#fffc85',
  greyGreen: '#53776d',
  darkPurple: '#3d1b7a',
  lightBlue: '#7ad0ff',
  blue: '#001eff',
}

function Content() {
  const Red = () => (
    <Section bgColor={colors.oldRed} textColor={colors.darkPurple} className='justify-center items-center'>
      <h1 className='font-mono font-bold text-8xl'>
        {colors.oldRed}
      </h1>
    </Section>
  )
  const Blue = () => (
    <Section size='12rem' bgColor={colors.blue} textColor={colors.beige} className='justify-center items-center'>
      <h1 className='font-mono font-bold text-8xl'>
        {colors.blue}
      </h1>
    </Section>
  )
  const DarkPurple = () => <Section size='4rem' bgColor={colors.darkPurple} textColor={colors.beige} />
  const Purple = () => <Section size='200vh' bgColor='mediumpurple' textColor='black' />
  return (
    <div className='Content w-full flex flex-col p-16 gap-8'>
      <Red />
      <DarkPurple />
      <Blue />
      <Red />
      <Red />
      {/* <Purple /> */}
      <DarkPurple />
      <DarkPurple />
      <DarkPurple />
      <Blue />
      <Red />
      <DarkPurple />
      <Blue />
      <Red />
      <Blue />
      <Red />
    </div>
  )
}

function WheelGraph() {
  const { ref } = useEffects<HTMLDivElement>(function* (div) {
    const svg = div.querySelector('svg') as SVGSVGElement
    const mobileFill = div.querySelector('#mobile-fill') as SVGPolygonElement
    const mobileLine = div.querySelector('#mobile-line') as SVGPolylineElement
    const mobileVar = new Float32Variable({ historySize: 100 })
    yield onTick(tick => {
      const mobile = Message.send<ScrollMobile>(ScrollMobile).assertPayload()
      const width = svg.parentElement!.clientWidth
      const height = svg.parentElement!.clientHeight
      svg.setAttribute('width', `${width}`)
      svg.setAttribute('height', `${height}`)

      mobileVar.push(mobile.position)

      const margin = 200
      const min = -margin
      const max = mobile.props.stops.at(-1)! + margin

      const points = mobileVar.gaussianSmoothSamples(100, { sampleHistoryWidth: .3 }).map((v, i, arr) => {
        const x = ((i / (arr.length - 1)) * width).toFixed(2)
        const y = (height - ((v - min) / (max - min)) * height).toFixed(2)
        return `${x},${y}`
      })
      const polygonPoints = [
        ...points,
        `${width}, ${height}`,
        `0, ${height}`,
      ]
      mobileLine.setAttribute('points', points.join(' '))
      mobileFill.setAttribute('points', polygonPoints.join(' '))
    })
  }, [])
  return (
    <div ref={ref} className='w-full h-full p-2 pl-0'>
      <div
        className='w-full h-full rounded-lg p-8 flex flex-col gap-4'
        style={{ backgroundColor: colors.greyGreen }}
      >
        <h1
          className='text-4xl font-bold'
          style={{ color: colors.blue }}
        >
          Wheel
        </h1>

        <div className='flex-1'>
          <svg
            className='rounded-lg overflow-hidden'
            style={{ borderColor: colors.blue, borderWidth: '1px', borderStyle: 'solid' }}
          >
            <line x1='0' y1='50%' x2='100%' y2='50%' stroke={colors.blue} />
            <polygon id='mobile-fill' fill={colors.darkPurple} />
            <polyline id='mobile-line' stroke={colors.blue} strokeWidth={12} fill='none' />
          </svg>
        </div>
      </div>
    </div>
  )
}

export function PageClient() {
  const render = useTriggerRender()

  const { ref } = useEffects<HTMLDivElement>(function* (div) {
    const stops = computeStops(div.querySelector('.Content') as HTMLDivElement)

    const mobile = new ScrollMobile({ stops })

    Object.assign(window, { mobile, stops })

    yield handlePointer(div, {
      onVerticalDragStart: info => {
        mobile.startDrag()
      },
      onVerticalDrag: info => {
        mobile.drag(-info.delta.y)
      },
      onVerticalDragStop: info => {
        mobile.stopDrag()
      },

      onWheel: info => {
        mobile.autoDrag(info.delta.y * .5)
      }
    })

    yield handleAnyUserInteraction(() => Ticker.current().requestActivation())
    yield onTick(tick => {
      document.querySelector<HTMLElement>('nextjs-portal')
        ?.style.setProperty('display', 'none')

      mobile.update(tick.deltaTime)

      const content = div.querySelector('.Content ') as HTMLDivElement
      content.style.transform = `translateY(${-mobile.position}px)`

      const svg = div.querySelector('.ScrollMobileSvg svg') as SVGSVGElement
      mobile.svgRepresentation({
        svg,
        height: window.innerHeight,
        color: colors.blue,
        margin: 32,
        headRadius: 12,
      })
    })

    yield handleKeyboard([
      ['ArrowUp', () => {
        mobile.goToPreviousStop({ loop: true })
      }],
      ['ArrowDown', () => {
        mobile.goToNextStop({ loop: true })
      }],
      [{ code: 'KeyF', modifiers: 'shift' }, () => {
        document.fullscreenElement ? document.exitFullscreen() : div.requestFullscreen()
      }]
    ])

    yield Message.on(ScrollMobile, m => m.setPayload(mobile))

    document.body.addEventListener('resize', render)
    yield () => {
      document.body.removeEventListener('resize', render)
    }

  }, [])

  return (
    <div
      ref={ref}
      className='page bg-[#fafad1]'
      style={{
        fontFamily: `'IBM Plex Mono', monospace`,
      }}
    >
      <div className='layer flex flex-col'>
        <div className='flex-1' />
        <div className='basis-[1px]' style={{ backgroundColor: colors.blue }} />
        <div className='flex-1' />
      </div>
      <div className='layer flex flex-row'>
        <div style={{ flex: 2 }}>
          <Content />
        </div>
        <div style={{ flex: 1 }}>
          <WheelGraph />
        </div>
      </div>
      <div className='ScrollMobileSvg fixed top-0 left-0'>
        <svg />
      </div>
    </div>
  )
}