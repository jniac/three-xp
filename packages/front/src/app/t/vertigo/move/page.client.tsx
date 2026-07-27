'use client'
import { BufferGeometry, Camera, Group, Mesh, MeshBasicMaterial, Object3D, Scene, TorusGeometry, Vector2, Vector3, Vector4, WebGLRenderer } from 'three'
import { Font } from 'three/addons/loaders/FontLoader.js'
import { TTFLoader } from 'three/addons/loaders/TTFLoader.js'
import { TextGeometry } from 'three/examples/jsm/Addons.js'

import { ThreeProvider, useGroup } from 'some-utils-misc/three-provider'
import { useEffects } from 'some-utils-react/hooks/effects'
import { ShapeExtrusionGeometry } from 'some-utils-three/experimental/geometry/extrusion'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { makeMatrix4 } from 'some-utils-three/utils/make'
import { setup } from 'some-utils-three/utils/tree'
import { Message } from 'some-utils-ts/message'

import { config } from '@/config'
import { AutolitMaterial } from '@/misc/env-room/materials/autolit'
import { ShaderForge } from 'some-utils-three/shader-forge'

class StrangeMaterial extends MeshBasicMaterial {
  uniforms = {
    uResolution: { value: new Vector4() },
    uLightSource: { value: new Vector3(2, 4, 1) },
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
        float light = dot(normalize(sf_vWorldNormal), normalize(uLightSource)) * 0.5 + 0.5;
        float c = checker(gl_FragCoord.xy, vec2(16.0));
        diffuseColor.rgb = vec3(light * mix(0.0, 1.0, c));
      `)
  }

  onBeforeRender(renderer: WebGLRenderer, scene: Scene, camera: Camera, geometry: BufferGeometry, object: Object3D, group: Group): void {
    this.uniforms.uResolution.value.set(renderer.domElement.width, renderer.domElement.height, 0, 0)
  }
}

function MyScene() {
  useGroup('my-scene', async function* (group, three) {
    setup(new DebugHelper(), group)
      .regularGrid()

    const json = await new TTFLoader().loadAsync(config.assets(`/fonts/SpecialGothicCondensedOne-Regular.ttf`))
    const geometry = new TextGeometry('MOVE', {
      font: new Font(json),
      size: 4,
      depth: 0,
    })
    setup(new Mesh(geometry, new AutolitMaterial({ side: 2 })), {
      parent: group,
      y: 1,
    })
    setup(new Mesh(geometry, new AutolitMaterial({ side: 2, color: '#ff0' })), {
      parent: group,
      position: [-10, -5, 0],
    })
    setup(new Mesh(new TorusGeometry(2, 1, 64, 128), new AutolitMaterial({ side: 1, color: '#ff0' })), {
      parent: group,
      position: [0, 0, -2.05],
    })

    setup(new DebugHelper(), group)
      .points([
        [4, 4],
        [4, 0],
        [4, -4],
        [0, -4],
        [-4, -4],
        [-4, 0],
        [-4, 4],
        [0, 4],
      ], { color: '#ff0', size: .5 })

    {
      const geometry = new ShapeExtrusionGeometry({
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

      setup(new Mesh(geometry, new StrangeMaterial({ side: 2 })), group)
    }
  }, [])
  return null
}

function WebConsole() {
  const { ref } = useEffects<HTMLDivElement>(function* (div) {
    const lines = div.querySelectorAll('div')
    yield Message.on<string>('WEBCONSOLE', /LINE:/, message => {
      const lineIndex = Number.parseInt(message.type.split(':')[1], 10)
      lines[lineIndex].textContent = message.assertPayload()
    })
  }, [])
  return (
    <div
      ref={ref}
      className='fixed top-0 left-0 p-4 flex flex-col'
    >
      <div />
      <div />
      <div />
    </div>
  )
}

export default function PageClient() {
  return (
    <ThreeProvider
      vertigoControls={{
        size: 8,
      }}
    >
      <div className=''>
        <WebConsole />
      </div>
      <MyScene />
    </ThreeProvider>
  )
}