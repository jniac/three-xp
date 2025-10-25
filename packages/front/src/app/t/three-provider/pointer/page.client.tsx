'use client'

import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { SimpleGridHelper } from 'some-utils-three/helpers/grid'
import { setup } from 'some-utils-three/utils/tree'
import { Message } from 'some-utils-ts/message'

function MyScene() {
  const three = useThreeWebGL()!
  useGroup('my-scene', function* (group) {
    three.pipeline.basicPasses.fxaa.enabled = false

    setup(new SimpleGridHelper(), group)

    const helper = setup(new DebugHelper(), group)

    const controls = Message.send<VertigoControls>(VertigoControls).assertPayload()

    yield three.ticker.onTick(tick => {
      helper.clear()

      {
        const i = three.pointer.intersectPlane('xy')
        if (i.intersected) {
          helper.point(i.point, { color: 'red' })
          helper.circle({ center: i.point }, { color: 'red' })
        }
      }

      {
        const plane = controls.dampedVertigo.computeFocusPlane()
        const i = three.pointer.intersectPlane(plane)
        if (i.intersected) {
          const color = 'cyan'
          helper.point(i.point, { color })
          helper.circle({ center: i.point, axis: plane.normal }, { color })
          helper.text(i.point, `focus plane\nintersection`, { color, size: .4, offset: [0, -.2, 0] })
        }
      }
    })

    document.body.style.backgroundColor = '#222222'
  })
  return null
}

export function PageClient() {
  return (
    <ThreeProvider
      vertigoControls={{
        rotation: '-20deg, -30deg, 0',
        size: 10,
      }}
    >
      <div className='PageClient p-16'>
        <h1 className='mb-4 text-3xl font-bold'>
          Pointer Test
        </h1>
        <p>
          Move the mouse to see the intersection points with the XY plane and with the vertigo focus plane.
        </p>
      </div>
      <MyScene />
    </ThreeProvider>
  )
}
