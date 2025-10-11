'use client'

import { Mesh, MeshBasicMaterial, PlaneGeometry, Vector2 } from 'three'

import { handlePointer } from 'some-utils-dom/handle/pointer'
import { FpsMeter } from 'some-utils-misc/fps-meter'
import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { GpuComputePenDemo } from 'some-utils-three/experimental/gpu-compute/demo/pen'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { setup } from 'some-utils-three/utils/tree'
import { inverseLerp, lerp } from 'some-utils-ts/math/basic'
import { onTick } from 'some-utils-ts/ticker'

import { leak } from '@/utils/leak'

import { FullscreenButton } from '../shared'

function MyScene() {
  const three = useThreeWebGL()!

  useGroup('my-scene', function* (group) {
    three.pipeline.basicPasses.fxaa.enabled = false

    const plane = setup(new Mesh(new PlaneGeometry(), new MeshBasicMaterial()), group)
    plane.scale.setScalar(10)

    setup(new DebugHelper(), group)
      .regularGrid({ size: 10, subdivisions: [2, 5] })
      .onTop()

    const penDemo = new GpuComputePenDemo({
      size: 2 ** 11,
      // colors: ['#ddd', '#f00', '#0fa50f'],
    })
      .initialize(three.renderer)

    const previousPen = new Vector2()
    const pen = new Vector2()

    let play = true
    let radius = 0.2

    const update = () => {
      const i = three.pointer.intersectPlane('xy')
      if (i.intersected) {
        pen.set(
          inverseLerp(-5, 5, i.point.x),
          inverseLerp(-5, 5, i.point.y))
        const dist = pen.distanceTo(previousPen)
        const radiusTarget = lerp(.2, .05, dist * 100)
        radius = lerp(radius, radiusTarget, 0.01)
        previousPen.copy(pen)
      }
    }

    yield onTick('three', tick => {
      if (!play)
        return

      update()
      penDemo.penMove(pen.x, pen.y, radius)
      penDemo.update(tick.deltaTime)
      plane.material.map = penDemo.currentTexture()
      plane.material.needsUpdate = true
    })

    yield handlePointer(three.domElement, {
      onDown: () => {
        play = !play

        if (play) {
          // Jump immediately to the pen position (skip line)
          update()
          penDemo.penAt(pen.x, pen.y, radius)
        }
      },
    })

  }, [])

  return null
}

export function PageClient() {
  leak()
  return (
    <ThreeProvider
      vertigoControls={{
        fixed: true,
        size: 10,
        frame: 'cover',
        eventTarget: 'canvas',
      }}
      fullscreenKey={{ key: 'f', modifiers: 'shift' }}
    >
      <div className='layer thru flex flex-col p-12'>
        <h1 className='text-4xl font-bold'>
          GPU Compute - Pen Demo
        </h1>
        <p>
          Simple demo of a &quot;pen&quot; drawing on a canvas using GPU compute shaders.
        </p>
        <p>
          Currently using a heavy non-optimized (one-pass) kernel 11x11 gaussian blur for the pen &quot;diffuse&quot; effect.
        </p>
        <FullscreenButton />
        <FpsMeter />
      </div>

      <MyScene />
    </ThreeProvider>
  )
}
