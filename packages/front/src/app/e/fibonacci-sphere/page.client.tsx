'use client'

import { handlePointer } from 'some-utils-dom/handle/pointer'
import { ThreeProvider, useGroup, useThree, useThreeWebGL } from 'some-utils-misc/three-provider'
import { useEffects } from 'some-utils-react/hooks/effects'
import { setup } from 'some-utils-three/utils/tree'
import { find } from 'some-utils-three/utils/tree/find'
import { DirectionalLight, Group, IcosahedronGeometry, Mesh, MeshPhysicalMaterial } from 'three'
import { EnvRoom } from './EnvRoom'
import { FibonacciSphereDemo } from './FibonacciSphereDemo'
import { FibonacciSphereInstance } from './FibonacciSphereInstance'

class LightSetup extends Group {
  constructor() {
    super()
    setup(new DirectionalLight('white', 1), this)
  }
}

export function MyScene() {
  const three = useThreeWebGL()

  useGroup('my-scene', function* (group) {
    setup(new LightSetup(), group)

    setup(new FibonacciSphereDemo(), {
      parent: group,
      rotation: '-90deg, 0deg, -90deg',
      visible: false,
    })

    setup(new FibonacciSphereInstance(), {
      parent: group,
      rotation: '-90deg, 0deg, -90deg',
    })

    const env = setup(new EnvRoom(), group)
    env.applyToSceneOnce(three.scene, three.renderer)
    env.children.forEach((c, i) => c.visible = i === 0)

    // Environment map test
    setup(new Mesh(new IcosahedronGeometry(.4, 10), new MeshPhysicalMaterial({
      metalness: 1,
      roughness: 0,
    })), {
      parent: group,
      visible: false,
    })
  }, [])

  return null
}

function UI() {
  const three = useThree()
  useEffects(function* () {
    yield handlePointer(document.body, {
      onTap: info => {
        if (info.tapCount === 1) {
          find(three.scene, FibonacciSphereInstance)
            ?.toggleTimeScale()
        } else if (info.tapCount === 2) {
          find(three.scene, FibonacciSphereInstance)
            ?.step(info.originalDownEvent.shiftKey ? -1 : 1)
        }
      },
    })
  }, [])
  return null
}

export default function PageClient() {
  return (
    <ThreeProvider
      fxaa
      vertigoControls={{
        size: 3,
        // perspective: 0,
      }}
    >
      <MyScene />
      <UI />
    </ThreeProvider>
  )
}