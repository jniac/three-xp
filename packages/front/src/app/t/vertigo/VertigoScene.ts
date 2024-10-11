import { Group, Mesh, Scene, TorusGeometry, TorusKnotGeometry } from 'three'

import { SimpleGridHelper } from 'some-utils-three/helpers/grid'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { SkyMesh } from 'some-utils-three/objects/sky-mesh'
import { setup } from 'some-utils-three/utils/tree'
import { Tick } from 'some-utils-ts/ticker'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { VertigoWidget } from './VertigoWidget'

class Thing extends Group {
  internal = {
    ringGeometry: new TorusGeometry(1, .01, 16, 128),
  }

  parts = {
    cube: setup(new Mesh(new RoundedBoxGeometry(1, 1, 1, 12, .1), new AutoLitMaterial({ luminosity: .8 })), { parent: this }),
    torusKnot: setup(new Mesh(new TorusKnotGeometry(1.1, .1, 512, 64), new AutoLitMaterial({ luminosity: .8 })), { parent: this }),

    // Axis rings:
    ringX: setup(new Mesh(this.internal.ringGeometry, new AutoLitMaterial({ color: '#eb1640', luminosity: .8 })), { parent: this, rotationY: '90deg' }),
    ringY: setup(new Mesh(this.internal.ringGeometry, new AutoLitMaterial({ color: '#00ff9d', luminosity: .8 })), { parent: this, rotationX: '90deg' }),
    ringZ: setup(new Mesh(this.internal.ringGeometry, new AutoLitMaterial({ color: '#3b80e7', luminosity: .8 })), { parent: this }),
  }

  onTick(tick: Tick) {
    this.parts.cube.rotation.x += .2 * tick.deltaTime
    this.parts.cube.rotation.y += .2 * tick.deltaTime
  }
}

export class VertigoScene extends Scene {
  parts = {
    sky: setup(new SkyMesh({ color: '#007bff' }), { parent: this }),

    // Objects:
    thing: setup(new Thing(), { parent: this, x: -4 }),
    gridY: setup(new SimpleGridHelper(), { parent: this, rotationX: '90deg' }),
    gridZ: setup(new SimpleGridHelper(), { parent: this }),

    // Widget:
    widget: setup(new VertigoWidget(), { parent: this }),
  }
}
