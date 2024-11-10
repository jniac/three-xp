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
    })
    setup(new CirclePlane, {
      parent: group,
      position: [d, -d, 0],
    })
    setup(new CirclePlane, {
      parent: group,
      position: [-d, -d, 0],
    })
    setup(new CirclePlane, {
      parent: group,
      position: [-d, d, 0],
    })
  }, [])
  return null
}
