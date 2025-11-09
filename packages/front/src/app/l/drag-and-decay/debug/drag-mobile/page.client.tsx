'use client'

import { TickerWidget } from '@/app/t/ticker/basic/ticker-widget'
import { useEffects } from 'some-utils-react/hooks/effects'
import { DragMobile } from 'some-utils-ts/math/misc/drag.mobile'

import { onTick } from 'some-utils-ts/ticker'

export function PageClient() {
  const { ref } = useEffects<HTMLDivElement>(function* (div) {
    const dragMobile = new DragMobile().set({
      drag: 0.99999,
      position: 241.2037501114879,
      velocity: 2498.8246366542717,
    })

    const positionSpan = div.querySelector<HTMLSpanElement>('#drag-mobile-position')!

    yield onTick(tick => {
      dragMobile.update(tick.deltaTime)
      positionSpan.textContent = dragMobile.position.toFixed(6)
    })
  }, [])

  return (
    <div ref={ref} className='page flex flex-col gap-8 p-16'>
      <h1>
        Drag Mobile Debug Page
      </h1>
      <TickerWidget />
      <div>
        DragMobile.position: <span id="drag-mobile-position">0</span>
      </div>
    </div>
  )
}