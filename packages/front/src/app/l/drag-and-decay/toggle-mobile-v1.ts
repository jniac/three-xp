import { lerp, limitedClamp } from 'some-utils-ts/math/basic'
import { DragMobile } from 'some-utils-ts/math/misc/drag.mobile'
import { calculateExponentialDecayLerpRatio } from 'some-utils-ts/math/misc/exponential-decay'
import { Memorization } from 'some-utils-ts/observables/memorization'
import { DestroyableObject } from 'some-utils-ts/types'

type CallbackType = string | number | symbol
type Callback<TArgs extends any[] = any[]> = (...args: [type: CallbackType, ...TArgs]) => (void | 'unsubscribe')

class CallbackHandler<TArgs extends any[] = any[]> {
  map = new Map<CallbackType, Set<Callback<TArgs>>>()

  add(type: CallbackType, callback: Callback<TArgs>): DestroyableObject & { unsubscribe: () => void } {
    if (!this.map.has(type))
      this.map.set(type, new Set())
    const set = this.map.get(type)!
    set.add(callback)
    const unsubscribe = () => this.unsubscribe(type, callback)
    return {
      unsubscribe,
      destroy: unsubscribe,
    }
  }

  addOnce(type: CallbackType, callback: Callback<TArgs>): { unsubscribe: () => void } {
    const wrapper: Callback<TArgs> = (...args) => {
      callback(...args)
      return 'unsubscribe' as const
    }
    return this.add(type, wrapper)
  }

  dispatch(type: CallbackType, ...args: TArgs): this {
    const wildcardSet = this.map.get('*')

    if (wildcardSet) {
      for (const callback of wildcardSet) {
        const result = callback(type, ...args)
        if (result === 'unsubscribe')
          wildcardSet.delete(callback)
      }
      if (wildcardSet.size === 0)
        this.map.delete('*')
    }

    const set = this.map.get(type)
    if (set) {
      for (const callback of set) {
        const result = callback(type, ...args)
        if (result === 'unsubscribe')
          set.delete(callback)
      }
      if (set.size === 0)
        this.map.delete(type)
    }

    return this
  }

  unsubscribe(type: CallbackType, callback: Callback<TArgs>): boolean {
    const set = this.map.get(type)
    if (!set)
      return false
    const result = set.delete(callback)
    if (set.size === 0)
      this.map.delete(type)
    return result
  }
}

export class ToggleMobile {
  static DragState = {
    None: 0,
    JustStarted: 1,
    Dragging: 2,
  }

  static Events = {
    MovingStart: 'moving-start',
    MovingStop: 'moving-stop',
    DragStart: 'drag-start',
    DragStop: 'drag-stop',
    DragAutoLockEnd: 'drag-auto-lock-end',
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
     * 
     * .00001 is a good default value:
     * - .00001 ** .1 = ~.31, so after 0.1s, ~31% of the distance is missing
     */
    dragDamping: .00001,
  };

  props: typeof ToggleMobile.defaultProps

  state = {
    positionIndex: 0,
    position: 0,
    time: 0,
    deltaTime: 0,

    moving: false,
    movingStartTime: -Infinity,
    movingStopTime: -Infinity,

    positionMem: new Memorization(10, 0),
    velocityMem: new Memorization(10, 0),

    dragging: false,
    velocity: 0,
    dragStartTime: -Infinity,
    dragStopTime: -Infinity,
    dragState: ToggleMobile.DragState.None,

    inputPosition: 0,
    naturalDestination: 0,
    destination: 0,

    callbacks: new CallbackHandler<[ToggleMobile]>(),
  };

  dragMobile = new DragMobile()

  get firstPosition() { return this.props.positions[0] }
  get lastPosition() { return this.props.positions[this.props.positions.length - 1] }

  get position() { return this.state.position }
  get isMoving() { return this.state.moving }
  get isDragging() { return this.state.dragging }

  get movingStartDuration(): number {
    if (!this.state.moving)
      return 0
    return this.state.time - this.state.movingStartTime
  }

  get movingStopDuration(): number {
    if (this.state.moving)
      return 0
    return this.state.time - this.state.movingStopTime
  }

  constructor(props?: Partial<typeof ToggleMobile.defaultProps>) {
    this.props = { ...ToggleMobile.defaultProps, ...props }
    this.state.position = this.firstPosition
    this.state.inputPosition = this.firstPosition
    this.state.destination = this.firstPosition
    this.state.naturalDestination = this.firstPosition
    this.dragMobile.set({ position: this.firstPosition })
  }

  on(type: (typeof ToggleMobile.Events)[keyof typeof ToggleMobile.Events], callback: (type: any, mobile: ToggleMobile) => void) {
    return this.state.callbacks.add(type, callback)
  }

  computeClosestPositionIndex(position: number): number {
    let closestIndex = 0
    let closestDistance = Math.abs(position - this.props.positions[0])
    for (let i = 1; i < this.props.positions.length; i++) {
      const pos = this.props.positions[i]
      const distance = Math.abs(position - pos)
      if (distance < closestDistance) {
        closestIndex = i
        closestDistance = distance
      }
    }
    return closestIndex
  }

  inverseLerpPosition(position: number): number {
    const min = this.props.positions[0]
    const max = this.props.positions[this.props.positions.length - 1]
    return (position - min) / (max - min)
  }

  goto(index: number): this {
    const { positions } = this.props
    if (index < 0)
      index += positions.length
    this.dragStop()
    this.dragMobile.set({ drag: 1 - 1e-6 })
    this.dragMobile.setVelocityForDestination(positions[index])
    this.state.destination = positions[index]
    this.state.naturalDestination = positions[index]
    this.state.inputPosition = this.state.position // Sync input position to current position
    return this
  }

  gotoPrevious({ loop = false } = {}): this {
    let prevIndex = this.state.positionIndex - 1
    if (prevIndex < 0)
      prevIndex = loop ? this.props.positions.length - 1 : 0
    return this.goto(prevIndex)
  }

  gotoNext({ loop = false } = {}): this {
    let nextIndex = this.state.positionIndex + 1
    if (nextIndex >= this.props.positions.length)
      nextIndex = loop ? 0 : this.props.positions.length - 1
    return this.goto(nextIndex)
  }

  dragStart(): this {
    if (this.state.dragging)
      return this

    this.state.dragStartTime = this.state.time
    this.state.dragging = true
    this.state.dragState = ToggleMobile.DragState.JustStarted

    this.state.callbacks.dispatch(ToggleMobile.Events.DragStart, this)

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
      velocity: this.state.velocity,
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

    this.state.callbacks.dispatch(ToggleMobile.Events.DragStop, this)

    return this
  }

  drag(delta: number) {
    if (!this.state.dragging)
      return

    this.state.inputPosition += delta
  }

  isDragAutoStartUnderCooldown(): boolean {
    return this.#dragStartCooldownFor(this.state.time) < 1
  }
  dragAutoStart(delta: number, { distanceThreshold = 5 } = {}): this {
    // Solution #1: skip if still in drag auto-lock period
    this.state.inputPosition += delta
    if (this.isDragAutoStartUnderCooldown())
      return this

    // // Solution #2: gradual control regain (tricky...)
    // const dragControlFactor = Math.min(1, Math.pow(this.#dragStartCoolDownFor(this.state.time), 2))
    // this.state.inputPosition = lerp(
    //   this.state.position,
    //   this.state.inputPosition + delta * dragControlFactor,
    //   dragControlFactor * .8 + .2)

    if (this.state.dragState === ToggleMobile.DragState.Dragging) // Already dragging
      return this

    const deltaToPosition = this.state.inputPosition - this.state.position
    if (Math.abs(deltaToPosition) >= distanceThreshold)
      this.dragStart()

    return this
  }

  #dragStartCooldownFor(time: number): number {
    const COOL_DOWN_DRAG_START = .6
    return (time - this.state.dragStopTime) / COOL_DOWN_DRAG_START
  }

  #dragStopCoolDownFor(time: number): number {
    const COOL_DOWN_DRAG_STOP = .1
    return (time - this.state.dragStartTime) / COOL_DOWN_DRAG_STOP
  }

  #isDragAutoLockedFor(time: number): boolean {
    return this.#dragStartCooldownFor(time) < 1 || this.#dragStopCoolDownFor(time) < 1
  }

  isDragAutoLocked(): boolean {
    return this.#isDragAutoLockedFor(this.state.time)
  }

  dragAutoStop({ velocityThreshold = .1 } = {}): this {
    if (this.state.dragState !== ToggleMobile.DragState.Dragging) // Already not dragging
      return this

    if (this.isDragAutoLocked())
      return this

    if (Math.abs(this.state.velocity) < velocityThreshold)
      this.dragStop()

    return this
  }

  update(deltaTime: number): this {
    this.state.deltaTime = deltaTime
    this.state.time += deltaTime

    if (this.state.dragging) {
      const { overshootLimit: ol } = this.props
      const min = this.firstPosition, max = this.lastPosition
      const targetPosition = limitedClamp(this.state.inputPosition, min, min - ol, max, max + ol)
      const lerpRatio = calculateExponentialDecayLerpRatio(this.props.dragDamping, deltaTime)
      const positionOld = this.state.position
      const positionNew = lerp(positionOld, targetPosition, lerpRatio)
      const positionDelta = positionNew - positionOld

      this.state.position = positionNew
      this.state.velocity = positionDelta / deltaTime
      this.state.dragState = ToggleMobile.DragState.Dragging

      this.dragMobile.set({
        position: this.state.position,
        velocity: this.state.velocity,
        drag: 1 - this.props.dragDamping,
      })

      this.state.naturalDestination = this.dragMobile.getDestination()
    }

    else {
      this.dragMobile.update(deltaTime)
      this.state.position = this.dragMobile.position
      this.state.velocity = this.dragMobile.velocity
      // this.state.inputPosition = this.state.position // Sync input position when not dragging
    }

    // Update input position if just finished drag auto-lock
    const timeOld = this.state.time - deltaTime
    const dragAutoLockEnd = this.#isDragAutoLockedFor(timeOld)
      && this.#isDragAutoLockedFor(this.state.time) === false
    if (dragAutoLockEnd) {
      this.state.inputPosition = this.state.position // Sync input position when not dragging
      this.state.callbacks.dispatch(ToggleMobile.Events.DragAutoLockEnd, this)
    }

    this.state.positionIndex = this.computeClosestPositionIndex(this.state.position)
    this.state.positionMem.setValue(this.state.position, true)
    this.state.velocityMem.setValue(this.state.velocity, true)

    const movingNew = Math.abs(this.state.velocityMem.average) > 1e-5
    const movingOld = this.state.moving
    this.state.moving = movingNew
    if (movingNew !== movingOld) {
      if (movingNew)
        this.state.movingStartTime = this.state.time
      else
        this.state.movingStopTime = this.state.time
      const type = movingNew
        ? ToggleMobile.Events.MovingStart
        : ToggleMobile.Events.MovingStop
      this.state.callbacks.dispatch(type, this)
    }

    return this
  }

  /**
   * A single method to generate AND update an SVG representation of the ToggleMobile.
   */
  svgRepresentation({
    svg = <SVGSVGElement | null>null,
  } = {}): SVGSVGElement {
    if (!svg) {
      svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      svg.setAttribute('viewBox', '-30 -30 100 500')
      svg.setAttribute('width', '100')
      svg.setAttribute('height', '500')
    }

    let head = svg.querySelector('circle.head')
    if (!head) {
      head = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      head.classList.add('head')
      head.setAttribute('r', '5')
      head.setAttribute('fill', 'none')
      head.setAttribute('stroke', 'white')
      svg.appendChild(head)
    }

    const stops = [...svg.querySelectorAll('circle.stop')]
    while (stops.length < this.props.positions.length) {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      circle.classList.add('stop')
      circle.setAttribute('r', '3')
      circle.setAttribute('fill', 'white')
      svg.appendChild(circle)
      stops.push(circle)
    }
    while (stops.length > this.props.positions.length) {
      const circle = stops.pop()
      if (circle && circle.parentNode)
        circle.parentNode.removeChild(circle)
    }

    const remap = (position: number) => {
      const value = this.inverseLerpPosition(position) * 200 + 10
      return value
    }

    for (let i = 0; i < this.props.positions.length; i++) {
      const pos = this.props.positions[i]
      const y = remap(pos)
      const circle = stops[i]
      circle.setAttribute('cy', `${y}`)
    }

    head.setAttribute('cy', `${remap(this.state.position)}`)

    return svg
  }
}
