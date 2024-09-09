'use client'

import { handlePointer } from 'some-utils-dom/handle/pointer'
import { handleSize } from 'some-utils-dom/handle/size'
import { useEffects, useLayoutEffects } from 'some-utils-react/hooks/effects'
import { lerp, sin01 } from 'some-utils-ts/math/basic'
import { Message } from 'some-utils-ts/message'
import { Observable, ObservableNumber } from 'some-utils-ts/observables'
import { Ticker } from 'some-utils-ts/ticker'

import { Billboard } from '@/components/billboard'

import { ArtGl, GlArtParts } from './art-gl'
import { ArtSvg, LineShape, SvgArtParts } from './art-svg'
import { colors } from './colors'

import styles from './style.module.css'

enum ArtMode {
  Static = 0,
  Rotating = 1,
  RotatingCloseUp = 2,
}

const ArtModeCount = 3

function useArtMode() {
  useEffects(function* () {
    const message = Message.send('REQUIRE:ART_PARTS')
    const artParts = message.payload as (GlArtParts & SvgArtParts)
    const {
      camera,
      knotWrapper,
      knot,
      lineShapeObs,
    } = artParts

    Object.assign(window, { artParts })

    const artModeObs = new Observable<ArtMode>(ArtMode.Static)

    yield handlePointer(document.documentElement, {
      onDown: info => {
        artModeObs.set((artModeObs.get() + 1) % ArtModeCount)
      },
    })

    artModeObs.onChange(value => {
      lineShapeObs.set(lineShapeObs.get() === LineShape.Circle ? LineShape.Rectangle : LineShape.Circle)
      switch (value) {
        case ArtMode.Static: {
          knot.geometry = artParts.knotGeometry1
          break
        }
        case ArtMode.Rotating: {
          const turn = Math.random() * Math.PI * 2 * .2
          knot.geometry = artParts.knotGeometry2
          knot.rotation.x += turn
          knot.rotation.y += turn
          knot.rotation.z += turn
          break
        }
        case ArtMode.RotatingCloseUp: {
          knot.geometry = artParts.knotGeometry2
          break
        }
      }
    })

    yield Ticker.current().onTick(tick => {
      switch (artModeObs.value) {
        case ArtMode.Static: {
          knot.rotation.x = 0
          knot.rotation.y = 0
          knot.rotation.z += .033 * tick.deltaTime
          const t = sin01(tick.time * .05)
          const s = lerp(.9, 1.1, t)
          knotWrapper.scale.set(s, s, 1)
          camera.position.z = lerp(4.9, 4.7, t)
          break
        }
        case ArtMode.Rotating: {
          knot.rotation.x += .05 * tick.deltaTime
          knot.rotation.y += .05 * tick.deltaTime
          knot.rotation.z += .0166 * tick.deltaTime
          knotWrapper.scale.set(1.4, 1.4, 1)
          camera.position.z = 4.5
          break
        }
        case ArtMode.RotatingCloseUp: {
          knot.rotation.x += -.05 * tick.deltaTime
          knot.rotation.y += -.05 * tick.deltaTime
          knot.rotation.z += .05 * tick.deltaTime
          knotWrapper.scale.set(1.8, 1.8, 2)
          camera.position.z = -1
          break
        }
      }
    })
  }, [])
}

export function Art() {
  useArtMode()
  return (
    <div className={styles.Art}>
      <ArtGl />
      <ArtSvg />
    </div>
  )
}

function Caption() {
  const { ref } = useLayoutEffects<HTMLDivElement>(function* (div) {
    yield handleSize(document.documentElement, {
      onSize: ({ size: { x, y } }) => {
        const landscape = x > y
        if (landscape === false) {
          div.style.display = 'none'
        } else {
          div.style.display = ''
        }
      },
    })

    const timeObs = new ObservableNumber(0)
    yield Ticker.current().onTick(tick => {
      timeObs.increment(tick.deltaTime)
      div.classList.toggle(styles.hidden, timeObs.get() > 1)
    })

    yield handlePointer(document.documentElement, {
      onDown: () => {
        timeObs.set(0)
      },
      onChange: () => {
        timeObs.set(0)
      },
    })
  }, [])

  return (
    <div ref={ref} className={`${styles.Caption} pointer-through`}>
      <div
        className='flex flex-row items-center'
      >
        {/* <span>
          <span style={{ color: colors[4] }}>Click </span>
          to switch between art modes.
        </span> */}
        <span>Press <kbd style={{ color: colors[3] }}>F</kbd> to toggle fullscreen.</span>
        <span className={styles.Github} style={{ color: colors[2] }}>
          <a href="https://github.com/jniac/three-xp">Github</a>
        </span>
        <span
          className={styles.Close}
          style={{ color: colors[4] }}
          onPointerDown={event => {
            const target = event.target as HTMLElement
            if (target.tagName !== 'A') {
              event.preventDefault()
              event.stopPropagation()
              ref.current.style.display = 'none'
            }
          }}
        />
      </div>
    </div>
  )
}

export function Artboard() {
  return (
    <div>
      <Billboard>
        <Art />
      </Billboard>
      <div className='wraps'>
        <Caption />
      </div>
    </div>
  )
}
