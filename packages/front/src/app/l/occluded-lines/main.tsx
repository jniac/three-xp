'use client'

import { DoubleSide, Group, IcosahedronGeometry, InstancedBufferAttribute, InstancedMesh, Mesh, MeshBasicMaterial, PlaneGeometry, TorusKnotGeometry } from 'three'

import { ThreeAndEditorProvider, useThree } from 'some-three-editor/editor-provider'
import { LineHelper } from 'some-utils-three/helpers/line'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { ShaderForge } from 'some-utils-three/shader-forge'
import { makeColor, makeMatrix4 } from 'some-utils-three/utils/make'
import { setup } from 'some-utils-three/utils/tree'
import { loop2 } from 'some-utils-ts/iteration/loop'
import { PRNG } from 'some-utils-ts/random/prng'

class DepthOffsetTest extends Group {
  constructor() {
    super()

    {
      setup(new Mesh(
        new IcosahedronGeometry(1, 12),
        new AutoLitMaterial(),
      ), this)

      setup(new Mesh(
        new TorusKnotGeometry(2, .1, 256, 16),
        new AutoLitMaterial({ color: 'red' }),
      ), this)
    }

    const col = 5
    const row = 5
    const count = col * row
    const aRand = new InstancedBufferAttribute(new Float32Array(count * 4), 4)

    const geometry = new PlaneGeometry()
    geometry.setAttribute('aRand', aRand)
    const material = new MeshBasicMaterial({ side: DoubleSide })
    material.onBeforeCompile = shader => ShaderForge.with(shader)
      .vertex.top(/* glsl */`
        attribute vec4 aRand;
      `)
      .vertex.after('project_vertex', /* glsl */`
        gl_Position.z += aRand.x * .1;
      `)

    const mesh = setup(new InstancedMesh(geometry, material, count), this)

    PRNG.reset()
    const colors = Array.from({ length: count }, () => PRNG.random() * 0xffffff)
    for (const it of loop2(col, row)) {
      const x = (it.tx - .5) * (col - 1)
      const y = (it.ty - .5) * (row - 1)
      const z = (it.tx + it.ty) * .4
      mesh.setMatrixAt(it.i, makeMatrix4({ x, y, z, scaleScalar: 1.25 }))
      mesh.setColorAt(it.i, makeColor(PRNG.pick(colors)))
      aRand.setXYZW(it.i, PRNG.random(), PRNG.random(), PRNG.random(), PRNG.random())
    }
  }
}

function Scene() {
  useThree(function* (three) {
    const sphere = setup(
      new Mesh(
        new IcosahedronGeometry(1, 4),
        new AutoLitMaterial({ color: 'red' }),
      ), three.scene)

    const lines = setup(new LineHelper(), three.scene)
    lines
      .box({ size: 2 })
      .draw()
    lines
      .showOccludedLines()
  }, [])

  return null
}

export function Main() {
  return (
    <ThreeAndEditorProvider>
      <Scene />
    </ThreeAndEditorProvider>
  )
}
