import { DebugHelper } from 'some-utils-three/helpers/debug'

import { useGroup } from '@/tools/three-provider'

export function Grid({
  plane = 'xz' as 'xz' | 'xy' | 'yz',
  size = 100,
  subdivisions = [10, 10],
  opacity = [.1, .01],
}) {
  useGroup('grid', function* (group) {
    new DebugHelper()
      .regularGrid({
        plane,
        size,
        subdivisions,
        opacity,
      })
      .addTo(group)
  })
  return null
}
