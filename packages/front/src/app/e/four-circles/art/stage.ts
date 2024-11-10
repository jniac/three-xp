import { setup } from 'some-utils-three/utils/tree'

import { useGroup } from '@/tools/three-provider'

import { SkyMesh } from 'some-utils-three/objects/sky-mesh'
import { CirclePlane } from './circle-plane'

export function Stage() {
  useGroup('four-circles', function* (group) {
    setup(new SkyMesh({ color: '#e1dff1' }), group)

    const d = 2.01
    setup(new CirclePlane, {
      parent: group,
      position: [d, d, 0],
    }, circle => {
      circle.parts.planeUniforms.uTimeCycleOffset.value = 0
      circle.parts.colors[1].set('#fcff99')
      circle.parts.colors[2].set('#170551')
    })
    setup(new CirclePlane, {
      parent: group,
      position: [d, -d, 0],
    }, circle => {
      circle.parts.planeUniforms.uTimeCycleOffset.value = .25
      circle.parts.colors[1].set('#18188c')
      circle.parts.colors[2].set('#72d9ab')
    })
    setup(new CirclePlane, {
      parent: group,
      position: [-d, -d, 0],
    }, circle => {
      circle.parts.planeUniforms.uTimeCycleOffset.value = .5
      circle.parts.colors[1].set('#f3a3b3')
      circle.parts.colors[2].set('#15093e')
    })
    setup(new CirclePlane, {
      parent: group,
      position: [-d, d, 0],
    }, circle => {
      circle.parts.planeUniforms.uTimeCycleOffset.value = .75
      circle.parts.colors[1].set('#3b3426')
      circle.parts.colors[2].set('#de2566')
    })
  }, [])
  return null
}
