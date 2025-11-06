'use client'
import { CircleGeometry, IcosahedronGeometry, Mesh, TorusGeometry } from 'three'

import { handlePointer } from 'some-utils-dom/handle/pointer'
import { useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { TransformDeclaration } from 'some-utils-three/declaration'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { setup } from 'some-utils-three/utils/tree'
import { lerp, limitedClamp } from 'some-utils-ts/math/basic'
import { calculateExponentialDecayLerpRatio } from 'some-utils-ts/math/misc/exponential-decay'
import { Message } from 'some-utils-ts/message'
import { Memorization } from 'some-utils-ts/observables/memorization'

import { handleKeyboard } from 'some-utils-dom/handle/keyboard'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { DragMobile } from 'some-utils-ts/math/misc/drag.mobile'
import { VELOCITY_SCALE } from './settings'

class ToggleMobile {
  static DragState = {
    None: 0,
    JustStarted: 1,
    Dragging: 2,
  }

  static defaultProps = {
    positions: [0, 100],
    overshootLimit: 20,
    /**
     * The damping ratio applied when dragging the mobile.
     * 
     * Value between 0 and 1. Represents the missing part of the value after 1 second.
     * 
     * For example, a value of 0.01 means that after 1 second, 1% of the distance
     * will be missing.
     */
    dragDamping: .0001,
  }

  props: typeof ToggleMobile.defaultProps

  state = {
    position: 0,
    time: 0,
    deltaTime: 0,

    dragging: false,
    dragVelocity: 0,
    dragStartTime: 0,
    dragStopTime: 0,
    dragVelocityMem: new Memorization(6, 0),
    dragState: ToggleMobile.DragState.None,

    inputPosition: 0,
    naturalDestination: 0,
    destination: 0,
  }

  dragMobile = new DragMobile()

  get firstPosition() { return this.props.positions[0] }
  get lastPosition() { return this.props.positions[this.props.positions.length - 1] }

  get position() { return this.state.position }

  constructor(props?: Partial<typeof ToggleMobile.defaultProps>) {
    this.props = { ...ToggleMobile.defaultProps, ...props }
    this.state.position = this.firstPosition
    this.state.inputPosition = this.firstPosition
    this.state.destination = this.firstPosition
    this.state.naturalDestination = this.firstPosition
    this.dragMobile.set({ position: this.firstPosition })
  }

  dragStart(): this {
    if (this.state.dragging)
      return this

    this.state.dragStartTime = this.state.time
    this.state.dragging = true
    this.state.dragState = ToggleMobile.DragState.JustStarted

    console.log('drag start')

    return this
  }

  dragStop(): this {
    if (!this.state.dragging)
      return this

    this.state.dragging = false
    this.state.dragState = ToggleMobile.DragState.None
    this.state.dragStopTime = this.state.time

    this.dragMobile.set({
      position: this.state.position,
      velocity: this.state.dragVelocity,
      drag: 1 - this.props.dragDamping,
    })

    const naturalDestination = this.dragMobile.getDestination()

    let closestPosition = this.props.positions[0]
    let closestDistance = Math.abs(naturalDestination - closestPosition)
    for (let i = 1; i < this.props.positions.length; i++) {
      const position = this.props.positions[i]
      const distance = Math.abs(naturalDestination - position)
      if (distance < closestDistance) {
        closestPosition = position
        closestDistance = distance
      }
    }

    this.state.naturalDestination = naturalDestination
    this.state.destination = closestPosition
    this.state.inputPosition = this.state.position // Sync input position to current position

    this.dragMobile.setVelocityForDestination(closestPosition)

    return this
  }

  drag(delta: number) {
    if (!this.state.dragging)
      return

    this.state.inputPosition += delta
  }

  dragAutoStart(delta: number, { distanceThreshold = 5 } = {}): this {
    // Solution #1: skip if still in drag auto-lock period
    // this.state.inputPosition += delta * dragControlFactor

    // if (this.#dragStartCoolDownFor(this.state.time) < 1)
    //   return this

    // Solution #2: gradual control regain (tricky...)
    const dragControlFactor = Math.min(1, Math.pow(this.#dragStartCoolDownFor(this.state.time), 2))
    this.state.inputPosition = lerp(
      this.state.position,
      this.state.inputPosition + delta * dragControlFactor,
      dragControlFactor * .8 + .2)

    if (this.state.dragState === ToggleMobile.DragState.Dragging) // Already dragging
      return this

    const deltaToPosition = this.state.inputPosition - this.state.position
    if (Math.abs(deltaToPosition) >= distanceThreshold)
      this.dragStart()

    return this
  }

  #dragStartCoolDownFor(time: number): number {
    const COOL_DOWN_DRAG_START = .8
    return (time - this.state.dragStopTime) / COOL_DOWN_DRAG_START
  }

  #dragStopCoolDownFor(time: number): number {
    const COOL_DOWN_DRAG_STOP = .15
    return (time - this.state.dragStartTime) / COOL_DOWN_DRAG_STOP
  }

  #isDragAutoLockedFor(time: number): boolean {
    return this.#dragStartCoolDownFor(time) < 1 || this.#dragStopCoolDownFor(time) < 1
  }

  isDragAutoLocked(): boolean {
    return this.#isDragAutoLockedFor(this.state.time)
  }

  dragAutoStop({ velocityThreshold = .1 } = {}): this {
    if (this.state.dragState !== ToggleMobile.DragState.Dragging) // Already not dragging
      return this

    if (this.isDragAutoLocked())
      return this

    if (Math.abs(this.state.dragVelocity) < velocityThreshold)
      this.dragStop()

    return this
  }

  update(deltaTime: number) {
    this.state.deltaTime = deltaTime
    this.state.time += deltaTime

    const timeOld = this.state.time - deltaTime
    const dragAutoLockEnd = this.#isDragAutoLockedFor(timeOld)
      && this.#isDragAutoLockedFor(this.state.time) === false
    if (dragAutoLockEnd)
      this.state.inputPosition = this.state.position // Sync input position when not dragging

    if (this.state.dragging) {
      const { overshootLimit: ol } = this.props
      const min = this.firstPosition, max = this.lastPosition
      const targetPosition = limitedClamp(this.state.inputPosition, min, min - ol, max, max + ol)
      const lerpRatio = calculateExponentialDecayLerpRatio(this.props.dragDamping, deltaTime)
      const positionOld = this.state.position
      this.state.position = lerp(this.state.position, targetPosition, lerpRatio)
      this.state.dragVelocity = (this.state.position - positionOld) / deltaTime
      this.state.dragState = ToggleMobile.DragState.Dragging

      this.dragMobile.set({
        position: this.state.position,
        velocity: this.state.dragVelocity,
        drag: 1 - this.props.dragDamping,
      })

      this.state.naturalDestination = this.dragMobile.getDestination()
    }

    else {
      this.dragMobile.update(deltaTime)
      this.state.position = this.dragMobile.position
      // this.state.inputPosition = this.state.position // Sync input position when not dragging
    }
  }
}

export function ToggleDemo({ dragDamping, ...props }: { dragDamping?: number } & TransformDeclaration) {
  const three = useThreeWebGL()!
  useGroup('toggle-demo', props, function* (group) {
    const controls = Message.send<VertigoControls>(VertigoControls).assertPayload()

    setup(new DebugHelper(), group)
      .text([0, -12, 0], `d: ${dragDamping?.toPrecision(3).replace(/0+$/, '') || 'default'}`, { size: 1, color: 'white' })

    const sphere1 = setup(new Mesh(new IcosahedronGeometry(1, 12), new AutoLitMaterial({})), group)

    const mobile = new ToggleMobile({
      dragDamping,
      positions: [-10, -1.5, 1.5, 10],
      overshootLimit: 3,
    })

    for (const position of mobile.props.positions) {
      const ring = setup(new Mesh(new TorusGeometry(1.2, .05), new AutoLitMaterial({})), group)
      ring.position.y = position
    }

    const ringInputPosition = setup(new Mesh(
      new CircleGeometry(1.6, 32),
      new AutoLitMaterial({ color: '#022c14' })),
      group)
    const ringNaturalDestination = setup(new Mesh(
      new TorusGeometry(1.4, .05),
      new AutoLitMaterial({ color: '#7636c9' })),
      group)

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
        mobile.dragAutoStart(dy, { distanceThreshold: 1 })
      },
    })

    yield handleKeyboard([
      [' ', () => {
        ringInputPosition.visible = !ringInputPosition.visible
        ringNaturalDestination.visible = !ringNaturalDestination.visible
      }]
    ])

    yield three.ticker.onTick(() => {
      if (usingWheel)
        mobile.dragAutoStop({ velocityThreshold: 20 })

      mobile.update(three.ticker.deltaTime)
      sphere1.position.y = mobile.position

      ringInputPosition.position.y = mobile.state.inputPosition
      ringNaturalDestination.position.y = mobile.state.naturalDestination
    })
  }, [])
  return null
}
