
import { useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { setup } from 'some-utils-three/utils/tree'

import { DebugHelper } from 'some-utils-three/helpers/debug'
import { HomeText } from './home-text'

export function MyScene() {
  const three = useThreeWebGL()!

  useGroup('my-scene', function* (group) {
    three.pipeline.basicPasses.fxaa.enabled = false

    setup(new DebugHelper(), group)
    // .regularGrid({ size: 20, subdivisions: [200], opacity: [.01] })

    setup(new HomeText().initialize(three), group)

  }, [])

  return null
}
