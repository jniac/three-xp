'use client'
import { IcosahedronGeometry, Mesh, Vector3 } from 'three'

import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { setup } from 'some-utils-three/utils/tree'
import { onTick } from 'some-utils-ts/ticker'

import { TextHelper } from './point-text-helper'
import { ThreeProvider, useThree } from './three-provider'

import s from './client.module.css'

export function Setup() {
  useThree(function* (three) {
    yield () => three.scene.clear()

    const controls = new VertigoControls({
      size: 5,
    })
      .initialize(three.renderer.domElement)
      .start()

    yield onTick('three', tick => {
      controls.update(three.camera, three.aspect, tick.deltaTime)
    })

    const text1 = setup(new TextHelper({
      textCount: 3,
      // orientation: TextHelper.Orientation.Billboard,
    }), three.scene)
    text1.setTextAt(0, 'Hello, World!!!\nTest?!', { y: 0, color: '#ff4080' })
    text1.setTextAt(1, 'bonjour', { y: .7, color: '#4080ff' })
    text1.setTextAt(2, 'FooBar\n!!!', { y: 1.4, color: '#ff8040' })
    console.log(text1.getDataStringView())

    Object.assign(window, { controls, text1 })

    const sphere = setup(new Mesh(new IcosahedronGeometry(200, 40), new AutoLitMaterial({ wireframe: true })), three.scene)
    const { array, count } = sphere.geometry.attributes.position
    const textCount = count / 3
    console.log({ textCount })
    const textHelper2 = setup(new TextHelper({
      textCount,
      textSize: 2.75,
      orientation: TextHelper.Orientation.Billboard,
    }), three.scene)
    const v1 = new Vector3()
    const v2 = new Vector3()
    for (let i = 0; i < textCount; i++) {
      const { x, y, z } = v1.fromArray(array, i * 9)
        .add(v2.fromArray(array, i * 9 + 3))
        .add(v2.fromArray(array, i * 9 + 6))
        .divideScalar(3)
      textHelper2.setTextAt(i, `${i}`, { x, y, z, color: '#99ccff' })
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
