'use client'
import { Group, Mesh, TorusKnotGeometry } from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/Addons.js'

import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { Vertigo } from 'some-utils-three/camera/vertigo'
import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { VertigoHelper } from 'some-utils-three/camera/vertigo/helper'
import { AxesHelper } from 'some-utils-three/helpers/axes'
import { DashedGrid } from 'some-utils-three/helpers/dashed-grid'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { setup } from 'some-utils-three/utils/tree'
import { Message } from 'some-utils-ts/message'

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
  })()
}

function ThreeSettings() {
  const three = useThreeWebGL()
  three.pipeline.basicPasses.fxaa.enabled = false
  return null
}

function MyScene() {
  useGroup('my-scene', function* (group, three) {
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

  }, [])

  return null
}

function MyScene2() {
  useGroup('my-scene-2', function* (group, three) {
    setup(new DebugHelper(), group)
      .regularGrid()

    const grid = setup(new DashedGrid({
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

export function PageClient() {
  return (
    <ThreeProvider
      vertigoControls={{
        size: 10,
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
      <ThreeSettings />
      <MyScene />
    </ThreeProvider>
  )
}
