import { Group, Mesh, Scene, TorusGeometry, TorusKnotGeometry } from 'three'

import { SimpleGridHelper } from 'some-utils-three/helpers/grid'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { SkyMesh } from 'some-utils-three/objects/sky-mesh'
import { setup } from 'some-utils-three/utils/tree'
import { Tick } from 'some-utils-ts/ticker'
import { VertigoWidget } from './VertigoWidget'

class Thing extends Group {
  internal = {
    ringGeometry: new TorusGeometry(3, .01, 16, 128),
  }

  parts = (() => {
    // Axis rings:
    const rings = setup(new Group(), { parent: this })
    const ringX = setup(new Mesh(this.internal.ringGeometry, new AutoLitMaterial({ color: '#eb1640', luminosity: .8 })), { parent: rings, name: 'ring-x', rotationY: '90deg' })
    const ringY = setup(new Mesh(this.internal.ringGeometry, new AutoLitMaterial({ color: '#00ff9d', luminosity: .8 })), { parent: rings, name: 'ring-y', rotationX: '90deg' })
    const ringZ = setup(new Mesh(this.internal.ringGeometry, new AutoLitMaterial({ color: '#3b80e7', luminosity: .8 })), { parent: rings, name: 'ring-z' })

    return {
      rings,
      torusKnot: setup(new Mesh(new TorusKnotGeometry(3, .1, 512, 64), new AutoLitMaterial({ luminosity: .8 })), { parent: this, name: 'torus-knot' }),
    }
  })()

  onTick(tick: Tick) {
    this.parts.rings.rotation.y += tick.deltaTime * .123
    this.parts.rings.rotation.x += tick.deltaTime * .435
  }
}

export class VertigoScene extends Scene {
  parts = {
    sky: setup(new SkyMesh({ color: '#027bff' }), { parent: this }),

    // Objects:
    thing: setup(new Thing(), { parent: this }),
    // gridY: setup(new SimpleGridHelper(), { parent: this, rotationX: '90deg' }),
    gridZ: setup(new SimpleGridHelper(), { parent: this }),

    // Widget:
    widget: setup(new VertigoWidget(), { parent: this }),
  }
}
