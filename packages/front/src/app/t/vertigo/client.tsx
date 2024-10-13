'use client'

import yaml from 'js-yaml'
import { useMemo } from 'react'
import { PerspectiveCamera, Vector2, Vector3, WebGLRenderer } from 'three'

import { handleAnyUserInteraction } from 'some-utils-dom/handle/anyUserInteraction'
import { handlePointer } from 'some-utils-dom/handle/pointer'
import { handleSize } from 'some-utils-dom/handle/size'
import { useEffects } from 'some-utils-react/hooks/effects'
import { Vertigo } from 'some-utils-three/camera/vertigo'
import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { Animation } from 'some-utils-ts/animation'
import { onTick, Ticker } from 'some-utils-ts/ticker'

import { VertigoScene } from './VertigoScene'
import { VertigoWidgetPart } from './VertigoWidget'
import { VertigoWidgetPlane } from './VertigoWidgetPlane'

import { formatNumber } from 'some-utils-ts/string/number'

import s from './vertigo.module.css'

function VertigSerializedView({ vertigo }: { vertigo: Vertigo }) {
  const { ref } = useEffects<HTMLDivElement>(function* (div) {
    yield onTick('three', { timeInterval: 1 / 6 }, () => {
      div.querySelector('pre')!.textContent =
        yaml.dump(vertigo.toDeclaration(), { flowLevel: 1 })
          .replace(/-?\d+\.\d+/g, m => formatNumber(Number.parseFloat(m), { maxDigits: 6 }))
    })
  }, [])
  return (
    <div
      ref={ref}
      className={`self-start p-4 border border-white rounded text-xs ${s.BgBlur}`}
      style={{ minWidth: '24rem' }}
    >
      <pre></pre>
    </div>
  )
}

export function Client() {
  const core = useMemo(() => ({
    vertigoControls: new VertigoControls(),
  }), [])

  const { ref } = useEffects<HTMLDivElement>(function* (div) {
    const { vertigoControls } = core

    console.log(formatNumber(123456789))

    const renderer = new WebGLRenderer({ antialias: true })
    renderer.outputColorSpace = 'srgb'
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

    yield vertigoControls.initialize(renderer.domElement)

    const scene = new VertigoScene()

    const ticker = Ticker.get('three')
    handleAnyUserInteraction(ticker.requestActivation)

    const plane = new VertigoWidgetPlane()
    scene.add(plane)
    yield* plane.initialize(renderer, vertigoControls)

    const ndcPointer = new Vector2()
    let pointerDown = false
    yield ticker.onTick(tick => {
      tick.propagate(scene)

      scene.parts.widget.widgetUpdate(ndcPointer, pointerDown, camera)
      if (scene.parts.widget.getHovered() !== null) {
        document.body.style.cursor = 'pointer'
      } else {
        document.body.style.removeProperty('cursor')
      }
      vertigoControls.update(camera, aspect)

      renderer.render(scene, camera)
    })

    yield handlePointer(renderer.domElement, {
      onChange: info => {
        const { x, y } = info.relativeLocalPosition
        ndcPointer.set(x * 2 - 1, 1 - y * 2)
      },
      onDown: () => {
        pointerDown = true
      },
      onUp: () => {
        pointerDown = false
      },
      onTap: () => {
        switch (scene.parts.widget.getPressed()) {
          case VertigoWidgetPart.BOX: {
            vertigoControls.actions.togglePerspective()
            break
          }
          case VertigoWidgetPart.POSITIVE_X: {
            vertigoControls.actions.positiveXAlign()
            break
          }
          case VertigoWidgetPart.NEGATIVE_X: {
            vertigoControls.actions.negativeXAlign()
            break
          }
          case VertigoWidgetPart.POSITIVE_Y: {
            vertigoControls.actions.positiveYAlign()
            break
          }
          case VertigoWidgetPart.NEGATIVE_Y: {
            vertigoControls.actions.negativeYAlign()
            break
          }
          case VertigoWidgetPart.POSITIVE_Z: {
            vertigoControls.actions.positiveZAlign()
            break
          }
          case VertigoWidgetPart.NEGATIVE_Z: {
            vertigoControls.actions.negativeZAlign()
            break
          }
        }
      },
    })

    yield () => {
      renderer.dispose()
      div.removeChild(renderer.domElement)
    }
  }, [])

  const { vertigoControls } = core
  return (
    <div ref={ref} className={`${s.VertigoWidgetClient} layer thru`}>
      <div className='layer thru p-4 flex flex-col gap-4'>
        <h1 className='self-start'>Vertigo-widget</h1>

        <div className='thru flex flex-col items-start gap-1'>
          <button
            className={`${s.BgBlur} px-2 py-1 border border-white rounded hover:bg-[#fff2]`}
            onClick={() => {
              Animation.tween({
                target: vertigoControls.vertigo,
                duration: 1,
                ease: 'inOut2',
                to: { perspective: 0 },
              })
            }}>
            ortho
          </button>

          <button
            className={`${s.BgBlur} px-2 py-1 border border-white rounded hover:bg-[#fff2]`}
            onClick={() => {
              Animation.tween({
                target: vertigoControls.vertigo,
                duration: 1,
                ease: 'inOut2',
                to: { perspective: 1 },
              })
            }}>
            pers:1
          </button>

          <button
            className={`${s.BgBlur} px-2 py-1 border border-white rounded hover:bg-[#fff2]`}
            onClick={() => {
              Animation.tween({
                target: vertigoControls.vertigo,
                duration: 1,
                ease: 'inOut2',
                to: { perspective: 1.5 },
              })
            }}>
            pers:1.5
          </button>

          <button
            className={`${s.BgBlur} px-2 py-1 border border-white rounded hover:bg-[#fff2]`}
            onClick={() => {
              Animation.tween({
                target: vertigoControls.vertigo,
                duration: 1,
                ease: 'inOut2',
                to: { zoom: 1 },
              })
            }}>
            zoom:1
          </button>

          <button
            className={`${s.BgBlur} px-2 py-1 border border-white rounded hover:bg-[#fff2]`}
            onClick={() => {
              Animation.tween({
                target: vertigoControls.vertigo,
                duration: .75,
                ease: 'inOut2',
                to: { focus: new Vector3() },
              })
            }}>
            focus:(0,0,0)
          </button>
        </div>

        <div className='Space flex-1 pointer-events-none' />

        <VertigSerializedView
          vertigo={vertigoControls.vertigo} />
      </div>
    </div>
  )
}
