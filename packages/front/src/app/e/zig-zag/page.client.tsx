'use client'
import { Color } from 'three'

import { ThreeProvider, useThreeWebGL } from 'some-utils-misc/three-provider'

const settings = {
  /**
   * Letter frequency probabilities for the French language.
   * Based on raw analysis of lexique3 data.
   */
  frenchAlphabetProbabilities: [0.08746729350965143, 0.015543568576691313, 0.038752578227734785, 0.02342566410940336, 0.15847122900217528, 0.014097618308809583, 0.017490284277631975, 0.012837371862379184, 0.08897276423312654, 0.00196179421635765, 0.0009428040165990647, 0.041878592555498854, 0.027596064031312522, 0.07371092581291054, 0.0578864206858185, 0.02719053132720299, 0.006116322016775245, 0.0834064112260341, 0.08175888501520946, 0.07400773448480284, 0.04353246761492011, 0.01155569805193517, 0.00019443348827169262, 0.0034236166057309467, 0.003529166213649866, 0.004249760529366996],
}

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
