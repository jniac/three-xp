'use client'

import { Color } from 'three'

import { Leak } from '@/utils/leak'
import { handleElementEvent } from 'some-utils-dom/handle/element-event'
import { handlePointer } from 'some-utils-dom/handle/pointer'
import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { useEffects } from 'some-utils-react/hooks/effects'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { setup } from 'some-utils-three/utils/tree'
import { Message } from 'some-utils-ts/message'
import { superEnum } from 'some-utils-ts/misc/super-enum'
import { Observable } from 'some-utils-ts/observables'
import { onTick } from 'some-utils-ts/ticker'

import { Colors, Spawner, SpawnerArtyMaterial } from './spawn'

const ArtMode = superEnum({
  Normal: 0,
  Fun: 1,
})

function Art() {
  const three = useThreeWebGL()
  three.scene.background = new Color('#ccc')
  three.renderer.localClippingEnabled = true

  useGroup('art', async function* (group) {
    setup(new DebugHelper(), {
      parent: group,
      visible: false,
    })
      .regularGrid({ color: '#333', opacity: [1, .25] })

    const helper = setup(new DebugHelper().onTop(), group)

    const spawner = setup(new Spawner(), group)
    spawner.state.instances.material = new SpawnerArtyMaterial()
    yield Message.dispatchInstance(Spawner, spawner)

    const modeObs = new Observable(ArtMode.Normal)

    yield handlePointer(three.domElement, {
      onTap: () => {
        spawner.clear()
        modeObs.value = modeObs.value.next()
      },
    })

    yield three.ticker.onTick(tick => {
      helper.clear()

      const { point } = three.pointer.intersectPlane('xy')
      helper
        .point(point, { color: Colors.colors.yellow.color, shape: 'ring-thin', size: 1 })

      for (const rect of spawner.queryRectanglesAt(point.x, point.y))
        helper.rect(rect, { color: Colors.colors.yellow.color, diagonals: true, points: { size: .2 } })

      for (let i = 0; i < 5; i++) {
        const rect = spawner.searchRandomSpawnRectAround(point.x, point.y)

        if (rect) {
          helper.point(point, { color: Colors.randomColor(), shape: 'x', size: 1 })
          helper.rect(rect, { color: Colors.randomColor(), diagonals: true, points: { size: .2 } })

          switch (modeObs.value) {
            case ArtMode.Normal: {
              spawner.spawnAt({
                position: rect.center,
                pivotSourcePosition: point,
                size: rect.width,
                color: Spawner.Colors.randomColor(),
              })
              break
            }

            case ArtMode.Fun: {
              spawner.spawnAt({
                position: point,
                pivotSourcePosition: rect.center,
                size: rect.width,
                color: Spawner.Colors.randomColor(),
              })
              break
            }
          }
        }
      }
    })
  }, [])

  return null
}

function SpawnerInfo() {
  const { ref } = useEffects<HTMLDivElement>(async function* (div) {
    const spawner = await Message.waitForInstance(Spawner)
    yield onTick('three', { timeInterval: .5 }, tick => {
      ref.current!.textContent = `count: ${spawner.state.instances.count}`
    })
  }, [])

  return (
    <div ref={ref}>
      info
    </div>
  )
}

function UI() {
  const { ref } = useEffects<HTMLDivElement>(async function* (div) {
    yield handleElementEvent(document.documentElement, {
      fullscreenchange: () => {
        if (document.fullscreenElement) {
          div.style.setProperty('display', 'none')
        } else {
          div.style.removeProperty('display')
        }
      }
    })
  }, [])

  return (
    <div ref={ref} className='text-[#333] p-4 flex flex-col items-start gap-4'>
      <div className='p-2 flex flex-col gap-2 rounded bg-[#fffe]'>
        <h1 className='text-xl'>
          Spawn
        </h1>
        <SpawnerInfo />
      </div>
    </div>
  )
}

export function PageClient() {
  return (
    <div className='absolute-through'>
      <ThreeProvider
        stencil
        vertigoControls={{
          size: 10,
          // rotation: '-10deg, -15deg, 0',
          // fov: 20,
          perspective: .5,
        }}
      >
        <UI />
        <Art />
        <Leak />
      </ThreeProvider>
    </div>
  )
}