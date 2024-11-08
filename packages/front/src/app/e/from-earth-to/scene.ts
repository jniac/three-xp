import { AmbientLight, DirectionalLight, Group } from 'three'

import { SimpleGridHelper } from 'some-utils-three/helpers/grid'
import { setup } from 'some-utils-three/utils/tree'

import { Earth } from './earth/earth'
import { Sky } from './sky'

class Lights extends Group {
  parts = {
    ambient: setup(new AmbientLight(0xffffff, 1.5), this),
    directional: setup(new DirectionalLight(0xffffff, 1.5), this),
  }
}

export class Poc1Scene extends Group {
  parts = {
    sky: setup(new Sky(), this),
    earth: setup(new Earth(), this),
    lights: setup(new Lights(), this),
    grid: setup(new SimpleGridHelper({ size: [20, 20] }), { parent: this, visible: false }),

    // unused:
    // contributions: setup(new Contributions(), this),
    // nurbsDemo: setup(new NurbsDemo(), this),
  }
}
