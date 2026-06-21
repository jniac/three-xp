import { CubicBezierCurve, Curve, Group, Shape, Vector2, Vector2Like } from 'three'

import { ThreeBaseContext } from 'some-utils-three/experimental/contexts/base'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { setup } from 'some-utils-three/utils/tree'
import { Tick } from 'some-utils-ts/ticker'

export class ShapeEditor extends Group {
  helper = setup(new DebugHelper(), this)

  shape: Shape

  #state = {
    selectedPoint: null as Vector2 | null,
  }

  constructor(shape: Shape) {
    super()
    this.shape = shape
    this.draw()
  }

  *#curvePoint() {
    const it = {
      curveIndex: -1,
      curve: null! as Curve<Vector2>,
      point: null! as Vector2,
    }
    for (const curve of this.shape.curves) {
      if (curve instanceof CubicBezierCurve) {
        it.curveIndex++
        it.curve = curve
        it.point = curve.v1
        yield it
        it.point = curve.v2
        yield it
        it.point = curve.v3
        yield it
      }
    }
  }

  #nearestPoint(p: Vector2Like) {
    let nearestPoint: Vector2 | null = null
    let nearestDistance = Infinity
    for (const { point } of this.#curvePoint()) {
      const distance = point.distanceTo(p)
      if (distance < nearestDistance) {
        nearestDistance = distance
        nearestPoint = point
      }
    }
    return nearestPoint
  }

  draw() {
    const { helper, shape } = this
    const color = '#ff0000'
    helper.clear()
    for (const { point } of this.#curvePoint()) {
      const size = point === this.#state.selectedPoint ? 0.2 : 0.1
      helper.point(point, { color, shape: 'circle', size })
    }
    helper.polyline(shape.getPoints(50), { color })
  }

  onTick(tick: Tick, three: ThreeBaseContext) {
    const { point } = three.pointer.intersectPlane('xy')
    const nearestPoint = this.#nearestPoint(point)
    if (nearestPoint && nearestPoint.distanceTo(point) < 0.2) {
      this.#state.selectedPoint = nearestPoint
    } else {
      this.#state.selectedPoint = null
    }
    this.draw()
  }
}
