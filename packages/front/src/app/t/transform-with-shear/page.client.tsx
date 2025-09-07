'use client'

import { ColorRepresentation, Group, LineBasicMaterial, LineSegments, Mesh, TorusKnotGeometry } from 'three'

import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { setup } from 'some-utils-three/utils/tree'

import { Transform } from 'some-utils-three/experimental/transform-with-shear'
import { AxesGeometry } from 'some-utils-three/geometries/axis'
import { LineGeometryUtils } from 'some-utils-three/geometries/line-utils'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { inverseLerp } from 'some-utils-ts/math/basic'
import { transition } from 'some-utils-ts/math/easing'
import { waveform } from 'some-utils-ts/math/waveform'
import { RandomUtils as R } from 'some-utils-ts/random/random-utils'
import { Tick } from 'some-utils-ts/ticker'
import { UI } from './ui'

const style = {
  xColor: '#ff3333',
  yColor: '#33cc66',
  zColor: '#3366ff',
}

export class Params {
  useMatrixInterpolation = false
  transform = new Transform()
}

class MyObject extends Group {
  static shared = {
    axesGeometry: new AxesGeometry({ radius: .04, coneRatio: .2, length: 1 }),
    knotGeometry: new TorusKnotGeometry(.3, .1, 512, 64),
  }
  box = setup(new LineSegments(LineGeometryUtils.setAsBounds(null, -1, 1), new LineBasicMaterial()), this)
  axes = setup(new Mesh(MyObject.shared.axesGeometry, new AutoLitMaterial({ vertexColors: true })), this)
  knot = setup(new Mesh(MyObject.shared.knotGeometry, new AutoLitMaterial()), this)
  transform = new Transform()
  constructor(color?: ColorRepresentation) {
    super()
    if (color)
      this.setColor(color)
  }
  setColor(color: ColorRepresentation): this {
    this.box.material.color.set(color)
    this.axes.material.color.set(color)
    this.knot.material.color.set(color)
    return this
  }
  setTransform(arg: Parameters<Transform['setTransform']>[0]): this {
    this.matrixAutoUpdate = false
    this.transform
      .setTransform(arg)
      .toMatrix(this.matrix)
    return this
  }
}

class MyTween extends Group {
  useMatrixInterpolation = true
  objA = setup(new MyObject('yellow'), this)
  objB = setup(new MyObject('cyan'), this)
  objC = setup(new MyObject(), this)
  constructor() {
    super()
    this.objA.setTransform({ position: [-2, 0, 0] })
    this.objB.setTransform({ position: [2, 0, 0] })
  }
  onTick(tick: Tick) {
    const t = transition.inOut3(inverseLerp(.05, 1 - .05, waveform.triangle(tick.time, { f: 1 / 5 })))
    this.objC.matrixAutoUpdate = false
    if (this.useMatrixInterpolation) {
      Transform.lerpMatrixes(
        this.objA.matrix,
        this.objB.matrix,
        t,
        this.objC.matrix,
      )
    } else {
      this.objC.transform.lerpTransforms(
        this.objA.transform,
        this.objB.transform,
        t,
      ).toMatrix(this.objC.matrix)
    }
    this.objC.setColor(this.objA.transform.isDirect() === this.objB.transform.isDirect() ? 'white' : '#ff99ff')
  }
}

function Demo1() {
  useGroup('demo-1', function* (group) {
    setup(new DebugHelper(), group)
      .regularGrid({ size: 8, subdivisions: [2, 4], opacity: [1, .1] })
      .text(0, 'matrix-to-matrix', { color: 'white' })

    const tween = setup(new MyTween(), group)
    tween.objA.setTransform({
      rotation: ['9deg', '0deg', '20deg'],
      shear: [1, 0, 0],
    })
    tween.objB.setTransform({
      scale: [1, -2, .5],
      rotation: ['-10deg', '70deg', 0],
      shear: [0, 1, 0],
    })

    R.setRandom('parkmiller', 1234)
    for (let i = 0; i < 3; i++) {
      for (const sign of [-1, 1] as const) {
        const tween = setup(new MyTween(), group)
        tween.position.y = 4 * (i + 1) * sign
        tween.objA.setTransform({
          position: [R.number(-3, -1), R.number(-1, 1), R.number(-1, 1)],
          scale: [R.number(-1, 1), R.number(-1, 1), R.number(-1, 1)],
          rotation: R.quaternion(),
          shear: [R.number(-1, 1), R.number(-1, 1), R.number(-1, 1)],
        })
        tween.objB.setTransform({
          position: [R.number(1, 3), R.number(-1, 1), R.number(-1, 1)],
          scale: [R.number(-1, 1), R.number(-1, 1), R.number(-1, 1)],
          rotation: R.quaternion(),
          shear: [R.number(-1, 1), R.number(-1, 1), R.number(-1, 1)],
        })
      }
    }
  }, [])

  return null
}
function Demo2() {
  useGroup('demo-2', function* (group) {
    setup(group, { x: 12 })

    setup(new DebugHelper(), group)
      .regularGrid({ size: 8, subdivisions: [2, 4], opacity: [1, .1] })
      .text(0, 'scaleFactor', { color: 'white' })

    const tween = setup(new MyTween(), group)
    tween.objA.setTransform({
      rotation: [0, '-90deg', 0],
    })
    tween.objB.setTransform({
      rotation: [0, '90deg', 0],
      shear: [1, 1, 0],
      scaleFactor: 1.5,
    })
  }, [])

  return null
}

function MyScene() {
  useThreeWebGL(function* (three) {
    three.pipeline.basicPasses.fxaa.enabled = false
  })

  useGroup('my-scene', function* (group, three) {
  }, [])

  return null
}

export function Client() {
  return (
    <ThreeProvider
      vertigoControls={{
        eventTarget: 'canvas',
        size: 8,
        zoom: .75,
        rotation: ['-5deg', '10deg', 0],
        focus: [0, 0, 1.5],
      }}
    >
      <UI />
      <MyScene />
      <Demo1 />
      <Demo2 />
    </ThreeProvider>
  )
}
