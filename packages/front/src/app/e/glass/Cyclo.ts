import { Group, Mesh, MeshPhysicalMaterial } from 'three'

import { SmoothBoxGeometry } from 'some-utils-three/geometries/SmoothBoxGeometry'
import { ShaderForge } from 'some-utils-three/shader-forge'
import { setup } from 'some-utils-three/utils/tree'

class CycloWallMaterial extends MeshPhysicalMaterial {
  constructor() {
    super({ side: 1 })
    this.onBeforeCompile = shader => ShaderForge.with(shader)
      .createVarying('sf_vObjectPosition')
      .fragment.mainBeforeAll(/* glsl */`
        if (sf_vObjectPosition.z > 0.0) {
          discard;
        }
      `)
  }
}

export class Cyclo extends Group {
  parts = (() => {
    return {
      cube: setup(new Mesh(
        new SmoothBoxGeometry(1, 1, 1, 8, .2, 5),
        new MeshPhysicalMaterial({})), {
        name: 'Cube',
        parent: this,
        y: -0.5,
      }),
      walls: setup(new Mesh(
        new SmoothBoxGeometry(10, 10, 10, 9, 1, 2),
        new CycloWallMaterial()), {
        name: 'Walls',
        parent: this,
        y: 4,
      }),
    }
  })();
}
