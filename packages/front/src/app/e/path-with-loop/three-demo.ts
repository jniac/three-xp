'use client'

import { GridHelper } from 'three'

import { useGroup } from '@/tools/three-provider'

import { AxesToAxesDemo } from './AxesToAxesDemo'
import { SphereToSphereDemo } from './SphereToSphereDemo'

export function ThreeDemo() {
  useGroup('ThreeDemo', async function* (group, three) {
    three.useOrbitControls({
      position: [6, 4, 7],
      target: [.4, 1.6, -.8],
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
