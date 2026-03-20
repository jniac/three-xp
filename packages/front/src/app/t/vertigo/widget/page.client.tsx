'use client'

import { IcosahedronGeometry, Mesh } from 'three'

import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { setup } from 'some-utils-three/utils/tree'

import { ThreeProvider, useThree } from 'some-utils-misc/three-provider'
import { VertigoWidget } from '../general/VertigoWidget'

function MyScene() {
  useThree(function* (three) {
    setup(new Mesh(new IcosahedronGeometry(1, 0), new AutoLitMaterial()), { parent: three.scene, x: -4 })
    const widget = setup(new VertigoWidget(), { parent: three.scene })
    yield three.ticker.onTick(tick => {
      widget.widgetUpdate(
        three.pointer.screenPosition,
        three.pointer.buttonDown(),
        three.camera,
        tick.deltaTime,
      )
    })
  }, [])
  return null
}

export function PageClient() {
  return (
    <ThreeProvider>
      <div className={`layer thru p-4`}>
        <h1>Vertigo Widget</h1>
      </div>
      <MyScene />
    </ThreeProvider>
  )
}
