'use client'

import { BackSide, BoxGeometry, Mesh, MeshBasicMaterial, SphereGeometry } from 'three'

import { ThreeProvider, useGroup } from 'some-utils-misc/three-provider'
import { SimpleGridHelper } from 'some-utils-three/helpers/grid'
import { anyLoader } from 'some-utils-three/loaders/any-loader'
import { setup } from 'some-utils-three/utils/tree'

function MyScene() {
  useGroup('my-scene', function* (group) {
    setup(new Mesh(
      new SphereGeometry(100, 32, 16),
      new MeshBasicMaterial({
        color: '#242424',
        side: BackSide,
      }),
    ), { parent: group })

    setup(new SimpleGridHelper(), group)
    setup(new Mesh(
      new BoxGeometry(1, 1, .2),
      new MeshBasicMaterial({
        map: anyLoader.loadTexture('/assets/textures/color-debug.png'),
      })
    ), group)

    setup(new Mesh(
      new BoxGeometry(1, 1, .2),
      new MeshBasicMaterial({
        map: anyLoader.loadTexture('/assets/textures/Card-Verso-MB-Test.jpg'),
      })
    ), {
      parent: group,
      position: [1.2, 0, 0],
    })

    document.body.style.backgroundColor = '#222222'
  })
  return null
}

export function PageClient() {
  return (
    <ThreeProvider
      vertigoControls={{

      }}
    >
      <div className='PageClient p-16'>
        <h1 className='mb-4 text-3xl font-bold'>
          Color test
        </h1>
        <p>
          Looks like the textures are correctly interpreted.
        </p>
      </div>
      <MyScene />
    </ThreeProvider>
  )
}
