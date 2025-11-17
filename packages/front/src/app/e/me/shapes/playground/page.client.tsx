'use client'
import { ExtrudeGeometry, Mesh, MeshBasicMaterial, PlaneGeometry, Shape } from 'three'

import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { ShaderForge } from 'some-utils-three/shader-forge'
import { DebugTexture } from 'some-utils-three/textures/debug'
import { TransformProps } from 'some-utils-three/utils/transform'
import { setup } from 'some-utils-three/utils/tree'
import { onTick } from 'some-utils-ts/ticker'

import { CrossWheelBuilder } from '../cross-wheel'
import { blobSvg } from '../svg/blob.svg'
import { StrokeGeometry } from './geometries/stroke'
import { SinCurve } from './sin-curve'

function PathStroke(props: TransformProps) {
  useGroup('path-stroke', props, function* (group) {
    {
      const sinCurve = new SinCurve({ length: 5, frequency: 2, offset: 0 })
      const width = .3
      const geometry = new StrokeGeometry(sinCurve, { width, steps: 300 })
      const material = new MeshBasicMaterial({
        color: '#fff'
      })
      setup(new Mesh(geometry, material), {
        parent: group,
        x: 0,
      })
    }

    {
      const sinCurve = new SinCurve({ length: 1, frequency: 2, offset: 1 })
      const width = .2
      const geometry = new StrokeGeometry(sinCurve, { width, steps: 100 })
      const material = new MeshBasicMaterial({
        color: '#0ff'
      })
      material.onBeforeCompile = shader => ShaderForge.with(shader)
        .vertex.mainAfterAll(/* glsl */`
          gl_Position.z += -0.1;
        `)
      setup(new Mesh(geometry, material), group)
      yield onTick(tick => {
        sinCurve.params.offset += tick.deltaTime * .5
        sinCurve.params.offset = (Math.sin(tick.time) * .5 + .5) * 4
        geometry.update()
      })
    }

    {
      const sinCurve = new SinCurve({ length: 1, frequency: 1 })
      const width = .5
      const geometry = new StrokeGeometry(sinCurve, { width, steps: 100 })
      const material = new MeshBasicMaterial({
        map: new DebugTexture(),
      })
      setup(new Mesh(geometry, material), { parent: group, y: -1 })
    }

    {
      const sinCurve = new SinCurve({ length: 4, frequency: 1 / 4 })
      const width = .5
      const geometry = new StrokeGeometry(sinCurve, { width, steps: 100 })
      const material = new MeshBasicMaterial({
        map: new DebugTexture(),
      })
      setup(new Mesh(geometry, material), { parent: group, y: -2 })
    }

    {
      setup(new Mesh(
        new PlaneGeometry(),
        new MeshBasicMaterial({ map: new DebugTexture() }),
      ), { parent: group, x: -1 })
    }
  }, [])
  return null
}

function MyScene(props: TransformProps) {
  const three = useThreeWebGL()

  useGroup('my-scene', props, function* (group) {
    three.pipeline.basicPasses.fxaa.enabled = false

    setup(new DebugHelper(), group)
      .regularGrid()

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
  })
  return null
}

export function PageClient() {
  const crossWheel = new CrossWheelBuilder().setTransform({ scale: 300 })
  return (
    <ThreeProvider
      vertigoControls={{

      }}
      // className='bg-[#3a3737]'
      className='bg-[#8bc6bc]'
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
        <PathStroke y={-1} />
      </div>
    </ThreeProvider>
  )
}

