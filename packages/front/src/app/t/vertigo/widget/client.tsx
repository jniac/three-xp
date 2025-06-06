'use client'

import { IcosahedronGeometry, Mesh } from 'three'

import { EditorProvider, ThreeProvider, useThree } from 'some-three-editor/editor-provider'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { setup } from 'some-utils-three/utils/tree'

import { VertigoWidget } from '../general/VertigoWidget'

function MyScene() {
  useThree(function* (three) {
    setup(new Mesh(new IcosahedronGeometry(1, 0), new AutoLitMaterial()), { parent: three.scene, x: -4 })
    setup(new VertigoWidget(), { parent: three.scene })
  }, [])
  return null
}

export function Client() {
  return (
    <ThreeProvider>
      <EditorProvider>
        <div className={`layer thru p-4`}>
          <h1>Vertigo Widget</h1>
        </div>
        <MyScene />
      </EditorProvider>
    </ThreeProvider>
  )
}
