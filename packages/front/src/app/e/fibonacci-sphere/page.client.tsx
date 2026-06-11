'use client'

import { handleKeyboard } from 'some-utils-dom/handle/keyboard'
import { ThreeProvider, useGroup, useThree, useThreeWebGL } from 'some-utils-misc/three-provider'
import { useEffects } from 'some-utils-react/hooks/effects'
import { setup } from 'some-utils-three/utils/tree'
import { find } from 'some-utils-three/utils/tree/find'
import { wait } from 'some-utils-ts/misc/async'
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
    env.scale.setScalar(4)
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
  useEffects(async function* () {
    await wait('nextFrame')
    const fib = find(three.scene, FibonacciSphereInstance)!
    yield handleKeyboard([
      [{ code: 'Space', modifiers: '*' }, info => {
        if (info.event.shiftKey) {
          fib.time.timeScale *= -1
        } else {
          fib.time.togglePause()
        }
      }],
      [{ code: /Arrow/, modifiers: '*' }, info => {
        if (fib.time.paused) {
          fib.time.time += .005
            * (/ArrowUp|ArrowRight/.test(info.event.code) ? 1 : -1)
            * (info.event.shiftKey ? 10 : 1)
            * (info.event.altKey ? .1 : 1)
        } else {
          fib.time.timeScale *= 2 ** (/ArrowUp|ArrowRight/.test(info.event.code) ? 1 : -1)
        }
      }],
    ])
  }, [])
  return null
}

export default function PageClient() {
  return (
    <ThreeProvider
      fxaa
      vertigoControls={{
        size: 3,
        perspective: 1,
      }}
    >
      <MyScene />
      <UI />
    </ThreeProvider>
  )
}