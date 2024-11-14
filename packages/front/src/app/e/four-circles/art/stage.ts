import { Group } from 'three'

import { SkyMesh } from 'some-utils-three/objects/sky-mesh'
import { setup } from 'some-utils-three/utils/tree'
import { loop } from 'some-utils-ts/iteration/loop'

import { useGroup } from '@/tools/three-provider'

import { Rectangle } from 'some-utils-ts/math/geom/rectangle'
import { BigLines } from './BigLines'
import { CirclePlane } from './circle-plane'

class Dial extends Group {
  parts = (() => {
    const lines = setup(new BigLines(), this)
    lines.position.z = 1
    lines.thickness = .0125
    lines.parts.lines.material.color.set('#15093e')
    lines.parts.lines.material.color.set('#95c3fb')
    const rect1 = new Rectangle(0, 0).applyPadding(4.1 + .05, "grow")
    const rect2 = new Rectangle(0, 0).applyPadding(6.2 + .05, "grow")
    for (const { t } of loop(60)) {
      const angle = (t + .5 / 60) * Math.PI * 2
      const x = Math.cos(angle)
      const y = Math.sin(angle)
      const p1 = rect1.raycast(0, 0, x, y).getPointMin()
      const p2 = rect2.raycast(0, 0, x, y).getPointMin()
      lines
        .moveTo(p1)
        .lineTo(p2)
    }
    lines
      .draw()
    return { lines }
  })()
}

export function Stage() {
  useGroup('four-circles', function* (group) {
    setup(new SkyMesh({ color: '#e1dff1' }), group)

    setup(group, { rotationZ: '45deg' })

    setup(new Dial(), {
      parent: group,
    })

    const d = 2.0175
    const ne = setup(new CirclePlane, {
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
    const sw = setup(new CirclePlane, {
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
    setup(new CirclePlane, {
      parent: group,
      scaleScalar: 4,
      position: [0, 0, -1],
    }, circle => {
      circle.parts.planeUniforms.uTimeCycleOffset.value = .75
      circle.parts.colors[0].set('#e1dff1')
      circle.parts.colors[1].set('#95c3fb')
      circle.parts.colors[2].set('#170551')
    })
  }, [])
  return null
}
