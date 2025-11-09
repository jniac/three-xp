'use client'

import { useEffects } from 'some-utils-react/hooks/effects'

import { handlePointer } from 'some-utils-dom/handle/pointer'
import { handleSize } from 'some-utils-dom/handle/size'
import { Animation } from 'some-utils-ts/animation'
import { inverseLerp, lerp } from 'some-utils-ts/math/basic'
import { Rectangle } from 'some-utils-ts/math/geom/rectangle'
import { ObservableNumber } from 'some-utils-ts/observables'

import { AboutMain } from '../about/about'
import { SimplePath } from './path-builder'

class Mobile {
  /**
   * Calculates the lerp ratio for exponential decay [(cf some-utils-ts)](https://github.com/jniac/some-utils-ts/blob/main/src/math/misc/exponential-decay.ts#L30-L33).
   * 
   * The returned value can be used to lerp between two values, where the first 
   * value is the current value and the second value is the target value.
   * 
   * Usage: 
   * ```
   * // Loosing 33% of the value after 1 second
   * const lerpRatio = calculateExponentialDecayLerpRatio(.33, deltaTime)
   * const value = lerp(currentValue, targetValue, lerpRatio)
   * ```
   */
  static calculateExponentialDecayLerpRatio(decay: number, deltaTime: number) {
    const k = -Math.log(decay)
    return 1 - Math.exp(-k * deltaTime)
  }

  static lerp(a: number, b: number, t: number) {
    return a + (b - a) * t
  }

  static defaultProps = {
    /**
     * The minimum value the mobile can reach.
     */
    min: 0,
    /**
     * The maximum value the mobile can reach.
     */
    max: 100,
    /**
     * The threshold (in pixels) under which the mobile won't react to movement.
     */
    staticThreshold: 20,
    /**
     * The ratio at which the mobile follows the pointer.
     * 
     * Value between 0 and 1. Represents the missing part of the value after 1 second.
     * 
     * For example, a value of 0.01 means that after 1 second, 1% of the distance
     */
    followDecayRatio: 0.01,
  }

  props: typeof Mobile.defaultProps

  state = {
    isStatic: true,
    inputPosition: 0,
    position: 0,
    positionOld: 0,
    velocity: 0,
  }

  constructor(userProps: Partial<typeof Mobile.defaultProps> = {}) {
    this.props = { ...Mobile.defaultProps, ...userProps }
  }

  update(deltaTime: number, deltaPosition: number | null) {
    const { min, max, staticThreshold, followDecayRatio } = this.props
    const inputPosition = this.state.inputPosition + (deltaPosition ?? 0)
    let isStatic = this.state.isStatic

    if (isStatic && inputPosition >= staticThreshold || inputPosition <= -staticThreshold)
      isStatic = false

    if (!isStatic) {
      const lerpRatio = Mobile.calculateExponentialDecayLerpRatio(followDecayRatio, deltaTime)
      const position = Mobile.lerp(this.state.position, inputPosition, lerpRatio)
    }

    // State update
    this.state.inputPosition = inputPosition
  }
}

export function Overlay() {
  const { ref } = useEffects<HTMLDivElement>(function* (div) {
    const thumbDiv = div.querySelector<HTMLDivElement>('.thumb')!

    const svg = div.querySelector('svg')!
    const pathBackground = div.querySelector('path#background')!
    const pathThumb = div.querySelector('path#thumb-line')!
    const pathThumbArea = div.querySelector('path#thumb-area')!

    const thumbHoverObs = new ObservableNumber(0)
    const openingObs = new ObservableNumber(0)

    const state = {
      margin: 16,
      size: { width: 0, height: 0 },
    }

    const update = () => {
      state.size.width = div.clientWidth
      state.size.height = div.clientHeight

      const m = state.margin
      const w = div.clientWidth
      const h = div.clientHeight
      const tw = 60 // Thumb width

      const tw2 = tw * (1 + 0.2 * thumbHoverObs.get())
      const th = lerp(m * .75, m, thumbHoverObs.get())
        * inverseLerp(.9, .8, openingObs.get())

      pathBackground.setAttribute('d', SimplePath.instance
        .moveTo(m, m)
        // Thumb
        .lineTo(w / 2 - tw2 / 2 - m, m)
        .lineTo(w / 2 - tw2 / 2, m - th)
        .lineTo(w / 2 + tw2 / 2, m - th)
        .lineTo(w / 2 + tw2 / 2 + m, m)
        // rest of box
        .lineTo(w - m, m)
        .lineTo(w - m, h - m)
        .lineTo(m, h - m)
        .closePath()
        .roundCorner(info => {
          const thumb = info.pointIndex >= 1 && info.pointIndex <= 4
          return {
            radius: m * (thumb ? 3 : 1.5),
            tension: 1.333,
          }
        })
        .getPathData())

      const dy = m * .75 * openingObs.get()
      pathThumb.setAttribute('d', SimplePath.instance
        .moveTo(w / 2 - tw2 / 2 + m * .666, m + dy)
        .lineTo(w / 2 + tw2 / 2 - m * .666, m + dy)
        .getPathData())

      const r = Rectangle.instance
        .from({ center: [w / 2, m], size: [tw + m * 2, m * 2] })
        .inflate(m)
      pathThumbArea.setAttribute('d', SimplePath.instance
        .clear()
        .rect(r)
        .closePath()
        .getPathData())

      thumbDiv.style.left = `${r.left}px`
      thumbDiv.style.top = `${r.top}px`
      thumbDiv.style.width = `${r.width}px`
      thumbDiv.style.height = `${r.height}px`

      svg.setAttribute('viewBox', `0 0 ${w} ${h}`)
      svg.setAttribute('width', `${w}`)
      svg.setAttribute('height', `${h}`)

      div.style.transform = `translateY(${(h - 2 * m) * (1 - openingObs.get())}px)`
    }

    update()

    yield thumbHoverObs.onChange(update)
    yield openingObs.onChange(update)
    yield handleSize(div, { onSize: update })

    yield handlePointer(thumbDiv, {
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
      onVerticalDrag: info => {
        const h = state.size.height - 2 * state.margin
        const delta = info.delta.y / h
        openingObs.increment(-delta)
      }
    })
  }, [])

  return (
    <div ref={ref} className='absolute inset-0 overflow-visible'>
      <svg>
        <path id='background' fill='#220793' />
        <path id='thumb-line' stroke='#185de9' strokeWidth={4} strokeLinejoin='round' />
        <path id='thumb-area' fill='transparent' style={{ cursor: 'pointer' }} />
      </svg>
      <div className='thumb absolute z-10' />
      <div className='layer p-[16px]' style={{ pointerEvents: 'none' }}>
        <div className='relative w-full h-full rounded-[20px] overflow-hidden'>
          <AboutMain />
        </div>
      </div>
    </div>
  )
}
