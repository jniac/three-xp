'use client'

import { useMemo } from 'react'
import { PerspectiveCamera, WebGLRenderer } from 'three'

import { handleAnyUserInteraction } from 'some-utils-dom/handle/anyUserInteraction'
import { handleSize } from 'some-utils-dom/handle/size'
import { useEffects } from 'some-utils-react/hooks/effects'
import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { Animation } from 'some-utils-ts/animation'
import { Ticker } from 'some-utils-ts/ticker'

import { VertigoScene } from './VertigoScene'

import s from './vertigo.module.css'

export function Client() {
  const core = useMemo(() => ({
    toOrthographic: () => { },
    toPerspective: () => { },
  }), [])

  const { ref } = useEffects<HTMLDivElement>(function* (div) {
    const renderer = new WebGLRenderer({ antialias: true })
    div.prepend(renderer.domElement)
    let aspect = 1

    yield handleSize(div, {
      onSize: () => {
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setSize(div.clientWidth, div.clientHeight)
        aspect = div.clientWidth / div.clientHeight
      },
    })

    const camera = new PerspectiveCamera(75, 1, .1, 1000)
    camera.position.z = 5

    const vertigoControls = new VertigoControls({
      perspective: 0,
      zoom: 1,
    })

    yield vertigoControls.initialize(renderer.domElement)

    const scene = new VertigoScene()

    const ticker = Ticker.get('three')
    handleAnyUserInteraction(ticker.requestActivation)

    yield ticker.onTick(tick => {
      tick.propagate(scene)

      vertigoControls.update(camera, aspect)

      renderer.render(scene, camera)
    })

    core.toOrthographic = () => {
      Animation.tween({
        target: vertigoControls.vertigo,
        duration: 1,
        ease: 'inOut2',
        to: { perspective: 0 },
      })
    }

    core.toPerspective = () => {
      Animation.tween({
        target: vertigoControls.vertigo,
        duration: 1,
        ease: 'inOut2',
        to: { perspective: 1 },
      })
    }

    yield () => {
      renderer.dispose()
      div.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div ref={ref} className={`${s.VertigoWidgetClient} layer thru p-4`}>
      <div className='layer thru p-4'>
        <h1>Vertigo-widget</h1>

        <div className='flex flex-row gap-1'>
          <button
            className='px-2 py-1 border border-white rounded'
            onClick={() => core.toOrthographic()}>
            ortho
          </button>

          <button
            className='px-2 py-1 border border-white rounded'
            onClick={() => core.toPerspective()}>
            pers
          </button>
        </div>
      </div>
    </div>
  )
}
