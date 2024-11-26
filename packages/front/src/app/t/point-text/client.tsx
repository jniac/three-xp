'use client'
import { IcosahedronGeometry, Mesh } from 'three'

import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { setup } from 'some-utils-three/utils/tree'
import { onTick } from 'some-utils-ts/ticker'

import { TextHelper } from './point-text-helper'
import { ThreeProvider, useThree } from './three-provider'

import { makeMatrix4 } from 'some-utils-three/utils/make'
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
    }), three.scene)
    text1.setTextAt(0, 'Hello, World!!!\nTest?!', { y: 0, color: '#ff4080' })
    text1.setMatrixAt(1, makeMatrix4({ y: .7 }))
    text1.setTextAt(2, 'FooBar\n!!!', { y: 1.4, color: '#ff8040' })


    Object.assign(window, { controls, text1 })

    const sphere = setup(new Mesh(new IcosahedronGeometry(200, 10), new AutoLitMaterial({ wireframe: true })), three.scene)
    // console.log(sphere.geometry.attributes.position.count)
    // const { array, count: textCount } = sphere.geometry.attributes.position
    // const textHelper2 = setup(new TextHelper({ textCount, textSize: 4, orientation: TextHelper.Orientation.Normal }), three.scene)
    // let x = 0, y = 0, z = 0
    // const m = new Matrix4().identity()
    // for (let i = 0; i < textCount; i++) {
    //   x = array[i * 3]
    //   y = array[i * 3 + 1]
    //   z = array[i * 3 + 2]
    //   textHelper2.setMatrixAt(i, m.makeTranslation(x, y, z))
    // }
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
