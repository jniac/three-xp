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

const settings = {
  pathStrokeWidth: 8,
}

function Content() {
  const Red = () => (
    <Section bgColor={colors.oldRed} textColor={colors.darkPurple} className='justify-center items-center'>
      <h1 className='font-mono font-bold text-6xl'>
        {colors.oldRed}
      </h1>
    </Section>
  )
  const Blue = () => (
    <Section size='12rem' bgColor={colors.blue} textColor={colors.beige} className='justify-center items-center'>
      <h1 className='font-mono font-bold text-6xl'>
        {colors.blue}
      </h1>
    </Section>
  )
  const DarkPurple = () => <Section size='4rem' bgColor={colors.darkPurple} textColor={colors.beige} />
  const Purple = () => <Section size='200vh' bgColor='mediumpurple' textColor='black' />
  return (
    <div className='Content w-full flex flex-col py-16 gap-8'>
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
    const progressSpans = [...div.querySelectorAll('h1 span:last-child')] as HTMLSpanElement[]
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

      const progress = mobile.position / (mobile.props.stops.at(-1) ?? 1)
      const progressPercent = (progress * 100).toFixed(1)
      for (const span of progressSpans) {
        span.textContent = `${progressPercent}%`
      }
    })
  }, [])
  return (
    <div ref={ref} className='w-full h-full p-2 pl-0'>
      <div
        className='w-full h-full rounded-lg p-8 flex flex-col gap-4'
        style={{ backgroundColor: colors.greyGreen }}
      >
        <h1
          className='text-4xl font-bold flex flex-row justify-between'
          style={{ color: colors.blue }}
        >
          <span>Wheel</span>
          <span>0%</span>
        </h1>

        <div className='flex-1'>
          <svg
            className='rounded-lg overflow-hidden'
            style={{ borderColor: colors.blue, borderWidth: `${settings.pathStrokeWidth}px`, borderStyle: 'solid' }}
          >
            <line x1='0' y1='50%' x2='100%' y2='50%' stroke={colors.blue} strokeWidth={settings.pathStrokeWidth} />
            <polygon id='mobile-fill' fill={colors.darkPurple} />
            <polyline id='mobile-line' stroke={colors.blue} strokeWidth={settings.pathStrokeWidth} fill='none' />
          </svg>
        </div>

        <h1
          className='text-4xl font-bold flex flex-row justify-between'
          style={{ color: colors.blue, transform: `rotate(180deg)` }}
        >
          <span>Wheel</span>
          <span>0%</span>
        </h1>
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

      const svg = div.querySelector('#mobile-svg') as SVGSVGElement
      mobile.svgRepresentation({
        svg,
        height: svg.parentElement!.clientHeight,
        width: 0,
        color: colors.oldRed,
        margin: 32,
        headRadius: 12,
        stopRadius: settings.pathStrokeWidth / 2,
        headStrokeWidth: settings.pathStrokeWidth,
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
        <div style={{ flex: `0 0 ${settings.pathStrokeWidth}px`, backgroundColor: colors.blue }} />
        <div className='flex-1' />
      </div>
      <div className='layer flex flex-row gap-16'>
        <div style={{ flex: `0 0 ${64 + 8}px`, padding: '8px', paddingRight: '0' }}>
          <div className='w-full h-full rounded-lg' style={{ backgroundColor: colors.blue }}>
            <svg id='mobile-svg' width={0} height={0} />
          </div>
        </div>
        <div style={{ flex: 1 }}>
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