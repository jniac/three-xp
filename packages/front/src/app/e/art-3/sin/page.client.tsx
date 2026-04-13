'use client'

import { Color, Vector3 } from 'three'

import { leak } from '@/utils/leak'
import { handlePointer } from 'some-utils-dom/handle/pointer'
import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { setup } from 'some-utils-three/utils/tree'
import { lerp } from 'some-utils-ts/math/basic'
import { Rectangle } from 'some-utils-ts/math/geom/rectangle'
import { computeExponentialLerpFactor } from 'some-utils-ts/math/misc/exponential-lerp'
import { Message } from 'some-utils-ts/message'
import { Spawner, SpawnerArtyMaterial } from '../spawn/spawn'

function sinCurve(t: number, out = new Vector3()) {
  const x = lerp(-50, 50, t)
  const y = Math.sin(x / 5) * 5
  return out.set(x, y, 0)
}

function Art() {
  const three = useThreeWebGL()
  three.scene.background = new Color('#bbb')
  three.renderer.localClippingEnabled = true

  useGroup('art', function* (group) {
    setup(new DebugHelper(), {
      parent: group,
      visible: false,
    })
      .regularGrid({ color: '#333', opacity: [1, .25] })
      .polyline(Array.from({ length: 300 }).map((_, i, arr) => {
        const t = i / arr.length
        return sinCurve(t)
      }), { color: '#333' })

    const helper = setup(new DebugHelper().onTop(), {
      parent: group,
      visible: false,
    })

    const spawner = setup(new Spawner(), group)
    spawner.state.instances.material = new SpawnerArtyMaterial()

    const viewRect = Rectangle.from({ size: 8 })

    const controls = Message.requireInstanceOrThrow(VertigoControls)

    yield handlePointer(three.domElement, {
      onTap: () => {
        spawner.clear()
      },
    })

    let time = 0
    yield three.ticker.onTick(tick => {
      time += .02 * tick.deltaTime
      const point = sinCurve(time % 1)

      const lerpRatio = computeExponentialLerpFactor(tick.deltaTime, { target: .9, timespan: .5 })
      viewRect.centerX = lerp(viewRect.centerX, point.x, lerpRatio)
      viewRect.centerY = lerp(viewRect.centerY, point.y, lerpRatio)

      controls.vertigo.focus.set(viewRect.centerX, viewRect.centerY, 0)
      controls.vertigo.size.set(viewRect.width, viewRect.height)

      for (let i = 0; i < 2; i++) {
        const rect = spawner.searchRandomSpawnRectAround(point.x, point.y, {
          radiusRatioRange: [0, 2],
        })
        if (rect) {
          spawner.spawnAt({
            position: rect.center,
            pivotSourcePosition: point,
            size: rect.width,
            color: Spawner.Colors.randomColor(),
          })
        }
      }

      helper.clear()
        .point(point, { color: 'red', shape: 'ring-thin', size: 1 })
        .rect(viewRect, { color: 'blue' })
        .box(spawner.state.instances.boundingBox!, { color: 'blue' })
    })

    leak({ spawner })

  }, [])

  return null
}

export function PageClient() {
  return (
    <div className='absolute-through'>
      <ThreeProvider
        stencil
        minActiveDuration={60}
        vertigoControls={{
          size: 10,
          rotation: '20deg, 15deg, 0',
          // fov: 20,
          perspective: .5,
        }}
      >
        <div className='text-[#333] p-4'>
          <h1>
            Sin
          </h1>
        </div>
        <Art />
      </ThreeProvider>
    </div>
  )
}