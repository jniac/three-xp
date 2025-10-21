'use client'

import { BufferGeometry, Group, IcosahedronGeometry, Mesh, TorusGeometry } from 'three'
import { BufferGeometryUtils } from 'three/examples/jsm/Addons.js'

import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { TransformDeclaration } from 'some-utils-three/declaration'
import { ThreeBaseContext } from 'some-utils-three/experimental/contexts/base'
import { AxesGeometry } from 'some-utils-three/geometries/axis'
import { createBendUniforms, setupShaderForge } from 'some-utils-three/glsl/transform/bend'
import { BoxLineHelper } from 'some-utils-three/helpers/box-line'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { makeMatrix4 } from 'some-utils-three/utils/make'
import { setup } from 'some-utils-three/utils/tree'

function repeat(n: number, geometry: BufferGeometry) {
  return BufferGeometryUtils.mergeGeometries(Array.from({ length: n }, (_, i) => geometry.clone().translate(i, 0, 0)))
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
    const material = new AutoLitMaterial({
      vertexColors: true,
      onBeforeCompile: shader => setupShaderForge(shader, this.uniforms),
    })
    setup(new Mesh(repeat(15, new AxesGeometry({ heightSegments: 16 })), material), this)

    // BoxLineHelper:
    const box = setup(new BoxLineHelper({
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
    const material = new AutoLitMaterial({
      wireframe: true,
      onBeforeCompile: shader => setupShaderForge(shader, this.uniforms),
    })
    setup(new Mesh(repeat(5, baseGeometry), material), { parent: this, x: -5 })
    setup(new Mesh(repeat(5, baseGeometry), material), { parent: this, x: -5, z: -2 })

    const box2 = setup(new BoxLineHelper({
      divisions: 20,
      onBeforeCompile: shader => setupShaderForge(shader, this.uniforms),
    }), { parent: this, ...this.transform })
  }

  *initialize(three: ThreeBaseContext) {
    yield three.ticker.onTick(tick => {
      this.uniforms.uBendFactor.value = Math.sin(tick.time * 1.5)
    })
    return this
  }
}

function MyScene() {
  const three = useThreeWebGL()!
  useGroup('slerp-scene', function* (group) {
    three.pipeline.basicPasses.fxaa.enabled = false

    setup(new DebugHelper(), group)
      .regularGrid()

    setup(yield* new BendAxesDemo()
      .initialize(three), group)

    setup(yield* new BendGeometryDemo()
      .initialize(three), group)

  }, 'always')

  return null
}

export function ClientPage() {
  return (
    <ThreeProvider
      vertigoControls={{
        size: 10,
      }}
    >
      <div className='layer thru p-16'>
        <h1 className='text-4xl font-bold'>
          Vertex Shader - Bend
        </h1>
        <p>
          Demonstration of a vertex bend transformation using Shader Forge.
        </p>
      </div>

      <MyScene />
    </ThreeProvider>
  )
}
