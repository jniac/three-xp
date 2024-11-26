'use client'
import { IcosahedronGeometry, Matrix4, Mesh } from 'three'

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

    const sphere = setup(new Mesh(new IcosahedronGeometry(200, 40), new AutoLitMaterial({ wireframe: true })), three.scene)
    console.log(sphere.geometry.attributes.position.count)

    const controls = new VertigoControls()
    controls
      .initialize(three.renderer.domElement)
      .start()

    yield onTick('three', tick => {
      controls.update(three.camera, three.aspect, tick.deltaTime)
    })

    setup(new TextHelper(), three.scene)

    const { array, count: textCount } = sphere.geometry.attributes.position
    const textHelper2 = setup(new TextHelper({ textCount }), three.scene)
    let x = 0, y = 0, z = 0
    const m = new Matrix4().identity()
    for (let i = 0; i < textCount; i++) {
      x = array[i * 3]
      y = array[i * 3 + 1]
      z = array[i * 3 + 2]
      textHelper2.setMatrixAt(i, m.makeTranslation(x, y, z))
    }
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
