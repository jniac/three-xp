import { Mesh, TorusKnotGeometry } from 'three'

import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { setup } from 'some-utils-three/utils/tree'

import { useGroup } from './three-provider'

export function FractalGrid() {
  useGroup('fractal-grid', function* (group) {
    setup(new Mesh(
      new TorusKnotGeometry(1, .333, 512, 32),
      new AutoLitMaterial({ color: '#0cf' })), group)
  }, [])

  return null
}
