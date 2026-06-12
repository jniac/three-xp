import { Mesh, TorusKnotGeometry } from 'three'

import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { setup } from 'some-utils-three/utils/tree'

import { EnvRoom } from '@/misc/EnvRoom'

export class MyEnv extends EnvRoom {
  constructor() {
    super({ textureSize: 2048 })

    setup(new Mesh(
      new TorusKnotGeometry(4, .5, 128, 16),
      new AutoLitMaterial({ color: 'rgb(255, 0, 255)', shadowColor: '#000' }),
    ), this)

    setup(new Mesh(
      new TorusKnotGeometry(4, .5, 128, 16),
      new AutoLitMaterial({ color: 'rgb(2, 0, 37)', shadowColor: '#000' }),
    ), {
      parent: this,
      rotation: '0deg, 90deg, 0deg',
    })
  }
}