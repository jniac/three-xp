
import { useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { setup } from 'some-utils-three/utils/tree'

import { TransformTool } from 'some-utils-three/objects/tools'
import { find } from 'some-utils-three/utils/tree/find'
import { Umbellifer } from '../me/about/umbellifer'
import { Butterfly } from './Butterfly'

export function MyScene() {
  const three = useThreeWebGL()
  useGroup('my-scene', function* (group) {
    setup(new DebugHelper(), group)
      .regularGrid({ subdivisions: [30], opacity: [.01] })

    setup(new Butterfly(), {
      position: [0, 1.5, 2.4],
      rotation: [.3, .02, .53],
      parent: group,
    })

    setup(new Umbellifer({
      seed: 1234,
      scaleFactor: 8,
      lineWidthFactor: 1.5,
      splitIndices: [[2], [1]],
      stemColor: 'hsl(249, 27%, 56%)',
      leafColor: '#e8e8e8',
    }), {
      position: [4.6, -17.4, -3.8],
      rotation: [.19, .47, 0],
      parent: group,
    })

    if (false) {
      const tool = setup(new TransformTool(), group)
      // tool.attach(find(group, Umbellifer)!, { localPivot: [0, 20, 0] })
      tool.attach(find(group, Butterfly)!)
    }
  }, [])
  return null
}