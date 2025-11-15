'use client'
import { BufferGeometry, CircleGeometry, Color, Group, Mesh, MeshBasicMaterial, PlaneGeometry, RingGeometry, ShapeGeometry, Vector3 } from 'three'
import { SVGLoader } from 'three/examples/jsm/Addons.js'

import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { setup } from 'some-utils-three/utils/tree'
import { positiveModulo } from 'some-utils-ts/math/basic'
import { Tick } from 'some-utils-ts/ticker'

import { ResponsiveProvider } from '../responsive'
import { CrossWheelBuilder } from './cross-wheel'
import { StrokeGeometry } from './playground/geometries/stroke'
import { SinCurve } from './playground/sin-curve'

const svgLoader = new SVGLoader()

function svgToGeometry(svg: string, {
  scale = 1 / 200,
  align = .5 as null | number,
} = {}): BufferGeometry {
  const parsed = svgLoader.parse(svg)
  const geometry = new ShapeGeometry(parsed.paths[0].toShapes(true))
    .scale(scale, scale, scale)
  if (align !== null) {
    geometry.computeBoundingBox()
    const { min, max } = geometry.boundingBox!
    const offsetX = - (min.x + (max.x - min.x) * align)
    const offsetY = - (min.y + (max.y - min.y) * align)
    geometry.translate(offsetX, offsetY, 0)
  }
  return geometry
}

const colors = {
  yellow: '#ffeb61',
  lightGrey: '#d9d9d9',
  mediumGrey: '#6b6b6b',
  cyan: '#5bfff7',
  blue: '#1706ff',
}

function pathDataToGeometry(pathData: string, options?: Parameters<typeof svgToGeometry>[1]): BufferGeometry {
  const str = /* xml */`
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="-1 -1 2 2">
      <path d="${pathData}"/>
    </svg>
  `
  return svgToGeometry(str, options)
}

class SpinningWheel extends Group {
  static defaultParams = {
    armLength: 8,
    thickness: .005,
    wheelRadius: .5,
  }

  params = { ...SpinningWheel.defaultParams }

  parts = (() => {
    const {
      armLength: al,
      thickness: th,
      wheelRadius: wr,
    } = this.params

    const material = new MeshBasicMaterial({ color: colors.mediumGrey })

    const arm = setup(new Mesh(new PlaneGeometry(al, th).translate(-al / 2, 0, 0), material), this)
    arm.position.set(
      al * Math.SQRT1_2,
      al * Math.SQRT1_2,
      0)
    arm.rotation.z = Math.PI / 4

    const ring = setup(new Mesh(new RingGeometry(wr - th / 2, wr + th / 2, 96), material), this)
    const line = setup(new Mesh(new PlaneGeometry(wr * 2, th), material), ring)
    line.rotation.z = Math.PI / 2
    const centralPin = setup(new Mesh(new CircleGeometry(.03, 32), material), ring)
    const externalPin = setup(new Mesh(new CircleGeometry(.06, 32), material), ring)
    externalPin.position.set(-wr, 0, 0)

    return { arm, ring, line, centralPin, externalPin }
  })()

  state = {
    pinWorldPosition: new Vector3(),
  }

  get pinWorldPosition() {
    this.parts.externalPin.getWorldPosition(this.state.pinWorldPosition)
    return this.state.pinWorldPosition
  }

  onTick(tick: Tick) {
    const { ring } = this.parts
    const drz = -2 * tick.deltaTime
    const rz = positiveModulo(ring.rotation.z + drz, Math.PI * 2)
    ring.rotation.z = rz
  }
}

class CrossWheel extends Group {
  parts = (() => {
    const pathData = new CrossWheelBuilder().getPathData()
    const material = new MeshBasicMaterial({ color: colors.yellow })
    const geometry = pathDataToGeometry(pathData, { scale: 1 })
    const mesh = setup(new Mesh(geometry, material), this)
    mesh.renderOrder = 2
    return { mesh }
  })()

  state = {
    worldPosition: new Vector3(),
    worldPinDelta: new Vector3(),
  }

  updateFromPinPosition(pinPosition: Vector3) {
    const { worldPosition, worldPinDelta } = this.state
    this.getWorldPosition(worldPosition)
    worldPinDelta.subVectors(pinPosition, worldPosition)
    if (worldPinDelta.length() < .5) {
      this.rotation.z = Math.atan2(worldPinDelta.y, worldPinDelta.x) - Math.PI / 2
    }
  }
}

class SinConnection extends Group {
  params = {
    outerLength: 3,
    innerLength: .2,
  }

  parts = (() => {
    const {
      outerLength: ol,
      innerLength: il,
    } = this.params

    const curve1 = new SinCurve({ amplitude: .1, length: ol, period: ol, zCosineAmplitude: 0 })
    const geometry1 = new StrokeGeometry(curve1, { width: .3, steps: 100 })
    const material1 = new MeshBasicMaterial({ color: colors.cyan })
    const mesh1 = setup(new Mesh(geometry1, material1), this)
    mesh1.renderOrder = -1

    const curve2 = new SinCurve({ amplitude: .1, length: il, period: il, offset: 0, zCosineAmplitude: 0 })
    const geometry2 = new StrokeGeometry(curve2, { width: .2, steps: 100 })
    const material2 = new MeshBasicMaterial({ color: colors.blue })
    const mesh2 = setup(new Mesh(geometry2, material2), this)
    mesh2.renderOrder = -1

    return { mesh1, mesh2, curve1, curve2, geometry1, geometry2 }
  })()

  onTick(tick: Tick) {
    this.parts.curve2.params.offset = tick.time % (this.params.outerLength - this.params.innerLength)
    this.parts.geometry2.update()
  }
}

function MyScene() {
  const three = useThreeWebGL()

  useGroup('my-scene', function* (group) {
    three.scene.background = new Color('#f0f0f0')
    three.ticker.set({ inactivityWaitDurationMinimum: 30 })

    setup(new DebugHelper(), group)
    // .regularGrid({ color: 'red' })

    const sinConnection = setup(new SinConnection(), group)

    const crossWheel = setup(new CrossWheel(), group)
    const spinningWheel = setup(new SpinningWheel(), group)
    spinningWheel.position.set(.5, -.5, 0)

    yield three.ticker.onTick(tick => {
      crossWheel.updateFromPinPosition(spinningWheel.pinWorldPosition)
    })
  })

  return null
}

export function ShapesPage() {
  return (
    <ResponsiveProvider>
      <ThreeProvider
        vertigoControls={{
          size: 3
        }}
        fullscreenKey={{ key: 'f', modifiers: 'shift' }}
      >
        <h1 className='text-2xl font-bold'>
          Shapes Page
        </h1>

        <MyScene />

      </ThreeProvider>
    </ResponsiveProvider >
  )
}