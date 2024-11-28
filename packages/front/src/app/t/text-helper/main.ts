import { Color, FogExp2, IcosahedronGeometry, Mesh, MeshBasicMaterial, TorusGeometry, Vector3 } from 'three'

import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { ThreeWebglContext } from 'some-utils-three/contexts/webgl'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { setup } from 'some-utils-three/utils/tree'
import { lerp, remap } from 'some-utils-ts/math/basic'
import { easing } from 'some-utils-ts/math/easing'
import { PRNG } from 'some-utils-ts/random/prng'
import { onTick } from 'some-utils-ts/ticker'

import { leak } from '@/utils/leak'
import { TextHelper } from './point-text-helper'

const colors = [
  new Color('#ff4080'),
  new Color('#ffdd66'),
  new Color('#99ccff'),
]

export function* main(three: ThreeWebglContext) {
  yield () => three.scene.clear()

  PRNG.reset()

  const skyColor = new Color('#09121b')
  const fog = new FogExp2(skyColor, 0.05)
  three.scene.fog = fog
  three.scene.background = skyColor

  const controls = new VertigoControls({
    size: 7,
  })
    .initialize(three.renderer.domElement)
    .start()

  yield onTick('three', tick => {
    controls.update(three.camera, three.aspect, tick.deltaTime)
    fog.density = remap(controls.vertigo.zoom, 1, 0, .05, 0)
    controls.vertigo.zoom
  })

  let totalTextCount = 0

  const th1 = setup(new TextHelper({
    textCount: 3,
    // lineLength: 32,
    // lineCount: 4,
    orientation: TextHelper.Orientation.Normal,
  }), three.scene)
  th1.setTextAt(0, 'Hello, World!!!', { y: 0, color: colors[0] })
  th1.setTextAt(2, 'À l’âge mûr, où l’été s’achève, il était déjà prêt.\nNoël, sì! Señor', { y: -.7, color: colors[1] })
  totalTextCount += th1.options.textCount

  {
    const sphere = setup(new Mesh(
      new IcosahedronGeometry(200, 8),
      new MeshBasicMaterial({ wireframe: true })), three.scene)
    const { array, count } = sphere.geometry.attributes.position
    const textCount = count / 3

    const th2 = setup(new TextHelper({
      textCount,
      textSize: 14,
      orientation: TextHelper.Orientation.Billboard,
    }), three.scene)
    const v1 = new Vector3()
    const v2 = new Vector3()
    for (let i = 0; i < textCount; i++) {
      const { x, y, z } = v1.fromArray(array, i * 9)
        .add(v2.fromArray(array, i * 9 + 3))
        .add(v2.fromArray(array, i * 9 + 6))
        .divideScalar(3)
      th2.setTextAt(i, `${i}`, { x, y, z, color: '#fff' })
    }
    totalTextCount += th2.options.textCount
  }

  {
    const count = 100000
    const th3 = setup(new TextHelper({
      textSize: 5,
      textCount: count,
      // lineCount: 3,
    }), three.scene)
    const v = new Vector3()
    const letters = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']
    for (let i = 0; i < count; i++) {
      const r = easing.transition.inOut(PRNG.random(), 1 / 4, .9)
      const radius = lerp(20, 200, r)
      const { x, y, z } = PRNG.unitVector(v).multiplyScalar(radius)
      th3.setTextAt(i, `${PRNG.pick(letters)}${PRNG.pick(letters)}${PRNG.pick(letters)}\n${i}`, { x, y, z, color: PRNG.pick(colors) })
    }
    totalTextCount += th3.options.textCount
  }

  th1.setTextAt(1, `text count: ${totalTextCount}`, { y: .7, color: '#4080ff' })
  console.log(th1.getDataStringView())

  setup(new Mesh(new TorusGeometry(3, .1), new AutoLitMaterial({
    color: colors[2],
    // luminosity: 0,
  })), three.scene)

  leak({
    three,
    controls,
    th1,
  })
}
