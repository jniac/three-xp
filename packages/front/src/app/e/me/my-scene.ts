'use client'

import { useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { setup } from 'some-utils-three/utils/tree'

import { HomeText } from './home-text'
import { useResponsive } from './responsive'

export function MyScene() {
  const three = useThreeWebGL()!
  const responsive = useResponsive()

  useGroup('my-scene', function* (group) {
    three.pipeline.basicPasses.fxaa.enabled = false

    document.querySelector<HTMLElement>('nextjs-portal')?.remove()

    setup(new DebugHelper(), group)
    // .regularGrid({})

    setup(yield* new HomeText()
      .initialize(three, responsive), group)

  }, [])

  return null
}
