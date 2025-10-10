'use client'

import { Mesh, MeshBasicMaterial, PlaneGeometry, Vector2 } from 'three'

import { FpsMeter } from 'some-utils-misc/fps-meter'
import { ThreeProvider, useGroup, useThree, useThreeWebGL } from 'some-utils-misc/three-provider'
import { GpuComputePenDemo } from 'some-utils-three/experimental/gpu-compute/demo/pen'
import { setup } from 'some-utils-three/utils/tree'
import { inverseLerp, lerp } from 'some-utils-ts/math/basic'
import { onTick } from 'some-utils-ts/ticker'

import { leak } from '@/utils/leak'
import { DebugHelper } from 'some-utils-three/helpers/debug'

function MyScene() {
  const three = useThreeWebGL()!

  useGroup('my-scene', function* (group) {
    three.pipeline.basicPasses.fxaa.enabled = false

    const plane = setup(new Mesh(new PlaneGeometry(), new MeshBasicMaterial()), group)
    plane.scale.setScalar(10)

    setup(new DebugHelper(), group)
      .regularGrid({ size: 10, subdivisions: [2, 5] })
      .onTop()

    const penDemo = new GpuComputePenDemo({ size: 2 ** 11 })
      .initialize(three.renderer)

    const previousPen = new Vector2()
    let radius = 0.2
    yield onTick('three', tick => {
      const i = three.pointer.intersectPlane('xy')
      if (i.intersected) {
        const pen = new Vector2(
          inverseLerp(-5, 5, i.point.x),
          inverseLerp(-5, 5, i.point.y))
        const dist = pen.distanceTo(previousPen)
        const radiusTarget = lerp(.2, .05, dist * 500)
        radius = lerp(radius, radiusTarget, 0.01)
        penDemo.penMove(pen.x, pen.y, radius)
        previousPen.copy(pen)
      }
      penDemo.update(tick.deltaTime)
      plane.material.map = penDemo.currentTexture()
      plane.material.needsUpdate = true
    })

  }, [])

  return null
}

function FullscreenButton() {
  const three = useThree()
  return (
    <button
      className='absolute top-12 right-12 z-10 border border-white/50 hover:bg-black/10 hover:border-white text-white px-2 py-1 rounded transition'
      onClick={() => three.setFullscreen('canvas')}
    >
      Fullscreen
    </button>
  )
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
          Simple demo of a "pen" drawing on a canvas using GPU compute shaders.
        </p>
        <p>
          Currently using a heavy non-optimized (one-pass) kernel 11x11 gaussian blur for the pen "diffuse" effect.
        </p>
        <FullscreenButton />
        <FpsMeter />
      </div>

      <MyScene />
    </ThreeProvider>
  )
}
