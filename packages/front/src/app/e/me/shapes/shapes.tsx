'use client'
import { SVGLoader } from 'three/examples/jsm/Addons.js'

import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { setup } from 'some-utils-three/utils/tree'

import { ShaderForge } from 'some-utils-three/shader-forge'
import { BufferGeometry, Color, Mesh, MeshBasicMaterial, ShapeGeometry } from 'three'
import { ResponsiveProvider } from '../responsive'
import { CrossWheelBuilder } from './cross-wheel'
import { blobSvg } from './svg/blob.svg'

const svgLoader = new SVGLoader()

function svgToGeometry(svg: string, {
  scale = 1 / 200,
  align = .5 as null | number,
} = {}): BufferGeometry {
  const parsed = svgLoader.parse(svg)
  const geometry = new ShapeGeometry(parsed.paths[0].toShapes(true))
    .scale(scale, scale, scale)
  if (align !== null) {
    geometry.center()
  }
  return geometry
}

function pathDataToGeometry(pathData: string): BufferGeometry {
  const parsed = svgLoader.parse(/* xml */`
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="-1 -1 2 2">
      <path d="${pathData}" fill="none" stroke="black" stroke-width="0.01"/>
    </svg>`
  )
  return new ShapeGeometry(parsed.paths[0].toShapes(true))
}

function MyScene() {
  const three = useThreeWebGL()

  useGroup('my-scene', function* (group) {
    three.scene.background = new Color('#f0f0f0')
    setup(new DebugHelper(), group)
      .regularGrid()

    const crossWheel = new CrossWheelBuilder()
    const pathData = crossWheel.getPathData()

    const material = new MeshBasicMaterial({ color: 'red' })
    material.onBeforeCompile = shader => ShaderForge.with(shader)
      .defines('USE_UV')
      .fragment.after('map_fragment', /* glsl */`
        // diffuseColor.rg = vUv;
      `)

    const geometry = pathDataToGeometry(pathData)
    const wheel = setup(new Mesh(svgToGeometry(blobSvg), material), group)
    wheel.scale.setScalar(2)
  })

  return null
}

export function ShapesPage() {
  return (
    <ResponsiveProvider>
      <ThreeProvider
        vertigoControls={{
        }}
        fullscreenKey={{ key: 'f', modifiers: 'shift' }}
      >
        <h1 className='text-2xl font-bold'>
          Shapes Page
        </h1>

        <MyScene />

      </ThreeProvider>
    </ResponsiveProvider >
  )
}