'use client'
import { IcosahedronGeometry, Mesh } from 'three'

import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { setup } from 'some-utils-three/utils/tree'
import { onTick } from 'some-utils-ts/ticker'

import { ThreeProvider, useThree } from './three-provider'

import s from './client.module.css'
import { TextHelper } from './point-text-helper'

export function Setup() {
  useThree(function* (three) {
    yield () => three.scene.clear()

    setup(new Mesh(new IcosahedronGeometry(10, 10), new AutoLitMaterial({ wireframe: true })), three.scene)

    const controls = new VertigoControls()
    controls
      .initialize(three.renderer.domElement)
      .start()

    yield onTick('three', tick => {
      controls.update(three.camera, three.aspect, tick.deltaTime)
    })

    setup(new TextHelper(), three.scene)
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
