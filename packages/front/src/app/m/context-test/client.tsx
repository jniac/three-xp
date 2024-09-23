'use client'

import { EquirectangularReflectionMapping, IcosahedronGeometry, Mesh, MeshPhysicalMaterial, PMREMGenerator } from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

import { ThreeProvider, useThree } from '@/tools/three-provider'

function MyScene() {
  useThree(async function* (three) {
    three.useOrbitControls()

    {
      const mesh = new Mesh(
        new RoundedBoxGeometry(),
        new MeshPhysicalMaterial({
          color: 'indigo',
          clearcoat: .66,
          clearcoatRoughness: .2,
        }),
      )
      three.scene.add(mesh)

      yield three.onTick(tick => {
        mesh.rotation.x += .1 * tick.deltaTime
        mesh.rotation.y += .1 * tick.deltaTime
      })
    }

    {
      const mesh = new Mesh(
        new IcosahedronGeometry(1, 8),
        new MeshPhysicalMaterial({
          roughness: .1,
          metalness: .9,
          color: 'indigo',
          iridescence: .5,
        }),
      )
      mesh.position.set(2, 0, 0)
      three.scene.add(mesh)
    }

    const texture = await three.loader.loadRgbe('https://threejs.org/examples/textures/equirectangular/royal_esplanade_1k.hdr')
    texture.mapping = EquirectangularReflectionMapping
    const pmremGenerator = new PMREMGenerator(three.renderer)
    const env = pmremGenerator.fromEquirectangular(texture)
    pmremGenerator.dispose()
    three.scene.environment = env.texture
  }, 'always')

  return null
}

export default function Client() {
  return (
    <ThreeProvider className='Client absolute-through flex flex-col p-4'>
      <h1>Client</h1>
      <MyScene />
    </ThreeProvider>
  )
}