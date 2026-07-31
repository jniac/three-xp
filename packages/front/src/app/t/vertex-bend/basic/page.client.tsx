'use client'

import { BoxGeometry, BufferGeometry, Group, IcosahedronGeometry, InstancedMesh, Mesh, MeshBasicMaterial, MeshBasicMaterialParameters, TorusGeometry } from 'three'
import { BufferGeometryUtils } from 'three/examples/jsm/Addons.js'

import { InspectorView } from 'some-utils-misc/inspector'
import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { useEffects } from 'some-utils-react/hooks/effects'
import { TransformDeclaration } from 'some-utils-three/declaration'
import { ThreeBaseContext } from 'some-utils-three/experimental/contexts/base'
import { AxesGeometry } from 'some-utils-three/geometries/axis'
import { createBendUniforms, glsl_bend, glsl_bend_project_vertex, setupShaderForge } from 'some-utils-three/glsl/transform/bend'
import { BoxLineHelper } from 'some-utils-three/helpers/box-line'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { ShaderForge } from 'some-utils-three/shader-forge/index'
import { makeMatrix4 } from 'some-utils-three/utils/make'
import { setup } from 'some-utils-three/utils/tree'
import { loop2 } from 'some-utils-ts/iteration/loop'
import { Message } from 'some-utils-ts/message'
import { deepAssign } from 'some-utils-ts/object/deep'

function repeat(n: number, geometry: BufferGeometry) {
  return BufferGeometryUtils.mergeGeometries(Array.from({ length: n }, (_, i) => geometry.clone().translate(i, 0, 0)))
}

class BendAutoLitMaterial extends MeshBasicMaterial {
  uniforms: Record<string, { value: any }>
  constructor(
    bendUniforms: ReturnType<typeof createBendUniforms>,
    params?: MeshBasicMaterialParameters & Partial<{ depthOffset: number }>,
  ) {
    const {
      depthOffset = 0,
      ...superParams
    } = { ...params }
    super({
      side: 2,
      ...superParams,
    })
    this.uniforms = {
      ...bendUniforms,
      uDepthOffset: { value: depthOffset },
    }
    this.onBeforeCompile = shader => ShaderForge.with(shader)
      .uniforms(this.uniforms)
      .varying({
        'sf_vWorldNormal': 'vec3',
      })
      .vertex.top(glsl_bend)
      .vertex.replace('project_vertex', glsl_bend_project_vertex)
      .vertex.mainAfterAll(/* glsl */`
        sf_vWorldNormal = normalize(bendNormal);

        gl_Position.w += uDepthOffset;
      `)
      .fragment.after('map_fragment', /* glsl */`
        float sunLight = dot(normalize(vec3(1, 3, 2)), sf_vWorldNormal) * 0.5 + 0.5;
        diffuseColor.rgb *= sunLight;
      `)
  }

  static #now = Date.now()
  customProgramCacheKey(): string {
    return `BendAutoLitMaterial-${BendAutoLitMaterial.#now}`
  }
}

class BendAxesDemo extends Group {
  transform: TransformDeclaration = {
    x: 2,
    rotationY: '-30deg',
  }

  uniforms = createBendUniforms(makeMatrix4(this.transform))
  uniforms2 = createBendUniforms(makeMatrix4({ x: -2 }))

  constructor() {
    super()

    // Axes:
    const material = new BendAutoLitMaterial(this.uniforms, {
      vertexColors: true,
    })
    setup(new Mesh(repeat(15, new AxesGeometry({ heightSegments: 16 })), material), this)

    // BoxLineHelper:
    setup(new BoxLineHelper({
      divisions: 20,
      onBeforeCompile: shader => setupShaderForge(shader, this.uniforms),
    }), {
      parent: this,
      ...this.transform,
    })
  }

  *initialize(three: ThreeBaseContext) {
    yield three.ticker.onTick(tick => {
      this.uniforms.uBendFactor.value = 0.5 + 0.5 * Math.sin(tick.time * 1.5)
      this.uniforms2.uBendFactor.value = Math.PI / 4
    })
    return this
  }
}

class BendGeometryDemo extends Group {
  transform: TransformDeclaration = {
    x: -2,
    rotationY: '20deg',
  }
  uniforms = createBendUniforms(makeMatrix4(this.transform))

  constructor() {
    super()
    const baseGeometry = BufferGeometryUtils.mergeGeometries([
      new IcosahedronGeometry(0.25, 3),
      new TorusGeometry(.5, .25, 16, 32).rotateY(Math.PI / 2).translate(.5, 0, 0).toNonIndexed(),
    ])
    setup(new Mesh(
      repeat(5, baseGeometry),
      new BendAutoLitMaterial(this.uniforms, {
        wireframe: true,
        color: '#ddd',
        depthOffset: 0.00001,
      })),
      { parent: this, x: -5 })

    setup(new Mesh(
      repeat(5, baseGeometry),
      new BendAutoLitMaterial(this.uniforms, {})),
      { parent: this, x: -5 })

    const box2 = setup(new BoxLineHelper({
      divisions: 20,
      onBeforeCompile: shader => setupShaderForge(shader, this.uniforms),
    }), { parent: this, ...this.transform })
  }
}

class BendInstanceDemo extends Group {
  transform: TransformDeclaration = {
    y: -5,
    rotationY: '20deg',
  }

  uniforms = createBendUniforms(makeMatrix4(this.transform))

  constructor() {
    super()
    const geometry = new BoxGeometry(1, 1, 1, 8, 8, 8)

    const squareSide = 5
    const mesh = setup(new InstancedMesh(
      geometry,
      new BendAutoLitMaterial(this.uniforms),
      squareSide * squareSide
    ), {
      parent: this,
      y: -5,
    })

    const wireMesh = setup(new InstancedMesh(
      geometry,
      new BendAutoLitMaterial(this.uniforms, {
        wireframe: true,
        color: '#ddd',
        depthOffset: 0.0001,
      }),
      squareSide * squareSide
    ), {
      parent: this,
      y: -5,
    })

    const dim = squareSide / 2
    for (const it of loop2(squareSide, squareSide)) {
      const m = makeMatrix4({
        x: it.lerpX(-dim, dim),
        z: it.lerpY(-dim, dim),
      })
      mesh.setMatrixAt(it.i, m)
      wireMesh.setMatrixAt(it.i, m)
    }

    // BoxLineHelper:
    setup(new BoxLineHelper({
      divisions: 20,
      onBeforeCompile: shader => setupShaderForge(shader, this.uniforms),
    }), {
      parent: this,
      ...this.transform,
    })
  }
}

class MyState {
  animate = true
  static bendFactor = {
    type: `
      number
      slider(-1, 1)
    `,
    description: `
      Bend factor for the vertex bend transformation (in radians).
    `,
  }
  bendFactor = 0
}

function MyScene() {
  const three = useThreeWebGL()!
  useGroup('slerp-scene', function* (group) {
    setup(new DebugHelper(), group)
      .regularGrid()

    setup(new BendAxesDemo(), group)
    setup(new BendGeometryDemo(), group)
    setup(new BendInstanceDemo(), group)

    const state = new MyState()
    yield Message.exposeInstance(MyState, state)

    let time = 0
    yield three.ticker.onTick(tick => {
      if (state.animate) {
        time += tick.deltaTime
        state.bendFactor = Math.sin(time * 1.5)
      }

      for (const child of group.children) {
        if (child instanceof BendAxesDemo || child instanceof BendGeometryDemo || child instanceof BendInstanceDemo) {
          child.uniforms.uBendFactor.value = state.bendFactor
        }
      }
    })

  }, 'always')

  return null
}

function MyUI() {
  const { ref } = useEffects<HTMLDivElement>(async function* (div) {
    const state = await Message.waitForInstance(MyState)
    const inspector = new InspectorView({ header: { title: 'Vertex Bend Demo' } })
    div.replaceChildren(inspector.div)
    inspector.generateFields(state, MyState)
    inspector.onAnyChange((key, value) => {
      deepAssign(state, { [key]: value })
      if (key === 'bendFactor') {
        state.animate = false
      }
    })
  }, [])
  return (
    <div
      ref={ref}
      className='p-4 border rounded border-white/20 bg-black/20 backdrop-blur-lg w-fit'
    ></div>
  )
}

export function ClientPage() {
  return (
    <ThreeProvider
      vertigoControls={{
        size: 14,
        rotation: `-30deg, 30deg, 0deg`,
      }}
    >
      <div className='layer thru flex flex-col items-start p-16 gap-2'>
        <h1 className='text-4xl font-bold'>
          Vertex Shader - Bend
        </h1>
        <p>
          Demonstration of a bend transformation implemented in the vertex shader.
        </p>
        <ul>
          <li>✅ Position 😅</li>
          <li>✅ Normal 👍</li>
          <li>✅ Instancing & Batching 👍</li>
        </ul>
        <MyUI />
      </div>

      <MyScene />
    </ThreeProvider>
  )
}
