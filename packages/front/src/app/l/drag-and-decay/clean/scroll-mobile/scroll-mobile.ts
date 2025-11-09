import { DragMobile } from 'some-utils-ts/math/misc/drag.mobile'

import { CallbackHandler } from './callback-handler'
import { svgRepresentation } from './svg'

function getClosestStopIndex(stops: number[], position: number): number {
  let closestIndex = 0
  let closestDistance = Infinity
  for (let i = 0; i < stops.length; i++) {
    const stop = stops[i]
    const distance = Math.abs(stop - position)
    if (distance < closestDistance) {
      closestDistance = distance
      closestIndex = i
    }
  }
  return closestIndex
}

class PointerDragState {
  delta = 0
  position = 0
  velocity = 0
  inputPosition = 0

  dragMobile = new DragMobile()

  increment(delta: number): this {
    this.delta += delta
    return this
  }

  start(initialPosition: number): void {
    this.delta = 0
    this.position = initialPosition
    this.inputPosition = initialPosition
    this.dragMobile.position = initialPosition
    this.dragMobile.velocity = 0
  }

  update(deltaTime: number): void {
    const inputPositionNew = this.inputPosition + this.delta
    this.inputPosition = inputPositionNew
    this.delta = 0 // Consume

    this.dragMobile.drag = .9999 // High drag for pointer
    this.dragMobile.setVelocityForDestination(inputPositionNew)
    this.dragMobile.update(deltaTime)

    const positionOld = this.position
    this.position = this.dragMobile.position
    this.velocity = (this.position - positionOld) / deltaTime
  }
}

class AutoDragState {
  delta = 0
  position = 0

  dragMobile = new DragMobile()

  reset() {
    this.delta = 0
  }

  increment(delta: number) {
    this.delta += delta
  }

  update(deltaTime: number) {
    this.dragMobile.drag = .99999

    this.position = this.dragMobile.position
  }
}

enum InputMode {
  Idle,
  PointerDragging,
  AutoDragging,
}

enum EventType {
  InputModeChange = 'input-mode-change',
  StopIndexChange = 'stop-index-change',
}

const defaultProps = {
  stops: [0, 400, 600],
}

export class ScrollMobile {
  props: typeof defaultProps

  state = {
    inputMode: InputMode.Idle,
    stopIndex: 0,

    dragMobile: new DragMobile({ drag: .99 }),
    pointerDrag: new PointerDragState(),
    autoDrag: new AutoDragState(),

    callbackHandler: new CallbackHandler<[ScrollMobile]>(),
  }

  get position() { return this.state.dragMobile.position }

  constructor(userProps?: Partial<typeof defaultProps>) {
    this.props = { ...defaultProps, ...userProps }
  }

  #setInputModeSafe(mode: InputMode): boolean {
    if (this.state.inputMode === mode)
      return false

    this.state.inputMode = mode
    this.state.callbackHandler.dispatch(EventType.InputModeChange, this)

    return true
  }

  #setStopIndexSafe(index: number): boolean {
    if (this.state.stopIndex === index)
      return false

    this.state.stopIndex = index
    this.state.callbackHandler.dispatch(EventType.StopIndexChange, this)

    return true
  }

  getClosestStopIndex(position: number): number {
    return getClosestStopIndex(this.props.stops, position)
  }

  getClosestStop(position: number): number {
    const index = this.getClosestStopIndex(position)
    return this.props.stops[index]
  }

  goToStop(index: number): this {
    const { stops } = this.props
    index %= stops.length
    if (index < 0)
      index += stops.length

    this.#setStopIndexSafe(index)
    this.state.dragMobile.set({ drag: 1 - 1e-6 })
    this.state.dragMobile.setVelocityForDestination(stops[index])

    return this
  }

  goToPreviousStop({ loop = false } = {}): this {
    let prevIndex = this.state.stopIndex - 1
    if (prevIndex < 0)
      prevIndex = loop ? this.props.stops.length - 1 : 0
    return this.goToStop(prevIndex)
  }

  goToNextStop({ loop = false } = {}): this {
    let nextIndex = this.state.stopIndex + 1
    if (nextIndex >= this.props.stops.length)
      nextIndex = loop ? 0 : this.props.stops.length - 1
    return this.goToStop(nextIndex)
  }

  inverseLerpPosition(position: number): number {
    const min = this.props.stops[0]
    const max = this.props.stops[this.props.stops.length - 1]
    return (position - min) / (max - min)
  }

  startDrag(): this {
    if (this.state.inputMode === InputMode.PointerDragging)
      return this

    this.state.pointerDrag.start(this.state.dragMobile.position)
    this.#setInputModeSafe(InputMode.PointerDragging)
    return this
  }

  drag(delta: number): this {
    if (this.state.inputMode !== InputMode.PointerDragging)
      return this

    this.state.pointerDrag.increment(delta)
    return this
  }

  stopDrag(): this {
    if (this.state.inputMode !== InputMode.PointerDragging)
      return this

    const { pointerDrag, dragMobile } = this.state

    dragMobile.position = pointerDrag.position
    dragMobile.velocity = pointerDrag.velocity
    dragMobile.drag = .99999

    const destination = dragMobile.getDestination()
    const stopIndex = this.getClosestStopIndex(destination)
    const stop = this.props.stops[stopIndex]
    dragMobile.setVelocityForDestination(stop)
    this.#setStopIndexSafe(stopIndex)

    // console.log(`Stopping drag. Going over ${Math.abs(stopIndex - dragMobile.position).toFixed(2)}. From ${dragMobile.position.toFixed(2)} (${this.getClosestStopIndex(dragMobile.position)}) to ${stopIndex.toFixed(2)} (${this.getClosestStopIndex(stopIndex)})`)

    this.#setInputModeSafe(InputMode.Idle)
    return this
  }

  autoDrag(delta: number): this {
    const { autoDrag } = this.state

    // Update input position if entering auto drag mode
    if (this.state.inputMode !== InputMode.AutoDragging)
      autoDrag.reset()

    autoDrag.increment(delta)

    this.#setInputModeSafe(InputMode.AutoDragging)
    return this
  }

  update(deltaTime: number): void {
    const { dragMobile, inputMode, pointerDrag, autoDrag } = this.state

    switch (inputMode) {
      case InputMode.Idle: {
        dragMobile.update(deltaTime)
        break
      }

      case InputMode.PointerDragging: {
        pointerDrag.update(deltaTime)
        dragMobile.position = pointerDrag.position
        break
      }

      case InputMode.AutoDragging: {
        autoDrag.update(deltaTime)
        dragMobile.position = autoDrag.position
        break
      }
    }
  }

  svgRepresentation(arg: Parameters<typeof svgRepresentation>[1]): ReturnType<typeof svgRepresentation> {
    return svgRepresentation(this, arg)
  }
}
