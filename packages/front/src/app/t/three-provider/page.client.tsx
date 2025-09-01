'use client'

import { ThreeProvider, useGroup } from 'some-utils-misc/three-provider'
import { SimpleGridHelper } from 'some-utils-three/helpers/grid'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { setup } from 'some-utils-three/utils/tree'
import { Mesh, TorusKnotGeometry } from 'three'

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
        <h1>Page Client</h1>
        <p>
          Press [alt + Tab] to enable the &quot;free&quot; vertigo control mode.
        </p>
      </div>
      <MyScene />
    </ThreeProvider>
  )
}
