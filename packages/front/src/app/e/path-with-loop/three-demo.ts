'use client'

import { GridHelper } from 'three'

import { useGroup } from '@/tools/three-provider'

import { AxesToAxesDemo } from './AxesToAxesDemo'
import { SphereToSphereDemo } from './SphereToSphereDemo'

export function ThreeDemo() {
  useGroup('ThreeDemo', async function* (group, three) {
    three.useOrbitControls({
      position: [2, 4.5, 8],
      target: [-1.2, 1.2, -.2],
    })

    group.add(new GridHelper(10, 10, '#5c4f7d', '#352945'))

    const axesToAxes = new AxesToAxesDemo()
    axesToAxes.position.set(-5, 0, 0)
    yield three.onTick(axesToAxes.onTick)
    group.add(axesToAxes)

    const sphereToSphere = new SphereToSphereDemo()
    sphereToSphere.position.set(0, 0, 0)
    yield three.onTick(sphereToSphere.onTick)
    group.add(sphereToSphere)

  }, [])

  return null
}
