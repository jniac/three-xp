'use client'

import yaml from 'js-yaml'
import { useMemo } from 'react'
import { Euler, Group, Mesh, PerspectiveCamera, TorusKnotGeometry, Vector2, Vector3, WebGLRenderer } from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

import { handleAnyUserInteraction } from 'some-utils-dom/handle/anyUserInteraction'
import { handlePointer } from 'some-utils-dom/handle/pointer'
import { handleSize } from 'some-utils-dom/handle/size'
import { useEffects } from 'some-utils-react/hooks/effects'
import { Vertigo } from 'some-utils-three/camera/vertigo'
import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { VertigoHelper } from 'some-utils-three/camera/vertigo/helper'
import { EulerDeclaration } from 'some-utils-three/declaration'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { setup } from 'some-utils-three/utils/tree'
import { Animation } from 'some-utils-ts/animation'
import { PRNG } from 'some-utils-ts/random/prng'
import { formatNumber } from 'some-utils-ts/string/number'
import { onTick, Tick, Ticker } from 'some-utils-ts/ticker'

import { VertigoScene } from './VertigoScene'
import { defaultVertigoWidgetMaterialProps, VertigoWidgetPart } from './VertigoWidget'
import { VertigoWidgetPlane } from './VertigoWidgetPlane'

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

class SceneA extends Group {
  parts = {
    knot: setup(
      new Mesh(
        new TorusKnotGeometry(1, .5, 256, 32),
        new AutoLitMaterial()
      ), { parent: this }),
    knot2: setup(
      new Mesh(
        new TorusKnotGeometry(1.37, .05, 256, 32),
        new AutoLitMaterial({ color: defaultVertigoWidgetMaterialProps.xColor })
      ), { parent: this }),
    cubes: Array.from({ length: 20 }, (_, i) => {
      const x = PRNG.between(-3, 3)
      const y = PRNG.between(-1.5, 1.5)
      const z = PRNG.between(-3, 3)
      const rotation = [
        `${PRNG.between(0, 360)}deg`,
        `${PRNG.between(0, 360)}deg`,
        `${PRNG.between(0, 360)}deg`,
      ] as EulerDeclaration
      const scaleScalar = PRNG.between(.5, 1)
      const cube = setup(
        new Mesh(
          new RoundedBoxGeometry(1),
          new AutoLitMaterial({ color: PRNG.pick(Object.values(defaultVertigoWidgetMaterialProps)) })
        ), { parent: this, x, y, z, rotation, scaleScalar })
      cube
      const angularVelocity = new Euler(PRNG.between(-1, 1), PRNG.between(-1, 1), PRNG.between(-1, 1))
      cube.userData = { angularVelocity }
      return cube
    }),
  }

  onTick(tick: Tick) {
    for (const cube of this.parts.cubes) {
      const { angularVelocity } = cube.userData
      cube.rotation.x += angularVelocity.x * tick.deltaTime
      cube.rotation.y += angularVelocity.y * tick.deltaTime
      cube.rotation.z += angularVelocity.z * tick.deltaTime
    }
  }
}

export function Client() {
  const core = useMemo(() => {
    const main = new Vertigo({
      size: [4.2, 4.2],
    })
    const a0 = new Vertigo({
      perspective: 0,
      focus: [-10, 3, 0],
      size: [6, 3],
      rotation: [0, '45deg', 0],
    })
    const a1 = a0.clone().set({
      perspective: 1,
      size: a0.size.clone().multiplyScalar(1.2),
    })
    const a2 = a0.clone().set({
      perspective: 1,
      size: a0.size.clone().multiplyScalar(1.5),
      rotation: [0, '-15deg', '-25deg'],
    })
    const back = new Vertigo({
      perspective: 1,
      focus: [-4.5, 1.8, 10],
      size: [12, 9],
      rotation: ['-3deg', '1deg', '12deg'],
    })
    const back2 = new Vertigo({
      perspective: 1,
      focus: [-4.5, 1.8, 14],
      size: back.size.clone().multiplyScalar(1.5),
      rotation: ['-3deg', '1deg', '0deg'],
    })
    const zoom = new Vertigo({
      focus: [6, -4, 0],
      size: [4, 4],
      zoom: .25,
    })
    const revert = new Vertigo({
      rotation: ['12.6deg', '145.3deg', '0deg'],
      focus: [-5, -.5, 3.6],
      size: [12, 12],
      fov: '60deg',
    })
    const vertigos = {
      main,
      a0,
      a1,
      a2,
      back,
      back2,
      zoom,
      revert
    }
    const vertigoControls = new VertigoControls(vertigos.main)

    return {
      vertigos,
      vertigoControls,
    }
  }, [])

  const { ref } = useEffects<HTMLDivElement>(function* (div) {
    const { vertigoControls } = core

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
        ndcPointer.set(x * 2 - 1, (y * 2 - 1) * -1)
      },
      onDown: () => {
        pointerDown = true
      },
      onUp: () => {
        pointerDown = false
      },
      onTap: () => {
        const pressed = scene.parts.widget.getPressed()
        if (pressed !== null) {
          vertigoControls.actions.focus([0, 0, 0])
        }
        switch (pressed) {
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

    for (const vertigo of Object.values(core.vertigos)) {
      setup(new VertigoHelper(vertigo), scene)
    }

    const someScene = new SceneA()
    scene.add(someScene)
    someScene.position.copy(core.vertigos.a0.focus)
    someScene.rotation.copy(core.vertigos.a0.rotation)

    yield () => {
      renderer.dispose()
      div.removeChild(renderer.domElement)
    }
  }, [])

  const { vertigoControls } = core
  return (
    <div ref={ref} className={`${s.VertigoWidgetClient} layer thru`}>
      <div className='layer thru p-4 flex flex-col gap-4 items-start'>

        <h1 className='text-2xl self-start'>Vertigo-widget</h1>

        <div
          className={`${s.BgBlur} thru flex flex-col gap-1 items-start p-1 border border-white rounded`}
          style={{ width: 'min(200px, 30%)' }}
        >
          <h2>Actions:</h2>
          <div className='thru flex flex-row flex-wrap items-start gap-1'>
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
              }}
            >
              focus:(0,0,0)
            </button>
          </div>
        </div>

        <div
          className={`${s.BgBlur} thru flex flex-col gap-1 items-start p-1 border border-white rounded`}
          style={{ width: 'min(200px, 30%)' }}
        >
          <h2>
            Presets:
          </h2>
          <div className='flex flex-row gap-1 flex-wrap'>
            {Object.entries(core.vertigos).map(([name, vertigo]) => (
              <button
                key={name}
                className={`${s.BgBlur} px-2 py-1 border border-white rounded hover:bg-[#fff2]`}
                onClick={() => {
                  const start = core.vertigoControls.vertigo.clone()
                  Animation
                    .during(1)
                    .onUpdate(({ progress }) => {
                      const alpha = Animation.ease('inOut3')(progress)
                      core.vertigoControls.vertigo.lerpVertigos(start, vertigo, alpha)
                    })
                }}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        <div className='Space flex-1 pointer-events-none' />

        <VertigSerializedView
          vertigo={vertigoControls.vertigo} />
      </div>
    </div>
  )
}
