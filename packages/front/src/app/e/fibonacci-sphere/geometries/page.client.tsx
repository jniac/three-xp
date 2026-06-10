'use client'

import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { setup } from 'some-utils-three/utils/tree'

import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { Mesh } from 'three'
import { EnvRoom } from '../EnvRoom'
import { geometries } from '../FibonacciSphereInstance.geometries'

export function MyScene() {
  const three = useThreeWebGL()
  useGroup('my-scene', function* (group) {
    setup(new DebugHelper().regularGrid({ color: 'white' }), group)

    const helper = setup(new DebugHelper(), group)

    const entries = Object.entries(geometries)
    for (const [index, [name, geometry]] of entries.entries()) {
      const x = (index - (entries.length - 1) / 2) * 1.2
      setup(new Mesh(geometry(), new AutoLitMaterial()), {
        parent: group,
        position: [x, 0, 0],
      })
      helper.text([x, -1, 0], name, { size: .2, color: 'white' })
    }

    const env = setup(new EnvRoom(), group)
    env.applyToSceneOnce(three.scene, three.renderer)
    env.children.forEach((c, i) => c.visible = i === 0)
    env.scale.setScalar(4);
    (env.children[0] as any).material.color.set('#ccc')
  }, [])
  return null
}

export default function PageClient() {
  return (
    <ThreeProvider
      vertigoControls={{
        size: 5,
      }}
    >
      <MyScene />
    </ThreeProvider>
  )
}