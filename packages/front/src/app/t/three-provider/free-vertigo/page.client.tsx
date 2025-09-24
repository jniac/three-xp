'use client'

import { Mesh, TorusKnotGeometry } from 'three'

import { ThreeProvider, useGroup } from 'some-utils-misc/three-provider'
import { SimpleGridHelper } from 'some-utils-three/helpers/grid'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { setup } from 'some-utils-three/utils/tree'

function MyScene() {
  useGroup('my-scene', function* (group) {
    setup(new Mesh(new TorusKnotGeometry(), new AutoLitMaterial()), group)
    setup(new SimpleGridHelper(), group)
  })
  return null
}

export function PageClient() {
  return (
    <ThreeProvider
      vertigoControls={{
        rotation: '10deg, 30deg, 20deg',
      }}
    >
      <div className='PageClient p-16'>
        <h1 className='mb-4 text-3xl font-bold'>
          Free Vertigo!
        </h1>
        <p>
          Press [alt + Tab] to enable the &quot;free&quot; vertigo control mode.
        </p>
      </div>
      <MyScene />
    </ThreeProvider>
  )
}
