import { IcosahedronGeometry, Mesh, MeshBasicMaterial, Vector3 } from 'three'

import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { ThreeWebglContext } from 'some-utils-three/contexts/webgl'
import { setup } from 'some-utils-three/utils/tree'
import { onTick } from 'some-utils-ts/ticker'

import { makeColor, makeMatrix4 } from 'some-utils-three/utils/make'
import { PRNG } from 'some-utils-ts/random/prng'
import { TextHelper } from '../text-helper'
import { fetchHunger } from './fetch-hunger'

export async function* main(three: ThreeWebglContext) {
  const controls = new VertigoControls({
    size: 100,
  })
    .initialize(three.renderer.domElement)
    .start()

  yield onTick('three', tick => {
    controls.update(three.camera, three.aspect, tick.deltaTime)
  })

  const data = await fetchHunger()

  document.querySelector('#instance-count')!.textContent = data.metadata.textCount.toString()

  const text = new TextHelper({
    textCount: data.metadata.textCount,
    lineCount: data.metadata.lineCount,
    lineLength: data.metadata.lineLength,
    textSize: 1.2,
  })
  text.setData(data)

  const position = new Vector3()
  for (let i = 0, max = data.metadata.textCount; i < max; i++) {
    PRNG.unitVector3(position)
    position.multiplyScalar(30 + 5 * PRNG.boxMuller()[0])
    text.setMatrixAt(i, makeMatrix4({ position }))
    text.setColorAt(i, makeColor(PRNG.random() * 0xffffff))
  }
  setup(text, three.scene)

  setup(new Mesh(
    new IcosahedronGeometry(),
    new MeshBasicMaterial({ wireframe: true })
  ), three.scene)

  yield () => three.scene.clear()
}