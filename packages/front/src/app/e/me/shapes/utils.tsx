import { BufferGeometry, ShapeGeometry } from 'three'
import { SVGLoader } from 'three/examples/jsm/Addons.js'

const svgLoader = new SVGLoader()

export function svgToGeometry(svg: string, {
  scale = 1 / 200, align = .5 as null | number,
} = {}): BufferGeometry {
  const parsed = svgLoader.parse(svg)
  const geometry = new ShapeGeometry(parsed.paths[0].toShapes(true))
    .scale(scale, scale, scale)
  if (align !== null) {
    geometry.computeBoundingBox()
    const { min, max } = geometry.boundingBox!
    const offsetX = -(min.x + (max.x - min.x) * align)
    const offsetY = -(min.y + (max.y - min.y) * align)
    geometry.translate(offsetX, offsetY, 0)
  }
  return geometry
}

export function pathDataToGeometry(pathData: string, options?: Parameters<typeof svgToGeometry>[1]): BufferGeometry {
  const str = /* xml */ `
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="-1 -1 2 2">
      <path d="${pathData}"/>
    </svg>
  `
  return svgToGeometry(str, options)
}
