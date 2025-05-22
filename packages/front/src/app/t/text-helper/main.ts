import * as THREE from 'three'
import { Color, FogExp2, Mesh, Object3D, TorusGeometry, Vector3 } from 'three'

import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { ThreeWebGLContext } from 'some-utils-three/contexts/webgl'
import { TextHelper } from 'some-utils-three/helpers/text-helper'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { setup } from 'some-utils-three/utils/tree'
import { loop2 } from 'some-utils-ts/iteration/loop'
import { lerp, remap } from 'some-utils-ts/math/basic'
import { easing } from 'some-utils-ts/math/easing'
import { PRNG } from 'some-utils-ts/random/prng'
import { onTick } from 'some-utils-ts/ticker'

import { leak } from '@/utils/leak'

leak({
  ...THREE,
  THREE,
  textCloud,
  textRing,
  textGrid,
  TextHelper,
})

const colors = [
  new Color('#ff4080'),
  new Color('#ffdd66'),
  new Color('#99ccff'),
]

function textCloud(parent: Object3D) {
  const count = 300_000
  const text = setup(new TextHelper({
    textSize: 5,
    lineLength: 50,
    lineCount: 2,
    textCount: count,
  }), parent)

  const v = new Vector3()
  const letters = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']
  for (let i = 0; i < count; i++) {
    const r = easing.transition.inOut(PRNG.random(), 1 / 4, .9)
    const radius = lerp(70, 190, r) + 20 * PRNG.boxMuller()[0]
    const { x, y, z } = PRNG.unitVector(v).multiplyScalar(radius)
    text.setTextAt(i, `${PRNG.pick(letters)}${PRNG.pick(letters)}${PRNG.pick(letters)}\n${i}`, { x, y, z, color: PRNG.pick(colors) })
  }

  return text
}

function textRing(parent: Object3D) {
  const text = setup(new TextHelper({
    textCount: 3,
    lineLength: 32,
    lineCount: 4,
    // orientation: TextHelper.Orientation.Normal,
  }), parent)
  text.setTextAt(0, ' Hello \n World \n !!! ', {
    y: 0,
    size: 1.5,
    textColor: colors[0],
    textOpacity: 0,
    backgroundColor: colors[0],
    backgroundOpacity: 1,
  })
  text.setTextAt(1, 'À l’âge mûr,\noù l’été s’achève,\nil était déjà prêt.\nNoël, sì! Señor', {
    y: -1.2,
    size: .6,
    textColor: colors[1],
  })
  return text
}

function textGrid(parent: Object3D) {
  const side = 10

  const text = setup(new TextHelper({
    textCount: side * side,
    textSize: 1,
    lineLength: 12,
    // orientation: TextHelper.Orientation.Billboard,
  }), parent)

  for (const it of loop2(side, side)) {
    const str = `${it.i}\n(${it.x}, ${it.y})`
    text.setTextAt(it.i, str, {
      x: (it.px - .5) * side * 2,
      y: (it.py - .5) * side * 2,
    })
  }

  return text
}

function textIcosahedron(parent: Object3D) {
  const sphere = setup(new Mesh(
    new THREE.IcosahedronGeometry(200, 8),
    new THREE.MeshBasicMaterial({ wireframe: true })), parent)
  const { array, count } = sphere.geometry.attributes.position

  const textCount = count / 3
  const text = setup(new TextHelper({
    textCount,
    textSize: 14,
    // orientation: TextHelper.Orientation.Billboard,
  }), parent)
  const v1 = new Vector3()
  const v2 = new Vector3()
  for (let i = 0; i < textCount; i++) {
    const { x, y, z } = v1.fromArray(array, i * 9)
      .add(v2.fromArray(array, i * 9 + 3))
      .add(v2.fromArray(array, i * 9 + 6))
      .divideScalar(3)
    text.setTextAt(i, `${i}`, { x, y, z, color: '#fff', backgroundOpacity: 1, textOpacity: 0 })
  }

  return text
}

export async function* main(three: ThreeWebGLContext) {
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
  })

  let totalTextCount = 0

  const ring = textRing(three.scene)
  totalTextCount += ring.count

  document.body.append(ring.atlas.canvas)
  ring.atlas.canvas.style.position = 'fixed'
  ring.atlas.canvas.style.bottom = '10px'
  ring.atlas.canvas.style.right = '10px'
  ring.atlas.canvas.style.width = `${Math.round(document.body.clientWidth * .2)}px`
  ring.atlas.canvas.onclick = () => ring.atlas.canvas.remove()

  yield () => ring.atlas.canvas.remove()

  const cloud = textCloud(three.scene)
  totalTextCount += cloud.count
  totalTextCount += textIcosahedron(three.scene).count

  ring.setTextAt(2, `text count: ${totalTextCount}`, {
    y: 1,
    size: .6,
    color: '#4080ff',
  })

  setup(new Mesh(new TorusGeometry(3, .1, 12, 128), new AutoLitMaterial({
    color: colors[2],
    // luminosity: 0,
  })), three.scene)
}
