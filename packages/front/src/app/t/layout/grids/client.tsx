'use client'

import { handleAnyUserInteraction } from 'some-utils-dom/handle/any-user-interaction'
import { useEffects } from 'some-utils-react/hooks/effects'
import { Ticker } from 'some-utils-ts/ticker'

import { BasicLayoutDemo } from './demo/d0-basic-layout'
import { BasicMarginDemo } from './demo/d1-basic-margin'
import { MarginCollapseDemo } from './demo/d2-margin-collapse'
import { AspectAlignDemo } from './demo/d3-aspect-align'
import { PositioningDemo } from './demo/d4-positioning'

import s from './client.module.css'

export function Client() {
  const { ref } = useEffects<HTMLDivElement>(function* (div) {
    // Ugly hack because of a weird CSS layout bug.
    const [spacingDiv, ...otherDivs] = div.children as unknown as HTMLDivElement[]
    spacingDiv.style.flex = `0 0 ${(otherDivs.length - 1) * 800}px`

    const ticker = Ticker.get('layout').set({ minActiveDuration: 4 })
    yield handleAnyUserInteraction(ticker.requestActivation)
  }, [])

  return (
    <div ref={ref} className={`${s.Client} page overflow-scroll`}>
      <div />
      <BasicLayoutDemo />
      <BasicMarginDemo />
      <MarginCollapseDemo />
      <AspectAlignDemo />
      <PositioningDemo />
    </div>
  )
}