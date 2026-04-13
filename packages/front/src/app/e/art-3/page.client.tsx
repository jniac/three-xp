'use client'
import { Color } from 'three'

import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { setup } from 'some-utils-three/utils/tree'
import { Message } from 'some-utils-ts/message'

import { widgets } from './widgets'

function Art() {
  const three = useThreeWebGL()
  three.scene.background = new Color('#ddd')
  three.renderer.localClippingEnabled = true

  useGroup('art', function* (group) {
    setup(new DebugHelper(), group)

    const controls = Message.requireInstanceOrThrow(VertigoControls)
    Object.assign(window, { controls })

    setup(new widgets.Knob(), {
      parent: group,
      position: [0, 0, 0],
    })

    setup(new widgets.Knob({
      backgroundColor: '#1B2995',
      handleColor: '#E67BB6',
      handleTurnOffset: 0.25,
      handleAperture: 0
    }), {
      parent: group,
      scale: 1 / 2,
      position: [-.75, .25, 0],
    })

    setup(new widgets.Knob({
      backgroundColor: '#A36868',
      discColor: '#588988',
      handleColor: '#56AB6D',
      handleTurnOffset: 0.25,
      handleAperture: .5
    }), {
      parent: group,
      scale: 1 / 2,
      position: [-.75, -.25, 0],
    })

    setup(new widgets.FourBlades(), {
      parent: group,
      position: [1, 2, 0],
    })

    setup(new widgets.FourBlades(), {
      parent: group,
      position: [0, -1, 0],
    })

    setup(new widgets.FourBlades(), {
      parent: group,
      position: [.25, .75, 0],
      scale: 1 / 2,
    })

    setup(new widgets.SplittedDisc(), {
      parent: group,
      position: [-.5, 1, 0],
    })

    setup(new widgets.SplittedDisc(), {
      parent: group,
      scale: 2,
      position: [1.5, -1.5, 0],
    })

    setup(new widgets.CrossyDiamond(), {
      parent: group,
      position: [1, 1, 0],
    })

    setup(new widgets.CrossyDiamond(), {
      parent: group,
      position: [-2.25, -.25, 0],
      scale: 1 / 2,
    })

    setup(new widgets.CrossyDiamond({
      crossColor: widgets.Colors.lightGrey,
      backgroundColors: [
        widgets.Colors.liberty,
        widgets.Colors.vividBlue,
      ]
    }), {
      parent: group,
      position: [-.25, -1.75, 0],
      scale: 1 / 2,
    })

    setup(new widgets.CrossyDiamond({
      crossColor: widgets.Colors.lightGrey,
      backgroundColors: [
        widgets.Colors.liberty,
        widgets.Colors.vividBlue,
      ]
    }), {
      parent: group,
      position: [2.25, .75, 0],
      scale: 1 / 2,
    })

    setup(new widgets.Sphery(), {
      parent: group,
      position: [-1.5, 1, 0],
    })

    setup(new widgets.Sphery({
      backgroundColors: ['#321D37', '#A36868'],
      sphereColors: ['#321D37', '#A36868'],
    }), {
      parent: group,
      position: [2, 0, 0],
    })

    setup(new widgets.Dashy(), {
      parent: group,
      position: [-1.5, 0, 0],
    })

    setup(new widgets.Dashy({
      backgroundColor: '#321D37'
    }), {
      parent: group,
      position: [-1.5, -1.5, 0],
      scale: 2,
    })

    setup(new widgets.Dashy({
      backgroundColor: widgets.Colors.vividBlue,
      dashColor: widgets.Colors.greyedCyan,
    }), {
      parent: group,
      position: [.25, 1.25, 0],
      scale: 1 / 2,
    })

    setup(new widgets.Torus({}), {
      parent: group,
      position: [2, 1.5, 0],
    })

    setup(new widgets.Torus({
      backgroundColor: widgets.Colors.pink,
      torusColor: widgets.Colors.pink,
      ringColor: widgets.Colors.lightPink,
    }), {
      parent: group,
      position: [-2.25, .25, 0],
      scale: 1 / 2,
    })

    setup(new widgets.RoundedBox(), {
      parent: group,
      position: [0, 2, 0],
    })

    setup(new widgets.RoundedBox({
      backgroundColor: widgets.Colors.vividBlue,
      boxColor: widgets.Colors.coralTree,
      buttonColor: widgets.Colors.white,
    }), {
      parent: group,
      position: [1, 0, 0],
    })

    setup(new widgets.RoundedBox({
      backgroundColor: widgets.Colors.vividBlue,
      boxColor: widgets.Colors.lightPink,
      buttonColor: widgets.Colors.vividBlue,
    }), {
      parent: group,
      position: [1.75, .75, 0],
      scale: 1 / 2,
    })

  }, [])
  return null
}

export function PageClient() {
  return (
    <div className='absolute-through'>
      <ThreeProvider
        fxaa
        stencil
        vertigoControls={{
          size: 4.5,
          // rotation: '-10deg, -15deg, 0',
          // fov: 20,
          perspective: .5,
        }}
      >
        <div className='text-[#333] p-4'>
          <h1>
            Stencil Test (WIP)
          </h1>
        </div>
        <Art />
      </ThreeProvider>
    </div>
  )
}