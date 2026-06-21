'use client'

import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { ShaderForge, vec3 } from 'some-utils-three/shader-forge'
import { DebugTexture } from 'some-utils-three/textures/debug'
import { setup } from 'some-utils-three/utils/tree'
import { glsl_stegu_snoise } from 'some-utils-ts/glsl/stegu-snoise'
import { lerp } from 'some-utils-ts/math/basic'
import { BufferAttribute, BufferGeometry, Mesh, MeshBasicMaterial, Shape, Vector2 } from 'three'
import { LeafGeometry } from './LeafGeometry'


function computeUvForFlatGeometry(geometry: BufferGeometry, uvAttributeName = 'uv') {
  const positionAttribute = geometry.getAttribute('position')
  const uvArray = new Float32Array(positionAttribute.count * 2)
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  for (let i = 0; i < positionAttribute.count; i++) {
    const x = positionAttribute.getX(i)
    const y = positionAttribute.getY(i)
    if (x < minX) minX = x
    if (x > maxX) maxX = x
    if (y < minY) minY = y
    if (y > maxY) maxY = y
  }
  const width = maxX - minX
  const height = maxY - minY
  for (let i = 0; i < positionAttribute.count; i++) {
    const x = positionAttribute.getX(i)
    const y = positionAttribute.getY(i)
    uvArray[i * 2 + 0] = (x - minX) / width
    uvArray[i * 2 + 1] = (y - minY) / height
  }
  geometry.setAttribute(uvAttributeName, new BufferAttribute(uvArray, 2))
}

class IvyMaterial extends MeshBasicMaterial {
  constructor() {
    super({
      // wireframe: true,
    })
    this.onBeforeCompile = shader => ShaderForge.with(shader)
      .defines('USE_UV', 'USE_UV2')
      .createVarying('sf_vUv2')
      .fragment.top(
        glsl_stegu_snoise,
      )
      .fragment.after('color_fragment', /* glsl */`
        vec2 uv = vUv;

        diffuseColor.rgb *= vec3(uv.x, uv.y, 1.0);
        float n = fnoise(uv * 4.0, 2) * 0.5 + 0.5;
        diffuseColor.rgb *= vec3(n, n, n);

        // if (sf_vUv2.x < 0.1) discard;

        vec2 center = vec2(0.5, 0.25);
        float dist = length((uv - center) / vec2(1.0, 1.5));
        float alpha = vUv.y + snoise(uv * 1.0) * 0.75;
        alpha = fract(alpha * 3.0);
        diffuseColor.rgb = mix(${vec3('#125112')}, ${vec3('#d0ef61')}, alpha);

        // diffuseColor.rgb = vec3(mod(uv * 10.0, 1.0), 1.0);
      `)
  }
}

class Shape1 extends Shape {
  constructor() {
    super()
    this.moveTo(0, 0)
    this.bezierCurveTo(1, -0.6, 2, -0.2, 2, 0.5)
    this.bezierCurveTo(2, 2, 1, 2, 0, 3)
  }
}

export function MyScene() {
  const three = useThreeWebGL()
  useGroup('my-scene', function* (group) {
    setup(new DebugHelper().regularGrid(), group)

    const shape = new Shape1()

    // setup(new ShapeEditor(shape), group)

    const center = new Vector2(0, 0.5)
    const sideCount = 100
    const sidePoints = shape.getSpacedPoints(sideCount) // contains `sideCount + 1` points, including the first and last point of the shape
    const pointCount =
      1 // center
      + sidePoints.length // right side
      + sidePoints.length - 2 // left side
      + 1 // last point of the left side, which is the same as the first point of the right side, but we need a separate point for the UV mapping.

    const positionArray = new Float32Array(pointCount * 3)
    const uvArray = new Float32Array(pointCount * 2)

    positionArray[0] = center.x
    positionArray[1] = center.y
    positionArray[2] = 0

    uvArray[0] = 0
    uvArray[1] = 0

    for (let i = 0; i <= sideCount; i++) {
      const point = sidePoints[i]
      const off3 = (i + 1) * 3
      positionArray[off3 + 0] = point.x
      positionArray[off3 + 1] = point.y
      positionArray[off3 + 2] = 0

      const off2 = (i + 1) * 2
      uvArray[off2 + 0] = i / sideCount / 2
      uvArray[off2 + 1] = 1
    }

    for (let i = 0; i < sideCount; i++) {
      const point = sidePoints[sideCount - i]
      const off = (sideCount + 1 + i) * 3
      positionArray[off + 0] = -point.x
      positionArray[off + 1] = point.y
      positionArray[off + 2] = 0

      const off2 = (sideCount + 2 + i) * 2
      uvArray[off2 + 0] = (i + sideCount) / sideCount / 2
      uvArray[off2 + 1] = 1
    }

    const triangleCount = sideCount * 2
    const indexArray = new Uint16Array(triangleCount * 3)

    for (let i = 0; i < triangleCount; i++) {
      const off = i * 3
      indexArray[off + 0] = 0
      indexArray[off + 1] = i + 1
      indexArray[off + 2] = i + 2
    }

    const geometry = new BufferGeometry()
    geometry.setAttribute('position', new BufferAttribute(positionArray, 3))
    geometry.setAttribute('uv', new BufferAttribute(uvArray, 2))
    geometry.setIndex(new BufferAttribute(indexArray, 1))
    geometry.computeVertexNormals()
    computeUvForFlatGeometry(geometry, 'uv2')
    setup(new Mesh(geometry, new IvyMaterial()), group)

    {
      const leaf = setup(new Mesh(
        new LeafGeometry(out => {
          const { x, y } = out
          const a = Math.PI * x
          out.x = Math.sin(a) * y
          out.y = Math.cos(a) * lerp(.5, 1, y)
        }),
        new MeshBasicMaterial({ map: new DebugTexture({ checkerColorA: '#404040', checkerColorB: '#646464', lineColor: '#333' }) })
      ), {
        parent: group,
        position: [-4, -2, 0],
      })

      const helper = setup(new DebugHelper(), group).onTop()
      helper.debugGeometry(leaf, { textSize: .1 })
    }

    {
      const shape = new Shape1()
      const geometry = new LeafGeometry(out => {
        const { x, y } = out
        const p = shape.getPointAt(x)
        out.copy(p).multiplyScalar(y)
      }, {
        flipTriangles: true,
      })
      const mesh = setup(new Mesh(geometry, new IvyMaterial()), {
        parent: group,
        position: [0, -4, 0],
      })
      const helper = setup(new DebugHelper(), group).onTop()
      helper.debugGeometry(mesh, { textSize: .1 })
    }

  }, [])
  return null
}

export default function PageClient() {
  return (
    <ThreeProvider
      // webgpu
      vertigoControls={{
        size: 10,
      }}
    >
      <MyScene />
    </ThreeProvider>
  )
}