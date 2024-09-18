import { BufferAttribute, BufferGeometry, Color, ColorRepresentation, Object3D } from 'three'

import { TransformProps, applyTransform } from 'some-utils-three/utils/tranform'

export function addTo<T extends Object3D>(child: T, parent: Object3D, transformProps?: TransformProps): T {
  parent.add(child)
  applyTransform(child, transformProps)
  return child
} export function setvertexColors(geometry: BufferGeometry, colorsArg: ColorRepresentation | ColorRepresentation[], startIndex = 0, endIndex = -1) {
  const colors = Array.isArray(colorsArg)
    ? colorsArg.map(c => new Color(c))
    : [new Color(colorsArg)]

  const count = geometry.attributes.position.count
  const colorsAttribute = new BufferAttribute(new Float32Array(count * 3), 3)
  geometry.setAttribute('color', colorsAttribute)

  const end = endIndex < 0 ? count : endIndex
  for (let i = startIndex; i < end; i++) {
    const color = colors[i % colors.length]
    colorsAttribute.setXYZ(i, color.r, color.g, color.b)
  }
}

