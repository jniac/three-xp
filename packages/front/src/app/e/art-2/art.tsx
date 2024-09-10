'use client'

import { IcosahedronGeometry, Mesh, MeshBasicMaterial } from 'three'

import { Billboard } from '@/components/billboard'

import { BasicThreeProvider, Three, UseThree } from '@/tools/three/webgl'

function* art(three: Three) {
  const mesh = new Mesh(
    new IcosahedronGeometry(1, 3),
    new MeshBasicMaterial({ color: 0x00ff00, wireframe: true }))
  three.scene.add(mesh)
  yield () => mesh.removeFromParent()
}

export function Art() {
  return (
    <div className='wraps'>
      <Billboard>
        <BasicThreeProvider>
          <UseThree fn={art} />
        </BasicThreeProvider>
      </Billboard>
    </div>
  )
}