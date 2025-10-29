'use client'

import { useEffects } from 'some-utils-react/hooks/effects'

import { handlePointer } from 'some-utils-dom/handle/pointer'
import { Animation } from 'some-utils-ts/animation'
import { lerp } from 'some-utils-ts/math/basic'
import { Rectangle } from 'some-utils-ts/math/geom/rectangle'
import { ObservableNumber } from 'some-utils-ts/observables'
import { SimplePath } from './path-builder'

export function Overlay() {
  const { ref } = useEffects<HTMLDivElement>(function* (div) {
    const svg = div.querySelector('svg')!
    const pathBackground = div.querySelector('path#background')!
    const pathThumb = div.querySelector('path#thumb-line')!
    const pathThumbArea = div.querySelector('path#thumb-area')!

    const thumbHoverObs = new ObservableNumber(0)
    const openingObs = new ObservableNumber(0)

    const update = () => {
      const m = 16
      const w = div.clientWidth
      const h = div.clientHeight
      const tw = 60 // Thumb width

      const tw2 = tw * (1 + 0.2 * thumbHoverObs.get())
      const th = lerp(m * .75, m, thumbHoverObs.get())
        * (1 - openingObs.get())

      pathBackground.setAttribute('d', SimplePath.instance
        .moveTo(m, m)
        // Thumb
        .lineTo(w / 2 - tw2 / 2 - m, m)
        .lineTo(w / 2 - tw2 / 2, m - th)
        .lineTo(w / 2 + tw2 / 2, m - th)
        .lineTo(w / 2 + tw2 / 2 + m, m)
        .lineTo(w - m, m)
        .lineTo(w - m, h - m)
        // rest of box
        .lineTo(m, h - m)
        .closePath()
        .roundCorner(info => {
          const thumb = info.index >= 1 && info.index <= 4
          return {
            radius: m * (thumb ? 3 : 1.5),
            tension: 1.333,
          }
        })
        .getPathData())

      const dy = m * .75 * openingObs.get()
      pathThumb.setAttribute('d', SimplePath.instance
        .moveTo(w / 2 - tw2 / 2 + m, m + dy)
        .lineTo(w / 2 + tw2 / 2 - m, m + dy)
        .getPathData())

      const r = Rectangle.instance
        .from({ center: [w / 2, m], size: [tw + m * 2, m * 2] })
        .inflate(m)
      pathThumbArea.setAttribute('d', SimplePath.instance
        .clear()
        .rect(r)
        .closePath()
        .getPathData())

      svg.setAttribute('viewBox', `0 0 ${w} ${h}`)
      svg.setAttribute('width', `${w}`)
      svg.setAttribute('height', `${h}`)

      div.style.transform = `translateY(${(h - 2 * m) * (1 - openingObs.get())}px)`
      // div.style.transform = `translateY(0px)`
    }

    update()

    yield thumbHoverObs.onChange(update)
    yield openingObs.onChange(update)

    yield handlePointer(pathThumbArea, {
      onEnter: () => {
        Animation
          .during(.3)
          .onUpdate(({ progress: t }) => thumbHoverObs.set(Animation.ease('inOut(3, .333)')(t)))
      },
      onLeave: () => {
        Animation
          .during(.3)
          .onUpdate(({ progress: t }) => thumbHoverObs.set(Animation.ease('inOut(3, .333)')(1 - t)))
      },
      onTap: () => {
        Animation
          .tween({
            target: openingObs,
            to: { value: openingObs.get() < .5 ? 1 : 0 },
            ease: 'inOut(3, .333)',
            duration: .5,
          })
      },
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
