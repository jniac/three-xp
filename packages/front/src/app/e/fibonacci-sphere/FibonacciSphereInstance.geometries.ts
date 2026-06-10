import { CircleGeometry, CylinderGeometry, IcosahedronGeometry, TorusGeometry } from 'three'
import { BufferGeometryUtils } from 'three/examples/jsm/Addons.js'

import { flipTriangles } from 'some-utils-three/utils/geometry/triangles'

function turn(x: number) {
  return x * Math.PI * 2
}

function createRoundedDisc({
  radius = <number>.5,
  tube = <number>(radius * .5),
  radialSegments = 64,
  tubeSegments = 12,
} = {}) {
  const innerRadius = radius - tube
  const circle0 = new CircleGeometry(innerRadius, radialSegments)
  const circle1 = flipTriangles(circle0.clone())
    .translate(0, 0, -tube)
  circle0.translate(0, 0, tube)
  const torus = new TorusGeometry(innerRadius, tube, tubeSegments, radialSegments, 2 * Math.PI, -Math.PI / 2, Math.PI)
  return BufferGeometryUtils.mergeGeometries([
    circle0,
    circle1,
    torus,
  ], false)
    .scale(1, 1, .5)
}

function createHalfRoundedDisc({
  radius = <number>.5,
  tube = <number>(radius * .5),
  radialSegments = 32,
  tubeSegments = 12,
} = {}) {
  const innerRadius = radius - tube
  const circle0 = new CircleGeometry(innerRadius, radialSegments)
  circle0.translate(0, 0, tube)
  const torus = new TorusGeometry(innerRadius, tube, tubeSegments, radialSegments, 2 * Math.PI, 0, Math.PI / 2)
  return BufferGeometryUtils.mergeGeometries([
    circle0,
    torus,
  ], false)
    .scale(1, 1, .5)
}

function createSquashedSphere({ radius = .5, detail = 10 } = {}) {
  return new IcosahedronGeometry(radius, detail)
    .scale(1, 1, .2)
}

function createFunnyShape({ radius = .5, radialSegments = 64, tubeRatio = 1 / 3 } = {}) {
  const quarterRadius = radius * .1
  const tube = (radius - quarterRadius) * tubeRatio
  const smallQuarterTorus = new TorusGeometry(radius - quarterRadius, quarterRadius, 16, radialSegments, 2 * Math.PI, turn(0), turn(.25))
    .translate(0, 0, tube - quarterRadius)

  return BufferGeometryUtils.mergeGeometries([
    new TorusGeometry(radius - quarterRadius, tube, 16, radialSegments, 2 * Math.PI, Math.PI / 2, Math.PI),
    smallQuarterTorus,
    smallQuarterTorus.clone().rotateY(turn(.5)),
    createRoundedDisc({ radius: radius - quarterRadius - tube, tube: quarterRadius, radialSegments, tubeSegments: 8 }),
    new CylinderGeometry(radius, radius, (tube - quarterRadius) * 2, radialSegments, 1, true).rotateX(turn(.25)),
  ], false)
    .scale(1, 1, .5)
}

export const geometries = {
  createRoundedDisc,
  createHalfRoundedDisc,
  createSquashedSphere,
  createFunnyShape,
}
