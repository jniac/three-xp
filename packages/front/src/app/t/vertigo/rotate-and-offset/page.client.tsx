'use client'
import { Group, Mesh, TorusKnotGeometry, Vector3 } from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/Addons.js'

import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { useEffects } from 'some-utils-react/hooks/effects'
import { Vertigo } from 'some-utils-three/camera/vertigo'
import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { VertigoHelper } from 'some-utils-three/camera/vertigo/helper'
import { AxesHelper } from 'some-utils-three/helpers/axes'
import { DashedGridHelper } from 'some-utils-three/helpers/dashed-grid'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { setup } from 'some-utils-three/utils/tree'
import { Message } from 'some-utils-ts/message'
import { onTick } from 'some-utils-ts/ticker'

import { VertigoWidgetPlane } from '../general/VertigoWidgetPlane'

class SceneMesh extends Group {
  parts = (() => {
    const cube4 = new RoundedBoxGeometry(4, 4, 4)
    setup(new Mesh(cube4, new AutoLitMaterial({ color: 'rgb(71, 68, 57)' })), {
      name: 'cube-grey',
      position: [-4, 0, -2],
      parent: this,
    })
    setup(new Mesh(cube4, new AutoLitMaterial({ color: 'rgb(202, 177, 88)' })), {
      name: 'cube-gold',
      position: [0, 0, -4],
      parent: this,
    })
    setup(new Mesh(cube4, new AutoLitMaterial({ color: 'rgb(88, 177, 202)' })), {
      name: 'cube-blue',
      position: [-4, 4, -6],
      parent: this,
    })

    setup(new Mesh(
      new TorusKnotGeometry(1, .4, 512, 128),
      new AutoLitMaterial({ color: 'rgb(177, 88, 202)' }),
    ), {
      name: 'torus-pink',
      position: [3, 0, -9],
      scale: 3,
      parent: this,
    })

    const helper = setup(new DebugHelper({
      texts: {
        textDefaults: { color: 'white', size: .1, offset: [0, .075, 0] },
      }
    }), this)
    const p1 = new Vector3(-2, 2, -4).add(new Vector3(-1, -1, -1).multiplyScalar(.2))
    const p2 = new Vector3(1.3, 0.421, -8.481)
    helper
      .points([p1, p2], { color: 'white', shape: 'plus-thin' })
      .text(p1, 'Hard-To-Reach\nSpot #1')
      .text(p2, 'Hard-To-Reach\nSpot #2')
  })()
}

function ThreeSettings() {
  const three = useThreeWebGL()
  three.pipeline.basicPasses.fxaa.enabled = false
  return null
}

function MyScene() {
  const three = useThreeWebGL()

  useGroup('my-scene', function* (group) {
    setup(new AxesHelper(), group)

    let testVertigoHelper = false
    if (testVertigoHelper) {
      const vertigo = new Vertigo({
        size: 10,
        before: 20,
        after: 20,
      })
      vertigo.update(1)
      setup(new VertigoHelper(vertigo, { color: 'cyan' }), group)
      yield three.ticker.onTick(tick => {
        vertigo.perspective = tick.sin01Time({ frequency: 1 / 5 })
        vertigo.update(1)
      })
    }

    setup(new DebugHelper(), group)
      .regularGrid()

    const showPoints = false
    if (showPoints) {
      const points: [number, number, number][] = [
        [1, 1, -2],
        [-3, 0, 0],
      ]
      setup(new DebugHelper(), group)
        .onTop()
        .points(points, { color: 'cyan' })
        .texts(points, { texts: i => points[i].join(', '), color: 'cyan', size: .5, offset: [0, .2, 0] })
    }

    setup(new SceneMesh(), group)

    const controls = Message.requireInstanceOrThrow(VertigoControls)
    Object.assign(window, { controls })
    controls.actions.setFocusAndScreenOffset([-1, -1, 0])
    // const vertigoHelper = setup(new VertigoHelper(controls.dampedVertigo, { color: 'magenta' }), group)

    const plane = setup(new VertigoWidgetPlane(), group)
    yield* plane.initialize(three.renderer, controls)
  }, [])

  return null
}

function MyScene2() {
  useGroup('my-scene-2', function* (group, three) {
    setup(new DebugHelper(), group)
      .regularGrid()

    const grid = setup(new DashedGridHelper({
      color: '#F0F',
      dashRatio: 2 / 3,
      dashSize: 1 / 5,
    }), group)

    yield three.ticker.onTick(tick => {
      grid.setProps({
        border: true,
        size: tick.lerpSin01Time(5, 8, { frequency: 1 / 5 }),
      }).update()
    })
  }, [])
  return null
}

function VertigoSlider() {
  const { ref } = useEffects<HTMLDivElement>(function* (div) {
    const slider = div.querySelector('input')!
    const controls = Message.requireInstanceOrThrow(VertigoControls)
    slider.addEventListener('input', () => {
      controls.vertigo.perspective = parseFloat(slider.value)
    })
    yield onTick('three', tick => {
      slider.value = controls.vertigo.perspective.toString()
    })
  }, [])
  return (
    <div ref={ref} className='pointer-events-auto'>
      <label className='flex items-center gap-2 text-sm'>
        <span>
          Perspective
        </span>
        <input
          type='range'
          min={0}
          max={2}
          step={0.01}
          defaultValue={1}
        />
      </label>
    </div>
  )
}

export function PageClient() {
  return (
    <ThreeProvider
      vertigoControls={{
        size: 14,
        eventTarget: 'canvas',
        // rotation: `-20deg, 30deg, 0deg`,
        // zoom: 1.5,
        // screenOffset: [-2 / 3, 0, 0],
        // focus: [-2, 0, 0],
        inputConfig: {
          // wheel: 'zoom',
          wheel: 'dolly',
        },
        after: 80,
      }}
    >
      <div className='layer pointer-events-none p-8 flex flex-col gap-2'>
        <h1 className='text-2xl'>
          Vertigo Camera Demo
        </h1>
        <VertigoSlider />
      </div>
      <ThreeSettings />
      <MyScene />
    </ThreeProvider>
  )
}
