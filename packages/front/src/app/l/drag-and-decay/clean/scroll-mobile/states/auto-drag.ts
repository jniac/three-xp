import { lerp, saturate } from 'some-utils-ts/math/basic'
import { DragMobile } from 'some-utils-ts/math/misc/drag.mobile'

import { getClosestStopIndex } from '../core'

export class AutoDragState {
  delta = 0
  position = 0
  velocity = 0
  fadeTime = .2

  time = 0

  stopIndex = -1
  stopChangeTime = 0

  dragMobile = new DragMobile();

  reset() {
    this.delta = 0
  }

  increment(delta: number) {
    this.delta += delta
  }

  update(deltaTime: number, stops: number[]) {
    this.time += deltaTime

    this.dragMobile.drag = .99999
    this.dragMobile.position = this.position
    this.dragMobile.velocity = this.delta / deltaTime

    const naturalDestination = this.dragMobile.getDestination()
    const stopIndex = getClosestStopIndex(stops, naturalDestination)
    const stop = stops[stopIndex]

    if (stopIndex !== this.stopIndex) {
      this.stopIndex = stopIndex
      this.stopChangeTime = this.time
    }

    const timeSinceStopChange = this.time - this.stopChangeTime
    const alpha = saturate(timeSinceStopChange / this.fadeTime) // 0.2 seconds to reach the stop

    this.dragMobile.position = this.position
    this.dragMobile.setVelocityForDestination(stop)
    this.dragMobile.update(deltaTime)

    const positionOld = this.position
    this.position = lerp(this.position + this.delta, this.dragMobile.position, alpha)
    const realDelta = this.position - positionOld
    this.overshoot = realDelta - this.delta
    this.velocity = realDelta / deltaTime

    this.delta = 0 // Consume
  }
}
