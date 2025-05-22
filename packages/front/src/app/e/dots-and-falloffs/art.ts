import { Color } from 'three'

import { handlePointer } from 'some-utils-dom/handle/pointer'
import { ThreeWebGLContext } from 'some-utils-three/contexts/webgl'

import { Dots } from './Dots'

export function* art(three: ThreeWebGLContext) {
  three.scene.background = new Color('#1c54e0')
  three.ticker.set({ activeDuration: 30 })
  three.useOrbitControls()

  const dots = new Dots()
  three.scene.add(dots)
  yield () => dots.removeFromParent()

  yield handlePointer(document.body, {
    onTap() {
      dots.falloffsAreVisible = !dots.falloffsAreVisible
    },
  })
}
