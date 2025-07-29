'use client'
import { IcosahedronGeometry, Mesh } from 'three'

import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { setup } from 'some-utils-three/utils/tree'
import { onTick } from 'some-utils-ts/ticker'

import { ThreeProvider, useThree } from './three-provider'

import s from './page.client.module.css'

export function Setup() {
  useThree(function* (three) {
    const mesh = setup(new Mesh(new IcosahedronGeometry(), new AutoLitMaterial()), three.scene)
    yield () => mesh.removeFromParent()

    const controls = new VertigoControls()
    controls
      .initialize(three.renderer.domElement)
      .start()

    yield onTick('three', tick => {
      controls.update(three.camera, three.aspect, tick.deltaTime)
    })
  }, [])
  return null
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
