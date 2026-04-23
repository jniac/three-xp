import { Delaunay, Voronoi } from 'd3-delaunay'
import { BufferAttribute, BufferGeometry, Color, ColorRepresentation, Group, Mesh, MeshBasicMaterial, ShaderMaterial, Vector2 } from 'three'

import { DebugHelper } from 'some-utils-three/helpers/debug'
import { ShaderForge } from 'some-utils-three/shader-forge'
import { setup } from 'some-utils-three/utils/tree'
import { fromVector2Declaration, Vector2Declaration } from 'some-utils-ts/declaration'
import { glsl_easings } from 'some-utils-ts/glsl/easings'
import { Rectangle, RectangleDeclaration } from 'some-utils-ts/math/geom/rectangle'

class SmoothVertexColorMaterial extends MeshBasicMaterial {
  constructor() {
    super({ vertexColors: true, side: 2 })
    this.onBeforeCompile = (shader) => ShaderForge.with(shader)
  }
}

function buildBarycentricColorGeometry(
  indexedGeometry: BufferGeometry,
  // vertexColors: Float32Array  // rgb par sommet, indexé comme la géométrie originale
): BufferGeometry {
  const vertexColors = indexedGeometry.attributes.color.array as Float32Array

  const geometry = indexedGeometry.toNonIndexed()
  const positions = geometry.attributes.position
  const numTriangles = positions.count / 3

  const bary = new Float32Array(positions.count * 3)
  const color0 = new Float32Array(positions.count * 3)
  const color1 = new Float32Array(positions.count * 3)
  const color2 = new Float32Array(positions.count * 3)

  // index buffer original pour retrouver les couleurs par sommet
  const index = indexedGeometry.index!.array

  for (let t = 0; t < numTriangles; t++) {
    const i0 = index[t * 3 + 0]
    const i1 = index[t * 3 + 1]
    const i2 = index[t * 3 + 2]

    // couleurs des 3 sommets originaux
    const c0 = vertexColors.slice(i0 * 3, i0 * 3 + 3)
    const c1 = vertexColors.slice(i1 * 3, i1 * 3 + 3)
    const c2 = vertexColors.slice(i2 * 3, i2 * 3 + 3)

    for (let v = 0; v < 3; v++) {
      const base = (t * 3 + v) * 3

      // barycentres
      bary[base + 0] = v === 0 ? 1 : 0
      bary[base + 1] = v === 1 ? 1 : 0
      bary[base + 2] = v === 2 ? 1 : 0

      // triplet complet répété sur chaque sommet
      color0.set(c0, base)
      color1.set(c1, base)
      color2.set(c2, base)
    }
  }

  geometry.setAttribute('bary', new BufferAttribute(bary, 3))
  geometry.setAttribute('color0', new BufferAttribute(color0, 3))
  geometry.setAttribute('color1', new BufferAttribute(color1, 3))
  geometry.setAttribute('color2', new BufferAttribute(color2, 3))

  return geometry
}

class VoronoiBarycentricGradientMaterial extends ShaderMaterial {
  constructor() {
    super({
      vertexShader: /* glsl */`
        attribute vec3 bary;    // (1,0,0) | (0,1,0) | (0,0,1)
        attribute vec3 color0;  // couleur sommet 0 du triangle (répétée 3x)
        attribute vec3 color1;  // couleur sommet 1 du triangle (répétée 3x)
        attribute vec3 color2;  // couleur sommet 2 du triangle (répétée 3x)

        varying vec3 vBary;
        varying vec3 vColor0;
        varying vec3 vColor1;
        varying vec3 vColor2;

        void main() {
          vBary   = bary;
          vColor0 = color0;
          vColor1 = color1;
          vColor2 = color2;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */`
        ${glsl_easings}
        varying vec3 vBary;
        varying vec3 vColor0;
        varying vec3 vColor1;
        varying vec3 vColor2;

        vec3 smootherstep3(vec3 b) {
          return b * b * b * (b * (b * 6.0 - 15.0) + 10.0);
        }

        vec3 easeInOut(vec3 v, float p, float i) {
          return vec3(
            easeInOut(v.x, p, i),
            easeInOut(v.y, p, i),
            easeInOut(v.z, p, i));
        }

        void main() {
          // vec3 bs = smootherstep3(vBary);
          vec3 bs = easeInOut(vBary, 3.0, 0.5);  // ajuster l'exposant pour contrôler la "force" du gradient
          bs /= bs.x + bs.y + bs.z;

          vec3 color = bs.x * vColor0 + bs.y * vColor1 + bs.z * vColor2;
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      vertexColors: true,
      side: 2,
    })
  }
}

export class VoronoiDiagram extends Group {
  parts = {
    helper: setup(new DebugHelper().onTop(), this),
    mesh: setup(new Mesh(new BufferGeometry(), new VoronoiBarycentricGradientMaterial()), this),
  }

  #state = {
    rect: new Rectangle(),
    baseSites: <Vector2[]>[],
    baseSiteBarycenter: new Vector2(),
    baseColors: <Color[]>[],
    extraSites: <Vector2[]>[],
    delaunay: <Delaunay<Delaunay.Point> | null>null,
    voronoi: <Voronoi<Delaunay.Point> | null>null,
  }

  constructor(rectArg: RectangleDeclaration = [0, 0, 10, 10]) {
    super()
    this.#state.rect.from(rectArg)
  }

  setRect(rectArg: RectangleDeclaration) {
    this.#state.rect.from(rectArg)
  }

  setBaseSites(value: Vector2Declaration[]): this {
    const baseSites = value.map(v => fromVector2Declaration(v))

    const { baseSiteBarycenter, rect } = this.#state

    baseSiteBarycenter.set(0, 0)
    baseSites.forEach(site => baseSiteBarycenter.add(site))
    baseSiteBarycenter.multiplyScalar(1 / baseSites.length)

    const extraSites = <Vector2[]>[]
    const outerRect = rect.clone().inflate(1)

    Object.assign(this.#state, {
      baseSites,
      extraSites,
    })

    return this
  }

  setColors(colors: ColorRepresentation[]): this {
    this.#state.baseColors = this.#state.baseSites.map((_, i) => new Color(colors[i % colors.length]))
    return this
  }

  compute() {
    const delaunay = Delaunay.from(this.#state.baseSites.map(site => [site.x, site.y]))
    const { minX, minY, maxX, maxY } = this.#state.rect
    const voronoi = delaunay.voronoi([minX, minY, maxX, maxY])
    this.#state.delaunay = delaunay
    this.#state.voronoi = voronoi

    {
      const colors = [
        '#f00', '#6f0', '#03f', '#ff0', '#3ff', '#f0f',
        '#f09', '#0f9', '#60f', '#fc0', '#0cf', '#90f',
      ]
      const { triangles, points } = delaunay
      const pointCount = points.length / 2
      const pointArray = new Float32Array(points.length * 3)
      const colorArray = new Float32Array(points.length * 3)
      const color = new Color()
      for (let i = 0; i < pointCount; i++) {
        pointArray[i * 3 + 0] = points[i * 2 + 0]
        pointArray[i * 3 + 1] = points[i * 2 + 1]
        pointArray[i * 3 + 2] = 0
        color.set(colors[i % colors.length])
        colorArray[i * 3 + 0] = color.r
        colorArray[i * 3 + 1] = color.g
        colorArray[i * 3 + 2] = color.b
      }

      const geometry = new BufferGeometry()
      geometry.setAttribute('position', new BufferAttribute(pointArray, 3))
      geometry.setAttribute('color', new BufferAttribute(colorArray, 3))
      geometry.setIndex(new BufferAttribute(triangles, 1))
      this.parts.mesh.geometry = buildBarycentricColorGeometry(geometry)
    }

    this.draw()
  }

  draw() {
    const { baseSites, delaunay, voronoi } = this.#state

    if (!delaunay || !voronoi)
      return

    const { points, halfedges, triangles } = delaunay
    const { helper } = this.parts

    helper.clear()
    // helper.rect(this.#state.rect)
    // helper.points(this.#state.baseSites)
    // helper.visible = false

    for (const i of delaunay.hull) {
      const p = new Vector2().fromArray(points, i * 2)
      // helper.point(p, { color: '#f0f', shape: 'ring-thin', size: .5 })
    }

    helper.point(this.#state.baseSiteBarycenter, { color: '#0ff', shape: 'plus', size: .5 })
    for (let i = 0; i < triangles.length; i += 3) {
      const a = new Vector2().fromArray(points, triangles[i] * 2)
      const b = new Vector2().fromArray(points, triangles[i + 1] * 2)
      const c = new Vector2().fromArray(points, triangles[i + 2] * 2)

      // helper.debugTriangle([a, b, c])
      helper.polygon([a, b, c], { color: '#fff' })
    }

    for (let i = 0; i < baseSites.length; i++) {
      const cell = voronoi.cellPolygon(i)
      // helper.polygon(cell, { color: '#ff0' })
    }
  }
}