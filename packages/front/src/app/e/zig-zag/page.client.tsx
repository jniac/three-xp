'use client'
import { Color } from 'three'

import { ThreeProvider, useThreeWebGL } from 'some-utils-misc/three-provider'

class ZizZagGrid {
  constructor(width: number, height: number) {

  }
}

function ThreeSettings() {
  const three = useThreeWebGL()
  three.pipeline.basicPasses.fxaa.enabled = false
  three.scene.background = new Color('#ccc')
  return null
}

export function PageClient() {
  return (
    <ThreeProvider
      vertigoControls={{ size: 15 }}
    >
      <ThreeSettings />
      <h1>
        Zig Zag
      </h1>
    </ThreeProvider>
  )
}
