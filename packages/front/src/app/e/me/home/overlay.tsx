'use client'

import { useEffects } from 'some-utils-react/hooks/effects'

import { handlePointer } from 'some-utils-dom/handle/pointer'
import { Animation } from 'some-utils-ts/animation'
import { ObservableNumber } from 'some-utils-ts/observables'
import { onClickWIP } from '../wip'
import { SimplePath } from './path-builder'

export function Overlay() {
  const { ref } = useEffects<HTMLDivElement>(function* (div) {
    const svg = div.querySelector('svg')!
    const pathBackground = div.querySelector('path#background')!
    const pathThumb = div.querySelector('path#thumb-line')!
    const pathThumbArea = div.querySelector('path#thumb-area')!

    const hoverObs = new ObservableNumber(0)

    const update = () => {
      const m = 16
      const w = div.clientWidth
      const h = div.clientHeight
      const tw = 80 // Thumb width

      const tw2 = tw * (1 + 0.2 * hoverObs.value)

      pathBackground.setAttribute('d', SimplePath.instance
        .moveTo(m, m)
        // Thumb
        .lineTo(w / 2 - tw2 / 2 - m, m)
        .lineTo(w / 2 - tw2 / 2, 0)
        .lineTo(w / 2 + tw2 / 2, 0)
        .lineTo(w / 2 + tw2 / 2 + m, m)
        .lineTo(w - m, m)
        .lineTo(w - m, h - m)
        // rest of box
        .lineTo(m, h - m)
        .closePath()
        .roundCorner(() => ({ radius: m * 1.5, tension: 1.333 }))
        .getPathData())

      pathThumb.setAttribute('d', SimplePath.instance
        .moveTo(w / 2 - tw2 / 2 + m, m)
        .lineTo(w / 2 + tw2 / 2 - m, m)
        .getPathData())

      pathThumbArea.setAttribute('d', SimplePath.instance
        .moveTo(w / 2 - tw / 2 - m, 0)
        .lineTo(w / 2 + tw / 2 + m, 0)
        .lineTo(w / 2 + tw / 2 + m, m * 2)
        .lineTo(w / 2 - tw / 2 - m, m * 2)
        .closePath()
        .getPathData())

      svg.setAttribute('viewBox', `0 0 ${w} ${h}`)
      svg.setAttribute('width', `${w}`)
      svg.setAttribute('height', `${h}`)

      div.style.transform = `translateY(${h - 2 * m}px)`
    }

    update()

    yield hoverObs.onChange(update)

    yield handlePointer(pathThumbArea, {
      onEnter: () => {
        Animation.during(.3).onUpdate(({ progress: t }) => hoverObs.set(Animation.ease('inOut(3, .333)')(t)))
      },
      onLeave: () => {
        Animation.during(.3).onUpdate(({ progress: t }) => hoverObs.set(Animation.ease('inOut(3, .333)')(1 - t)))
      },
      onTap: onClickWIP,
    })
  }, [])

  return (
    <div ref={ref} className='layer' >
      <svg>
        <path id='background' fill='#220793' />
        <path id='thumb-line' stroke='#6060FF' strokeWidth={4} strokeLinejoin='round' />
        <path id='thumb-area' fill='transparent' style={{ cursor: 'pointer' }} />
      </svg>
    </div>
  )
}
