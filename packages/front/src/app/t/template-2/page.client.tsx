'use client'

import { Mesh, TorusKnotGeometry } from 'three'

import { ThreeProvider, useGroup } from 'some-utils-misc/three-provider'
import { SimpleGridHelper } from 'some-utils-three/helpers/grid'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { setup } from 'some-utils-three/utils/tree'

import s from './page.client.module.css'

function MyScene() {
  useGroup('my-scene', function* (group) {
    setup(new Mesh(new TorusKnotGeometry(1, .5, 512, 64), new AutoLitMaterial()), group)
    setup(new SimpleGridHelper({ size: 8 }), group)
  }, [])
  return null
}

function UI() {
  return (
    <div className={`layer thru ${s.Client} p-8 flex flex-col gap-1 items-start`}>
      <h1 className='text-2xl font-bold mb-4'>
        Template-2
      </h1>
      <button
        className='btn border rounded px-2 py-1'
        onClick={() => {
          alert('Action')
        }}
      >
        Action
      </button>
      <button
        className='btn border rounded px-2 py-1'
        onClick={() => {
          alert('Another Action')
        }}
      >
        Another Action
      </button>
    </div>)
}

export function Client() {
  return (
    <ThreeProvider
      vertigoControls={{
        size: 8,
      }}
    >
      <MyScene />
      <UI />
    </ThreeProvider>
  )
}
