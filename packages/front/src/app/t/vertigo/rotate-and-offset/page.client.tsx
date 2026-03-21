'use client'

import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { Vertigo } from 'some-utils-three/camera/vertigo'
import { VertigoHelper } from 'some-utils-three/camera/vertigo/helper'
import { AxesHelper } from 'some-utils-three/helpers/axes'
import { setup } from 'some-utils-three/utils/tree'

function MyScene() {
  const three = useThreeWebGL()
  three.pipeline.basicPasses.fxaa.enabled = false

  useGroup('my-scene', function* (group, three) {
    setup(new AxesHelper(), group)

    const vertigo = new Vertigo({
      size: 10,
      before: 20,
      after: 20,
    })
    vertigo.update(1)
    setup(new VertigoHelper(vertigo, { color: 'cyan' }), group)
    yield three.ticker.onTick(tick => {
      vertigo.perspective = tick.sin01Time({ frequency: 1 / 5 }) * .1
      vertigo.update(1)
    })
  }, [])

  return null
}

export function PageClient() {
  return (
    <ThreeProvider
      vertigoControls={{
        size: 10,
        // screenOffset: [3, 2, 0],
        // rotation: `30deg, 30deg, 0deg`,
        // zoom: 2,
        inputConfig: {
          wheel: 'zoom',
        },
      }}
    >
      <MyScene />
    </ThreeProvider>
  )
}
