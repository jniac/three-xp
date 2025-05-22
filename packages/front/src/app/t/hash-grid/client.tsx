'use client'
import { IcosahedronGeometry, Mesh } from 'three'

import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { setup } from 'some-utils-three/utils/tree'

import { ThreeProvider, useThree } from '@/tools/three-provider'

import HashGridPage from './hash-grid'

import s from './client.module.css'

export function Setup() {
  useThree(function* (three) {
    {
      const geometry = new IcosahedronGeometry(1, 16)
      const material = new AutoLitMaterial()
      const mesh1 = setup(new Mesh(geometry, material), {
        parent: three.scene,
        scale: .5,
        position: [10, 0, 0],
      })
      yield () => mesh1.removeFromParent()
      const mesh2 = setup(new Mesh(geometry, material), {
        parent: three.scene,
        scale: .5,
        position: [30, 0, 0],
      })
      yield () => mesh2.removeFromParent()
    }

    three.pipeline.basicPasses.smaa.enabled = false
    three.pipeline.basicPasses.fxaa.enabled = false
  }, [])
  return null
}

export function Client() {
  return (
    <div className={`layer thru ${s.Client}`}>
      <ThreeProvider
        vertigoControls={{
          size: 24,
          focus: [10, 0, 0],
        }}
      >
        <Setup />
        <HashGridPage />
      </ThreeProvider>
    </div>
  )
}
