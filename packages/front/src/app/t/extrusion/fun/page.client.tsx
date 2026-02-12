'use client'

import { BufferGeometry, Mesh, Vector2 } from 'three'

import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { TransformDeclaration } from 'some-utils-three/declaration'
import { ShapeExtrusionGeometry } from 'some-utils-three/experimental/geometry/extrusion'
import { SimpleGridHelper } from 'some-utils-three/helpers/grid'
import { AutoLitMaterial, AutoLitMaterialOptions } from 'some-utils-three/materials/auto-lit'
import { DebugTexture } from 'some-utils-three/textures/debug'
import { makeMatrix4 } from 'some-utils-three/utils/make'
import { setup } from 'some-utils-three/utils/tree'
import { LinearPath2 } from 'some-utils-ts/math/geom/linear-path2'
import { Message } from 'some-utils-ts/message'

import { Leak } from '@/utils/leak'

const vertigo1 = { "perspective": 1, "fov": "45deg", "zoom": 0.888552878044383, "focus": [4.26990383807376, 4.984143743965297, -0.8004934645984162], "size": [3, 3], "before": 1000, "after": 1000, "rotation": ["59.93139deg", "35.86716deg", "0deg", "YXZ"], "frame": 1, "allowOrthographic": true, "fovEpsilon": "1.5deg", "nearMin": 0.1 }
const vertigo2 = { "perspective": 1, "fov": "45deg", "zoom": 1.1843022077225456, "focus": [5.444539899422887, 3.675529986706148, 3.13829145938467], "size": [2.2, 2.2], "before": 1000, "after": 1000, "rotation": ["48.12845deg", "33.80451deg", "0deg", "YXZ"], "frame": 1, "allowOrthographic": true, "fovEpsilon": "1.5deg", "nearMin": 0.1 }
const vertigo3 = { "perspective": 1, "fov": "45deg", "zoom": 0.5268612811021551, "focus": [4.62201115183092, 5.269751720806973, 0.9035543491349773], "size": [2.2, 2.2], "before": 1000, "after": 1000, "rotation": ["44.6907deg", "163.8659deg", "0deg", "YXZ"], "frame": 1, "allowOrthographic": true, "fovEpsilon": "1.5deg", "nearMin": 0.1 }
const vertigo4 = { "perspective": 1, "fov": "45deg", "zoom": 0.8623372619632357, "focus": [4.751566265323569, 5.144587669036351, 1.3993783040882384], "size": [2.2, 2.2], "before": 1000, "after": 1000, "rotation": ["56.72281deg", "103.7053deg", "0deg", "YXZ"], "frame": 1, "allowOrthographic": true, "fovEpsilon": "1.5deg", "nearMin": 0.1 }

function MyScene() {
  const three = useThreeWebGL()
  three.pipeline.basicPasses.fxaa.enabled = false

  const controls = Message.requireInstanceOrThrow(VertigoControls)
  // controls.vertigo.fromDeclaration(vertigo4)

  useGroup('my-scene', function* (group) {
    // three.scene.fog = new FogExp2('rgb(255, 255, 255)', 0.035)
    three.scene.fog = null

    const doubleMesh = (
      transform: TransformDeclaration,
      geometry: BufferGeometry,
      bothProps?: AutoLitMaterialOptions,
      frontProps?: AutoLitMaterialOptions,
      backProps?: AutoLitMaterialOptions,
    ) => {
      const frontMesh = setup(new Mesh(geometry, new AutoLitMaterial({
        side: 0,
        ...bothProps,
        ...frontProps,
      })), { parent: group, ...transform })

      const backMesh = setup(new Mesh(geometry, new AutoLitMaterial({
        side: 1,
        ...bothProps,
        ...backProps,
      })), { parent: group, ...transform })

      return [frontMesh, backMesh]
    }



    // SCENE CONTENT HERE:

    setup(new SimpleGridHelper({ size: 128, color: 'hsl(0, 0%, 86%)', opacity: .1 }), {
      parent: group,
      // z: 1,
      visible: false,
    })

    {
      // Spiral extrusion test
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

      doubleMesh({ x: 4, y: 4, z: 1.75, rotationY: '0deg' }, geometry, {},
        { color: 'rgb(255, 118, 207)' },
        { color: '#0ff' },
      )

      doubleMesh({ x: 4, y: 7, z: 1.75, rotationY: '0deg' }, geometry, {},
        {},
        { color: '#00F' },
      )

      doubleMesh({ x: 4, y: 10, z: 1.75, rotationY: '0deg' }, geometry, {},
        { color: '#ff0' },
        { color: '#fff' },
      )
    }

    {
      // Swirl rounded rectangle extrusion test
      const shape = new LinearPath2([
        new Vector2(-.5, -.5),
        new Vector2(.5, -.5),
        new Vector2(.5, .5),
        new Vector2(-.5, .5),
      ])
        .roundCorner({ radius: 0.2, resolution: 8 })
        .subdivide({ maxSegmentLength: .025 })
      const geometry = new ShapeExtrusionGeometry({
        shape: shape.points,
        path: function* (count) {
          for (let i = 0; i < count; i++) {
            const t = i / (count - 1)
            yield makeMatrix4({
              z: -t * 8,
              rotationZ: 1 * t * Math.PI * 2,
            })
          }
        },
        pathLength: 60,
      })

      doubleMesh({ position: [.5, 2.5, 0] }, geometry, { color: 'yellow' })
      doubleMesh({ position: [.5, .5, 0] }, geometry)
      doubleMesh({ position: [.5, -1.5, 0] }, geometry, { color: 'yellow' })

      doubleMesh({ position: [-.5, -2.5, 0] }, geometry, { color: 'cyan' })
      doubleMesh({ position: [-.5, -.5, 0] }, geometry)
      doubleMesh({ position: [-.5, 1.5, 0] }, geometry, { color: 'blue' })
    }

    // Only 2 canvas are cached for DebugTexture!
    console.log(`DebugTexture cache size: ${DebugTexture.canvasCacheSize}`)
  }, [])

  return null
}

function UI() {
  return (
    <div className={`layer thru p-8 flex flex-col gap-1 items-start`}>
      <h1 className='text-2xl font-bold'>
        t/extrusion
      </h1>
    </div>
  )
}

export function Client() {
  return (
    <ThreeProvider
      vertigoControls={{
        size: 2.2,
      }}
    >
      <Leak {...{
        LinearPath2,
      }} />
      <MyScene />
      <UI />
    </ThreeProvider>
  )
}
