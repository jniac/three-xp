
import { useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { setup } from 'some-utils-three/utils/tree'

import { DebugHelper } from 'some-utils-three/helpers/debug'
import { HomeText } from './home-text'

export function MyScene() {
  const three = useThreeWebGL()!

  useGroup('my-scene', function* (group) {
    three.pipeline.basicPasses.fxaa.enabled = false

    document.querySelector<HTMLElement>('nextjs-portal')?.remove()

    setup(new DebugHelper(), group)
    // .regularGrid({})

    setup(yield* new HomeText()
      .initialize(three), group)

  }, [])

  return null
}
