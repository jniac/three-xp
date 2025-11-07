'use client'
import { IcosahedronGeometry, Mesh, TorusGeometry } from 'three'

import { handlePointer } from 'some-utils-dom/handle/pointer'
import { useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { TransformDeclaration } from 'some-utils-three/declaration'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { setup } from 'some-utils-three/utils/tree'
import { DragMobile } from 'some-utils-ts/math/misc/drag.mobile'
import { Message } from 'some-utils-ts/message'
import { Memorization } from 'some-utils-ts/observables/memorization'

import { VELOCITY_SCALE } from './settings'

export function BasicDemo(props: TransformDeclaration) {
  const three = useThreeWebGL()!
  useGroup('basic-demo', props, function* (group) {
    const controls = Message.send<VertigoControls>(VertigoControls).assertPayload()

    setup(new Mesh(new TorusGeometry(1.2, .05), new AutoLitMaterial({ color: 'yellow' })), group)

    const sphere1 = setup(new Mesh(new IcosahedronGeometry(1, 12), new AutoLitMaterial({})), group)
    const ring1 = setup(new Mesh(new TorusGeometry(1.2, .05), new AutoLitMaterial({})), group)

    const dragMobile = new DragMobile({ drag: .999999 })

    const velocityMemo = new Memorization(8, 0)
    let dragging = false, dragStart = false
    const getFactor = () => controls.dampedVertigo.state.realSize.y / three.domElement.clientHeight
    yield handlePointer(three.domElement, {
      onVerticalDragStart: () => {
        dragging = true
        dragStart = true
      },
      onVerticalDrag: info => {
        const delta = -info.delta.y * getFactor() * VELOCITY_SCALE
        velocityMemo.setValue(delta / three.ticker.deltaTime, true)
        dragMobile.position += delta

        dragStart = false
      },
      onVerticalDragStop: () => {
        dragging = false

        dragMobile.velocity = velocityMemo.average
        const destination = dragMobile.getDestination()
        ring1.position.y = destination
      },
    })

    yield three.ticker.onTick(() => {
      if (!dragging) {
        dragMobile.update(three.ticker.deltaTime)
      }
      sphere1.position.y = dragMobile.position

      // const alpha = calculateExponentialDecayLerpRatio(.01, three.ticker.deltaTime)
      // controls.vertigo.focus.lerp(sphere1.position, alpha)
    })
  }, [])
  return null
}
