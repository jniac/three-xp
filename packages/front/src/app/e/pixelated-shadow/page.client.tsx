'use client'
import { BufferGeometry, Camera, Group, Material, Mesh, MeshBasicMaterial, NearestFilter, Object3D, Scene, Texture, TorusGeometry, Vector2, Vector3, Vector4, WebGLRenderer, WebGLRenderTarget } from 'three'

import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { ShapeExtrusionGeometry } from 'some-utils-three/experimental/geometry/extrusion'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { ShaderForge } from 'some-utils-three/shader-forge'
import { makeMatrix4 } from 'some-utils-three/utils/make'
import { setup } from 'some-utils-three/utils/tree'
import { TickPhase } from 'some-utils-ts/ticker'

class StrangeMaterial extends MeshBasicMaterial {
  uniforms = {
    uResolution: { value: new Vector4() },
    uLightSource: { value: new Vector3(2, 4, 1) },
    uPixelatedShadowMap: { value: null as Texture | null },
  }
  constructor(props: ConstructorParameters<typeof MeshBasicMaterial>[0]) {
    super(props)
    this.onBeforeCompile = shader => ShaderForge.with(shader)
      .uniforms(this.uniforms)
      .createVarying('sf_vWorldNormal')
      .fragment.top(/* glsl */`
        float checker(vec2 point, vec2 checkerSize, vec2 checkerOffset) {
          vec2 shiftedPoint = point + checkerOffset;
          vec2 gridCoord = shiftedPoint / checkerSize;
          vec2 gridPos = floor(gridCoord);
          return mod(gridPos.x + gridPos.y, 2.0);
        }
        float checker(vec2 point, vec2 checkerSize) {
          return checker(point, checkerSize, vec2(0.0));
        }
      `)
      .fragment.after('color_fragment', /* glsl */`
        vec2 uv = gl_FragCoord.xy / uResolution.xy;
        float shadow = texture2D(uPixelatedShadowMap, uv).r;
        diffuseColor.rgb *= shadow;
        // float light = dot(normalize(sf_vWorldNormal), normalize(uLightSource)) * 0.5 + 0.5;
        // diffuseColor.rgb = vec3(light);
        // diffuseColor.rgb = vec3(checker(gl_FragCoord.xy, vec2(16.0), vec2(0.0, 0.0)));
      `)
  }

  onBeforeRender(renderer: WebGLRenderer, scene: Scene, camera: Camera, geometry: BufferGeometry, object: Object3D, group: Group): void {
    this.uniforms.uResolution.value.set(renderer.domElement.width, renderer.domElement.height, 0, 0)
  }
}

class StrangeGeometry extends ShapeExtrusionGeometry {
  constructor() {
    super({
      shape: function* (count: number) {
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2
          const x = Math.cos(angle) * .5
          const y = Math.sin(angle) * .5
          yield new Vector2(x, y)
        }
      },
      shapeLength: 96,
      shapeIsClosed: true,

      path: function* (count: number) {
        for (let i = 0; i < count; i++) {
          const t = i / (count - 1)
          const angle = t * Math.PI * 4
          const x = Math.cos(angle)
          const y = Math.sin(angle)
          const z = -(1 - (1 - t) ** 2) * 1.5
          const scale = (1 - t) * 1.5
          yield makeMatrix4({ x, y, z, scale, rotationX: Math.PI / 2, rotationZ: angle, rotationOrder: 'ZYX' })
        }
      },
      pathLength: 96 * 2 + 1,
      pathIsClosed: false,
    })
  }
}

export function MyScene() {
  const three = useThreeWebGL()
  useGroup('my-scene', function* (group) {
    setup(new DebugHelper().regularGrid(), group)

    const materialForPixelatedRender = new AutoLitMaterial({ side: 2, shadowColor: '#009' })
    const strangeMaterial = new StrangeMaterial({ side: 2 })
    const mesh = setup(new Mesh(new StrangeGeometry(), materialForPixelatedRender as Material), group)

    const tileSize = 32
    const rt = new WebGLRenderTarget(three.width / tileSize, three.height / tileSize)
    rt.texture.minFilter = NearestFilter
    rt.texture.magFilter = NearestFilter
    strangeMaterial.uniforms.uPixelatedShadowMap.value = rt.texture

    yield three.ticker.onTick({ phase: TickPhase.BeforeRender }, () => {
      three.renderer.setRenderTarget(rt)
      three.renderer.clear()
      mesh.material = materialForPixelatedRender
      three.renderer.render(mesh, three.camera)
      three.renderer.setRenderTarget(null)

      mesh.material = strangeMaterial
    })

    setup(new Mesh(
      new TorusGeometry(2, .25, 64, 128).rotateX(Math.PI / 2),
      new AutoLitMaterial({ side: 1, color: '#ff0' }),
    ), {
      parent: group,
      position: [-2, 0, 0],
    })
  }, [])
  return null
}

export default function PageClient() {
  return (
    <ThreeProvider
      vertigoControls={{
        size: 10,
      }}
    >
      <MyScene />
    </ThreeProvider>
  )
}