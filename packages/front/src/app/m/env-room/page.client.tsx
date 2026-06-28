'use client'
import { IcosahedronGeometry, Mesh, MeshPhysicalMaterial, TorusGeometry } from 'three'

import { ThreeProvider, useGroup } from 'some-utils-misc/three-provider'
import { setup } from 'some-utils-three/utils/tree'

import { EnvRoom } from '@/misc/env-room'

function MySceneComponent() {
  useGroup('my-scene', function* (group, three) {
    const env = new EnvRoom({
      walls: {
        // color: 'hsl(18, 90%, 74%)',
        // shadowColor: 'hsl(288, 89%, 15%)',
        alteration1: {
          rotation: [.5, -1, 1],
          intensity: 1,
        }
      }
    })
      .addLights()
      .addTorusKnots({
        // color1: 'hsl(106, 53%, 69%)',
      })

    // ball:
    setup(new Mesh(
      new IcosahedronGeometry(1, 12),
      new MeshPhysicalMaterial({
        metalness: 1,
        roughness: .5,
        color: 'hsl(67, 100%, 85%)',
      })
    ), group)

    // ring:
    setup(new Mesh(
      new TorusGeometry(2, 0.2, 32, 128),
      new MeshPhysicalMaterial({
        metalness: 1,
        roughness: .125,
      })
    ), group)

    // ring2:
    setup(new Mesh(
      new TorusGeometry(2.5, 0.2, 32, 128),
      new MeshPhysicalMaterial({
        metalness: 1,
        roughness: .125,
        iridescence: 1,
        iridescenceIOR: 1.3,
        color: 'hsl(203, 88%, 53%)',
      })
    ), group)

    // ring2:
    setup(new Mesh(
      new TorusGeometry(3, 0.2, 32, 128),
      new MeshPhysicalMaterial({
        metalness: 1,
        roughness: .125,
        iridescence: 1,
        iridescenceIOR: 1.3,
        color: 'hsl(318, 100%, 73%)',
      })
    ), group)

    env.applyToScene(three.scene, three.getRenderer())

    env
      .removeAllExceptWalls()
      .resetTexture()
      .render(three.getRenderer())

    three.scene.background = env.getTexture()

    setup(env, group)
  }, [])

  return null
}

function Label({ text }: { text: string }) {
  return (
    <div className='w-fit px-2 py-1 rounded text-[#111] bg-[#fff2] backdrop-blur'>{text}</div>
  )
}

export default function PageClient() {
  return (
    <div className='layer flex p-4 gap-4'>
      <div className='relative w-full h-full'>
        <ThreeProvider
          webgl
          className='rounded-lg overflow-hidden'
          vertigoControls={{
            size: 15,
          }}
        >
          <div className='p-4 text-[#111]'>
            <Label text='WebGL' />
          </div>
          <MySceneComponent />
        </ThreeProvider>
      </div>
      <div className='relative w-full h-full'>
        <ThreeProvider
          webgpu
          className='rounded-lg overflow-hidden'
          vertigoControls={{
            size: 15,
          }}
        >
          <div className='p-4 text-[#111]'>
            <Label text='WebGPU' />
          </div>
          <MySceneComponent />
        </ThreeProvider>
      </div>
    </div>
  )
}