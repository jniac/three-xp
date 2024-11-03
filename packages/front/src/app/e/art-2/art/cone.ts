import { ConeGeometry, Mesh, MeshBasicMaterial, MeshPhysicalMaterial } from 'three'

import { applyTransform, TransformProps } from 'some-utils-three/utils/transform'

import { colors } from './colors'

export type ConeProps = TransformProps & Partial<typeof Cone.defaultProps>

export class Cone extends Mesh<ConeGeometry, MeshPhysicalMaterial | MeshBasicMaterial> {
  static defaultProps = {
    radius: 1,
    height: 1,
    color: colors.black,
    shaded: false,
    sides: 12,
  }

  constructor(props?: ConeProps) {
    const {
      radius,
      height,
      color,
      sides,
      shaded,
      ...transformProps
    } = { ...Cone.defaultProps, ...props }

    const geometry = new ConeGeometry(radius, height, sides)
    const material = shaded
      ? new MeshPhysicalMaterial({ color })
      : new MeshBasicMaterial({ color })

    super(geometry, material)

    applyTransform(this, transformProps)
  }
}