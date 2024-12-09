'use client'

import { useRef } from 'react'
import { DoubleSide, Group, IcosahedronGeometry, Mesh, PlaneGeometry } from 'three'

import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { computeFrontFacing, computeMatrix3d, computePerspective, computeZIndex } from 'some-utils-three/css-3d/compute'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { setup } from 'some-utils-three/utils/tree'
import { loop } from 'some-utils-ts/iteration/loop'
import { onTick, Ticker } from 'some-utils-ts/ticker'

import { ThreeProvider, useGroup } from '@/tools/three-provider'
import { leak } from '@/utils/leak'

import s from './client.module.css'

export function Setup() {
  const SMALL_PLANE_COUNT = 16

  const divRef = useRef<HTMLDivElement>(null)
  useGroup('setup', function* (group, three) {
    setup(new Mesh(new IcosahedronGeometry(20, 10), new AutoLitMaterial({ wireframe: true })), group)

    const mainPlane = setup(new Mesh(new PlaneGeometry(), new AutoLitMaterial({ side: DoubleSide })), group)

    const smallPlanesContainer = setup(new Group(), {
      parent: group,
      rotation: ['-70deg', 0, 0],
    })
    const smallPlanes = Array.from({ length: SMALL_PLANE_COUNT }, () => {
      return setup(new Mesh(new PlaneGeometry(.5, .5), new AutoLitMaterial({ side: DoubleSide })), {
        parent: smallPlanesContainer,
      })
    })

    const controls = new VertigoControls()
      .initialize(three.renderer.domElement)
      .start()

    Object.assign(window, { controls })

    const { camera } = three

    const ticker = Ticker.get('three')
    leak({ camera, controls, ticker })

    if (divRef.current) {
      const rootDiv = divRef.current
      const mainPlaneDiv = divRef.current.firstElementChild as HTMLDivElement
      const smallPlaneDivs = [...divRef.current.querySelectorAll('.SmallPlane ')] as HTMLDivElement[]

      mainPlane.updateWorldMatrix(true, false)
      camera.updateMatrixWorld(true)
      mainPlaneDiv.style.position = 'absolute'
      mainPlaneDiv.style.left = '50%'
      mainPlaneDiv.style.top = '50%'

      yield onTick('three', tick => {
        controls.update(three.camera, three.aspect, tick.deltaTime)

        mainPlane.updateWorldMatrix(true, false)
        camera.updateMatrixWorld(true)

        rootDiv.style.perspective = computePerspective(camera, three.renderer.domElement)

        mainPlaneDiv.style.transform = computeMatrix3d(camera, mainPlane, three.renderer.domElement, 100, 0, 0, false)
        mainPlaneDiv.style.zIndex = computeZIndex(camera, mainPlane)

        const front = computeFrontFacing(camera, mainPlane)
        mainPlaneDiv.querySelector('span + span')!.textContent = `(${front ? 'front' : 'back'})`
        mainPlaneDiv.style.color = front ? 'black' : '#00f'

        for (const it of loop(SMALL_PLANE_COUNT)) {
          const div = smallPlaneDivs[it.i]
          const plane = smallPlanes[it.i]
          plane.updateWorldMatrix(true, false)
          div.style.position = 'absolute'
          div.style.left = '50%'
          div.style.top = '50%'
          div.style.transform = computeMatrix3d(camera, plane, three.renderer.domElement, 100, 0, 0, false)
          div.style.zIndex = computeZIndex(camera, plane)

          const a = Math.PI * 2 * it.t
          const r = 2
          const x = Math.cos(a) * r
          const y = Math.sin(a) * r
          plane.position.set(x, y, 0)
          const time = tick.time + it.t * Math.PI
          plane.rotation.set(time * 2, time, 0)
        }

        mainPlane.rotation.y += .5 * tick.deltaTime
        mainPlane.rotation.x += .1 * tick.deltaTime
      })
    }
  }, [])

  return (
    <div ref={divRef} className='layer thru'>
      <div className='w-[100px] h-[100px] border-solid border-[8px] bg-white border-[#fc3] text-black font-black flex flex-col justify-center items-center hover:border-[#00f]' style={{ lineHeight: '.5em' }}>
        <span className='text-3xl'>
          CSS!
        </span>
        <span>
          (front)
        </span>
      </div>
      {Array.from({ length: SMALL_PLANE_COUNT }, (_, i) => (
        <div key={i} className='SmallPlane w-[50px] h-[50px] border-solid border-[2px] bg-white border-[#fc3] text-black font-black flex flex-col justify-center items-center hover:border-[#00f]' style={{ lineHeight: '.5em' }}>
          {i}
        </div>
      ))}
    </div>
  )
}

export function Client() {
  return (
    <div className={`layer thru ${s.Client}`}>
      <ThreeProvider>
        <Setup />
      </ThreeProvider>
    </div>
  )
}
