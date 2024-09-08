'use client'

import { useState } from 'react'

import { handleKeyboard } from 'some-utils-dom/handle/keyboard'
import { handlePointer } from 'some-utils-dom/handle/pointer'
import { useEffects } from 'some-utils-react/hooks/effects'
import { Message } from 'some-utils-ts/message'
import { Observable } from 'some-utils-ts/observables'
import { Ticker } from 'some-utils-ts/ticker'

import { ArtGl, GlArtParts } from './art-gl'
import { ArtSvg } from './art-svg'

import { lerp, sin01 } from 'some-utils-ts/math/basic'
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
    const artParts = message.payload as GlArtParts
    const {
      camera,
      knotWrapper,
      knot,
    } = artParts

    Object.assign(window, { artParts })

    const artModeObs = new Observable<ArtMode>(ArtMode.Static)

    yield handlePointer(document.documentElement, {
      onDown: () => {
        artModeObs.set((artModeObs.get() + 1) % ArtModeCount)
      },
    })

    artModeObs.onChange(value => {
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
          knot.rotation.x += .1 * tick.deltaTime
          knot.rotation.y += .1 * tick.deltaTime
          knot.rotation.z += .033 * tick.deltaTime
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
    <div className='relative'>
      <ArtGl />
      <ArtSvg />
    </div>
  )
}

export function Artboard() {
  const artStyles = [
    styles.square,
    styles.full,
  ]
  const [index, setIndex] = useState(0)

  const { ref } = useEffects<HTMLDivElement>(function* (div) {
    yield handleKeyboard(document.documentElement, [
      [{ code: /f/i, noModifiers: true }, info => {
        info.event.preventDefault()
        if (document.fullscreenElement === div) {
          document.exitFullscreen()
        } else {
          div.requestFullscreen()
        }
      }],
      [{ code: 'KeyS', noModifiers: true }, info => {
        info.event.preventDefault()
        setIndex(i => (i + 1) % artStyles.length)
      }],
    ])
  }, [])

  return (
    <div
      ref={ref}
      className={[styles.Artboard, artStyles[index]].join(' ')}
    >
      <Art />
    </div>
  )
}
