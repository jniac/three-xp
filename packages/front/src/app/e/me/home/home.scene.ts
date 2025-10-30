'use client'

import { useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { setup } from 'some-utils-three/utils/tree'

import { useObservableValue } from 'some-utils-react/hooks/observables'
import { useResponsive } from '../responsive'
import { HomeText } from './home-text'

export function HomeScene() {
  const three = useThreeWebGL()!
  const responsive = useResponsive()
  const { screenSize } = useObservableValue(responsive.layoutObs)

  useGroup('my-scene', function* (group) {
    three.pipeline.basicPasses.fxaa.enabled = false

    document.querySelector<HTMLElement>('nextjs-portal')?.remove()

    setup(new DebugHelper(), group)
    // .regularGrid({})

    setup(yield* new HomeText(screenSize)
      .initialize(three, responsive), group)

  }, [screenSize])

  return null
}
