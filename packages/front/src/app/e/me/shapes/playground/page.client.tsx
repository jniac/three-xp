'use client'
import { ExtrudeGeometry, Mesh, MeshBasicMaterial, Shape } from 'three'

import { ThreeProvider, useGroup } from 'some-utils-misc/three-provider'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { ShaderForge } from 'some-utils-three/shader-forge'
import { TransformProps } from 'some-utils-three/utils/transform'
import { setup } from 'some-utils-three/utils/tree'

import { CrossWheelBuilder } from '../cross-wheel'
import { blobSvg } from '../svg/blob.svg'
import { RibbonGeometry } from './geometries/ribbon'
import { SinCurve } from './sin-curve'

function Ribbon(props: TransformProps) {
  useGroup('ribbon', props, function* (group) {
    const sinCurve = new SinCurve({ length: 1, period: 1, offset: 0 })
    const width = .4
    const geometry = new RibbonGeometry(sinCurve, { width, steps: 100 })
    const material = new MeshBasicMaterial({
      wireframe: true,
    })
    setup(new Mesh(geometry, material), group)
    setup(new Mesh(geometry, new MeshBasicMaterial({ opacity: .01, transparent: true })), group)

    setup(new DebugHelper(), group)
      .points(geometry.attributes.position.array as Float32Array, { size: 0.02 })
  }, [])
  return null
}

function MyScene(props: TransformProps) {
  useGroup('my-scene', props, function* (group) {
    const shape = new Shape()
    shape.moveTo(0, -.2)
    shape.lineTo(0, .2)

    const geometry = new ExtrudeGeometry(shape, {
      extrudePath: new SinCurve(),
      steps: 100,
    })
    const material = new MeshBasicMaterial({})
    material.onBeforeCompile = shader => ShaderForge.with(shader)
      .defines('USE_UV')
      .fragment.after('map_fragment', /* glsl */`
        diffuseColor.rg = vUv;
        diffuseColor.b = 1.0;
      `)
    setup(new Mesh(geometry, material), group)

    const sinCurve = new SinCurve()
    console.log(sinCurve.getLength())
    setup(new DebugHelper(), group)
      .points(geometry.attributes.position.array as Float32Array)

  })
  return null
}

export function PageClient() {
  const crossWheel = new CrossWheelBuilder().setTransform({ scale: 300 })
  return (
    <ThreeProvider
      vertigoControls={{}}
      className='bg-[#3a3737]'
    >
      <div className='flex flex-col gap-4 p-16'>
        <h1 className='text-2xl font-bold'>
          Shapes Page
        </h1>

        <svg
          width='400'
          height='400'
          viewBox='-200 -200 400 400'
          style={{ border: '1px solid black' }}
        >
          <g dangerouslySetInnerHTML={{ __html: crossWheel.getSvgHelpers() }} />
          <path
            fill='#ffffff'
            d={crossWheel.getPathData()}
          />
        </svg>

        <div dangerouslySetInnerHTML={{ __html: blobSvg }}></div>

        <MyScene />
        <Ribbon y={-1} />
      </div>
    </ThreeProvider>
  )
}

