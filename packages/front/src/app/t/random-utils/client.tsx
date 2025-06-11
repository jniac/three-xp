'use client'
import { Mesh, Quaternion } from 'three'

import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { setup } from 'some-utils-three/utils/tree'
import { onTick } from 'some-utils-ts/ticker'

import { AxesGeometry } from 'some-utils-three/geometries/axis'
import { loop2Array } from 'some-utils-ts/iteration/loop'
import { RandomUtils } from 'some-utils-ts/random/random-utils'
import { ThreeProvider, useThree } from './three-provider'

export function Setup() {
  useThree(function* (three) {
    const geometry = new AxesGeometry()
    for (const it of loop2Array(5, 5)) {
      const mesh = setup(new Mesh(geometry, new AutoLitMaterial({ vertexColors: true })), three.scene)
      mesh.position.set(it.x - 2, it.y - 2, 0)
      mesh.rotation.setFromQuaternion(RandomUtils.quaternion(new Quaternion()))
      mesh.scale.setScalar(0.5)
      yield () => mesh.removeFromParent()
    }

    const controls = new VertigoControls()
    controls
      .initialize(three.renderer.domElement)
      .start()

    yield onTick('three', tick => {
      controls.update(three.camera, three.aspect, tick.deltaTime)
    })
  }, [])
  return null
}

export function Client() {
  return (
    <div className='layer thru'>
      <ThreeProvider>
        <Setup />
      </ThreeProvider>
    </div>
  )
}
