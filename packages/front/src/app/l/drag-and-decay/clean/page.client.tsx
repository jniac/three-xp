'use client'

import { useEffects } from 'some-utils-react/hooks/effects'
import { onTick, Ticker } from 'some-utils-ts/ticker'

import { handleAnyUserInteraction } from 'some-utils-dom/handle/any-user-interaction'
import { handleKeyboard } from 'some-utils-dom/handle/keyboard'
import { handlePointer } from 'some-utils-dom/handle/pointer'
import { Section } from './components'
import { ScrollMobile } from './scroll-mobile'
import { computeStops } from './utils'

function Content() {
  return (
    <div className='Content w-full flex flex-col p-16 gap-8'>
      <Section />
      <Section size='4rem' bgColor='yellow' textColor='black' />
      <Section size='12rem' bgColor='blue' />
      <Section />
      <Section />
      <Section size='4rem' bgColor='yellow' textColor='black' />
      <Section size='4rem' bgColor='yellow' textColor='black' />
      <Section size='4rem' bgColor='yellow' textColor='black' />
      <Section size='12rem' bgColor='blue' />
      <Section />
    </div>
  )
}

export function PageClient() {
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
        mobile.autoDrag(info.delta.y)
      }
    })

    yield handleAnyUserInteraction(() => Ticker.current().requestActivation())
    yield onTick(tick => {
      mobile.update(tick.deltaTime)

      const content = div.querySelector('.Content ') as HTMLDivElement
      content.style.transform = `translateY(${-mobile.position}px)`

      const svg = div.querySelector('.ScrollMobileSvg svg') as SVGSVGElement
      mobile.svgRepresentation({ svg })
    })

    yield handleKeyboard([
      ['ArrowUp', () => {
        mobile.goToPreviousStop({ loop: true })
      }],
      ['ArrowDown', () => {
        mobile.goToNextStop({ loop: true })
      }],
    ])

  }, [])

  return (
    <div ref={ref} className='page'>
      <div className='layer flex flex-col'>
        <div className='flex-1' />
        <div className='basis-[1px] bg-[#fff3]' />
        <div className='flex-1' />
      </div>
      <div className='layer'>
        <Content />
      </div>
      <div className='ScrollMobileSvg fixed top-0 left-0'>
        <svg />
      </div>
    </div>
  )
}