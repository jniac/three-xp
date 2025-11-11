import { DragMobile } from 'some-utils-ts/math/misc/drag.mobile'

export class PointerDragState {
  delta = 0;
  position = 0;
  velocity = 0;
  inputPosition = 0;

  dragMobile = new DragMobile();

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
