'use client'
import { CircleGeometry, IcosahedronGeometry, Mesh, TorusGeometry } from 'three'

import { handleKeyboard } from 'some-utils-dom/handle/keyboard'
import { handlePointer } from 'some-utils-dom/handle/pointer'
import { useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { TransformDeclaration } from 'some-utils-three/declaration'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { setup } from 'some-utils-three/utils/tree'
import { Message } from 'some-utils-ts/message'

import { ToggleMobile } from '../../toggle-mobile'
import { VELOCITY_SCALE } from './settings'

export function ToggleDemo({ dragDamping, ...props }: { dragDamping?: number } & TransformDeclaration) {
  const three = useThreeWebGL()!
  useGroup('toggle-demo', props, function* (group) {
    const controls = Message.send<VertigoControls>(VertigoControls).assertPayload()

    setup(new DebugHelper(), group)
      .text([0, -12, 0], `d: ${dragDamping?.toPrecision(3).replace(/0+$/, '') || 'default'}`, { size: 1, color: 'white' })

    const sphere1 = setup(new Mesh(new IcosahedronGeometry(1, 12), new AutoLitMaterial({})), group)

    const text = setup(new DebugHelper(), sphere1)

    const mobile = new ToggleMobile({
      dragDamping,
      positions: [-10, -1.5, 1.5, 10],
      overshootLimit: 3,
    })

    for (const position of mobile.props.positions) {
      const ring = setup(new Mesh(new TorusGeometry(1.2, .05), new AutoLitMaterial({})), group)
      ring.position.y = position
    }

    const circleInputPosition = setup(new Mesh(
      new CircleGeometry(1.6, 32),
      new AutoLitMaterial({ color: '#022c14' })),
      { parent: group, z: -.1 })
    const ringNaturalDestination = setup(new Mesh(
      new TorusGeometry(1.4, .05),
      new AutoLitMaterial({ color: '#7636c9' })),
      { parent: group, z: -.1 })

    let usingWheel = false
    const getFactor = () => controls.dampedVertigo.state.realSize.y / three.domElement.clientHeight
    yield handlePointer(three.domElement, {
      onVerticalDragStart: () => {
        mobile.dragStart()
      },
      onVerticalDrag: info => {
        usingWheel = false
        const dy = getFactor() * -info.delta.y * VELOCITY_SCALE
        mobile.drag(dy)
      },
      onVerticalDragStop: () => {
        mobile.dragStop()
      },

      onWheel: info => {
        usingWheel = true
        const dy = getFactor() * info.delta.y * VELOCITY_SCALE * 1
        // mobile.autoDrag(dy, { distanceThreshold: 1 })
        mobile.autoDrag(dy)
      },
    })

    yield handleKeyboard([
      [' ', () => {
        circleInputPosition.visible = !circleInputPosition.visible
        ringNaturalDestination.visible = !ringNaturalDestination.visible
      }]
    ])

    yield three.ticker.onTick(() => {
      // if (usingWheel)
      //   mobile.dragAutoStop({ velocityThreshold: 20 })

      mobile.update(three.ticker.deltaTime)
      sphere1.position.y = mobile.position

      circleInputPosition.position.y = mobile.state.inputPosition
      ringNaturalDestination.position.y = mobile.state.naturalDestination
      text.textAt(0, `${mobile.state.positionIndex}`, { position: [0, 0, 1], size: 4, color: 'blue' })
    })
  }, [])
  return null
}
