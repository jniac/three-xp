/* eslint-disable @next/next/no-img-element */
'use client'

import { BoxGeometry, Camera, Group, Mesh, Raycaster, Vector2 } from 'three'

import { ThreeProvider, useThree } from 'some-three-editor/editor-provider'
import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { PRNG } from 'some-utils-ts/random/prng'
import { onTick } from 'some-utils-ts/ticker'
import { Destroyable } from 'some-utils-ts/types'

import { handleKeyboard } from 'some-utils-dom/handle/keyboard'
import { handlePointer } from 'some-utils-dom/handle/pointer'
import { Leak } from './leak'
import { Poc1Scene } from './scene'

class Cubes extends Group {
  constructor({ count = 12 } = {}) {
    super()

    PRNG.reset()
    for (let i = 0; i < count; i++) {
      const cube = new Mesh(
        new BoxGeometry(1, 1, 1),
        new AutoLitMaterial({ color: PRNG.int(0, 0xffffff) }),
      )
      cube.position.x = i
      cube.rotation.x = PRNG.between(0, Math.PI * 2)
      cube.rotation.y = PRNG.between(0, Math.PI * 2)
      cube.rotation.z = PRNG.between(0, Math.PI * 2)
      this.add(cube)
    }
  }
}

class Pointer {
  screen = {
    position: new Vector2(),
    positionDown: new Vector2(),
  }
  ndc = {
    position: new Vector2(),
    positionDown: new Vector2(),
  }

  raycaster = new Raycaster()
  destroyables = [] as Destroyable[]

  initialized = false
  initialize(element: HTMLElement, camera: Camera): this {
    if (this.initialized) {
      console.warn('Pointer already initialized.')
      return this
    }
    this.initialized = true

    this.destroyables.push(...this.doInitialize(element, camera))

    return this
  }

  *doInitialize(element: HTMLElement, camera: Camera) {
    yield handlePointer(element, {
      onChange: info => {
        this.screen.position.copy(info.position)

        const rect = element.getBoundingClientRect()
        let { x, y } = info.position
        x -= rect.left
        y -= rect.top
        x /= rect.width
        y /= rect.height
        x = x * 2 - 1
        y = -(y * 2 - 1)
        this.ndc.position.set(x, y)

        this.raycaster.setFromCamera(this.ndc.position, camera)
      },

      onDown: () => {
        this.screen.positionDown.copy(this.screen.position)
        this.ndc.positionDown.copy(this.ndc.position)
      },
    })
  }
}

function Poc1() {
  useThree(function* (three) {
    const poc1 = new Poc1Scene()
    three.scene.add(poc1)
    yield () => {
      poc1.clear().removeFromParent()
    }

    three.ticker.set({ minActiveDuration: 100 })

    const pointer = new Pointer()
    pointer.initialize(three.renderer.domElement, three.camera)

    const controls = new VertigoControls({
      perspective: .25,
      size: 4,
    })
    controls.initialize(three.renderer.domElement)
    yield onTick('three', () => {
      controls.update(three.camera, three.aspect)
    })

    yield handlePointer(three.renderer.domElement, {
      onTap: () => {
        const p = poc1.parts.earth.earthRaycast(pointer.raycaster.ray)
        if (p) {
          const { x, y, z } = p
          const theta = Math.atan2(y, Math.sqrt(x ** 2 + z ** 2))
          const phi = Math.atan2(z, x)
          poc1.parts.earth.addSphericalSpot({ theta, phi })
        }
      },
    })

    yield handleKeyboard([
      [{ code: 'Space', modifiers: 'shift' }, () => {
        document.body.requestFullscreen()
      }],
    ])

    Object.assign(window, { poc1, three, controls })
  }, 'always')

  return null
}

export function Main() {
  return (
    <div className='layer thru'>
      <ThreeProvider>
        <Leak />
        <Poc1 />
      </ThreeProvider>

      <header className='absolute thru w-full top-0 p-8'>
        <img width={100} src='/assets/images/acme-logo.png' alt='' />
      </header>

      <footer className='absolute thru w-full bottom-0 p-12 flex flex-row justify-center'>
        {/* <h1 className='text-2xl text-[#01a7ff] bg-[white] px-4 py-2 rounded'>
          151 contributions
        </h1> */}
      </footer>

      <div className='layer thru'>
        <div className='absolute left-0 top-0 w-[300px] h-full'>

        </div>
      </div>
    </div>
  )
}

