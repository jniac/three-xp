'use client'
import { lerp, limitedClamp } from 'some-utils-ts/math/basic'
import { DragMobile } from 'some-utils-ts/math/misc/drag.mobile'
import { calculateExponentialDecayLerpRatio } from 'some-utils-ts/math/misc/exponential-decay'
import { Memorization } from 'some-utils-ts/observables/memorization'

export class ToggleMobile {
  static DragState = {
    None: 0,
    JustStarted: 1,
    Dragging: 2,
  };

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
  };

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
  };

  dragMobile = new DragMobile();

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
