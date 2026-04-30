'use client'

import { BufferAttribute, BufferGeometry, CylinderGeometry, Mesh, PlaneGeometry, TorusKnotGeometry, Vector2 } from 'three'

import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { TransformDeclaration } from 'some-utils-three/declaration'
import { extrudeShapeAlongPath, ShapeExtrusionGeometry } from 'some-utils-three/experimental/geometry/extrusion'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { SimpleGridHelper } from 'some-utils-three/helpers/grid'
import { AutoLitMaterial, AutoLitMaterialOptions } from 'some-utils-three/materials/auto-lit'
import { DebugTexture } from 'some-utils-three/textures/debug'
import { makeMatrix4 } from 'some-utils-three/utils/make'
import { setup } from 'some-utils-three/utils/tree'
import { LinearPath2 } from 'some-utils-ts/math/geom/linear-path2'

import { Leak } from '@/utils/leak'
import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { ShaderForge } from 'some-utils-three/shader-forge'
import { Message } from 'some-utils-ts/message'

const vertigo1 = '{"perspective":1,"fov":"45deg","zoom":0.888552878044383,"focus":[4.26990383807376,4.984143743965297,-0.8004934645984162],"size":[3,3],"before":1000,"after":1000,"rotation":["59.93139deg","35.86716deg","0deg","YXZ"],"frame":1,"allowOrthographic":true,"fovEpsilon":"1.5deg","nearMin":0.1}'

function MyScene() {
  const three = useThreeWebGL()

  const controls = Message.requireInstanceOrThrow(VertigoControls)
  // controls.vertigo.fromJsonDeclaration(vertigo1)

  useGroup('my-scene', function* (group) {
    // three.scene.fog = new FogExp2('rgb(255, 255, 255)', 0.035)
    three.scene.fog = null

    const doubleMesh = (
      transform: TransformDeclaration,
      geometry: BufferGeometry,
      frontProps?: AutoLitMaterialOptions,
      backProps?: AutoLitMaterialOptions,
    ) => {
      const frontMesh = setup(new Mesh(geometry, new AutoLitMaterial({
        side: 0,
        ...frontProps,
      })), { parent: group, ...transform })

      const backMesh = setup(new Mesh(geometry, new AutoLitMaterial({
        side: 1,
        ...backProps,
      })), { parent: group, ...transform })

      return [frontMesh, backMesh]
    }

    setup(new SimpleGridHelper({ size: 128, color: 'hsl(0, 0%, 86%)' }), {
      parent: group,
      z: -1,
    })
    setup(new Mesh(new TorusKnotGeometry(1, .5, 256, 64), new AutoLitMaterial({ map: new DebugTexture() })), { parent: group, x: -2 })

    setup(new Mesh(new PlaneGeometry(), new AutoLitMaterial({
      map: new DebugTexture(),
    }),), { parent: group, x: 2, visible: false })

    {
      // Cylinder ref
      const geometry = new CylinderGeometry(1, 1, 2, 64, 1, true).rotateX(Math.PI / 2)
      setup(new Mesh(geometry, new AutoLitMaterial({
        side: 2,
      })), {
        parent: group,
        position: [-3, -3]
      })
    }

    {
      const SHAPE_RESOLUTION = 96
      const geometry = new ShapeExtrusionGeometry({
        shape: function* () {
          for (let i = 0; i < SHAPE_RESOLUTION; i++) {
            const angle = (i / SHAPE_RESOLUTION) * Math.PI * 2
            const x = Math.cos(angle) * 0.5 + 0.5
            const y = Math.sin(angle) * 0.5 + 0.5
            yield new Vector2(x, y)
          }
        },
        shapeLength: SHAPE_RESOLUTION,
        shapeIsClosed: true,

        path: 2,
      })
      const mesh = setup(new Mesh(geometry, new AutoLitMaterial({
        map: new DebugTexture(),
        side: 2,
      })), {
        parent: group,
      })

      const helper = setup(new DebugHelper(), mesh)
      helper.debugGeometry(geometry)
    }

    {
      // Normal flipping test
      const circle = new LinearPath2<Vector2>().setAsCircle({ radius: 1 }, Vector2)

      doubleMesh({ x: -6 }, new ShapeExtrusionGeometry({
        shape: circle.points,
        shapeIsClosed: true,
        path: 1,
      }))

      doubleMesh({ x: -6, y: 2 }, new ShapeExtrusionGeometry({
        shape: circle.points,
        shapeIsClosed: true,
        path: -1,
      }), undefined, { color: 'cyan' })
    }

    {
      // Open shape test
      const geometry = new ShapeExtrusionGeometry({
        shape: function* (count) {
          for (let i = 0; i < count; i++) {
            const t = i / (count - 1)
            const a = (t * .5 + .5) * Math.PI * 2
            const x = Math.cos(a) * 0.5 + 0.5
            const y = Math.sin(a) * 0.5 + 0.5
            yield new Vector2(x, y)
          }
        },
        shapeLength: 32,
        shapeIsClosed: false,
        path: 2,
      })
      setup(new Mesh(geometry, new AutoLitMaterial({
        map: new DebugTexture(),
      })), { x: 2, y: -2, parent: group, })
      setup(new Mesh(geometry, new AutoLitMaterial({
        map: new DebugTexture(),
        side: 1,
        color: 'cyan',
      })), { x: 2, y: -2, parent: group, })
    }

    {
      // Torus extrusion test
      const result = extrudeShapeAlongPath({
        shape: function* (count: number) {
          for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2
            const x = Math.cos(angle) * 0.5 + 0.5
            const y = Math.sin(angle) * 0.5 + 0.5
            yield new Vector2(x, y)
          }
        },
        shapeLength: 96,
        shapeIsClosed: true,

        path: function* (count: number) {
          for (let i = 0; i < count; i++) {
            const t = i / count
            const angle = t * Math.PI * 2
            const x = Math.cos(angle)
            const y = Math.sin(angle)
            yield makeMatrix4({ x, y, rotationX: Math.PI / 2, rotationZ: angle, rotationOrder: 'ZYX' })
          }
        },
        pathLength: 96,
        pathIsClosed: true,
      })

      const geometry = new BufferGeometry()
      geometry.setAttribute('position', new BufferAttribute(result.position, 3))
      geometry.setAttribute('normal', new BufferAttribute(result.normal, 3))
      geometry.setAttribute('uv', new BufferAttribute(result.uv, 2))
      geometry.setIndex(new BufferAttribute(result.index, 1))

      const torusMesh = setup(new Mesh(geometry, new AutoLitMaterial({
        map: new DebugTexture(),
        side: 2,
      })), {
        y: 4,
        parent: group,
      })

      const torusMesh2 = setup(torusMesh.clone(), group)
      torusMesh2.position.x = -4
      torusMesh2.material = torusMesh.material.clone()
      torusMesh2.material.map = new DebugTexture({ checkerColorB: 'yellow' })
    }

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

      doubleMesh({ x: 4, y: 4, z: -.5, rotationY: '0deg', scale: .95 },
        geometry,
        {},
        {
          color: 'rgb(255, 118, 207)',
        }
      )
    }

    {
      // Elbow shaped extrusion test
      const SHAPE_RESOLUTION = 12
      const result = extrudeShapeAlongPath({
        shape: function* () {
          for (let i = 0; i < SHAPE_RESOLUTION; i++) {
            const angle = (i / SHAPE_RESOLUTION) * Math.PI * 2
            const x = Math.cos(angle) * 0.5 + 0.5
            const y = Math.sin(angle) * 0.5 + 0.5
            yield new Vector2(x, y)
          }
        },
        shapeLength: SHAPE_RESOLUTION,
        shapeIsClosed: true,

        path: function* () {
          yield makeMatrix4({})
          yield makeMatrix4({ z: 2, rotationY: Math.PI / 4 })
          yield makeMatrix4({ x: 2, z: 2, rotationY: Math.PI / 2 })
        },
        pathLength: 3,
        pathIsClosed: false,
      })

      const geometry = new BufferGeometry()
      geometry.setAttribute('position', new BufferAttribute(result.position, 3))
      geometry.setAttribute('normal', new BufferAttribute(result.normal, 3))
      geometry.setAttribute('uv', new BufferAttribute(result.uv, 2))
      geometry.setIndex(new BufferAttribute(result.index, 1))

      const mesh = setup(new Mesh(geometry, new AutoLitMaterial({
        map: new DebugTexture(),
        side: 2,
      })), {
        parent: group,
        y: -2,
      })

      const helper = setup(new DebugHelper(), mesh)
      helper.debugGeometry(geometry)
    }

    {
      // Rounded rectangle extrusion test
      const shape = new LinearPath2([
        new Vector2(0, 0),
        new Vector2(1, 0),
        new Vector2(1, 1),
        new Vector2(0, 1),
      ])
      shape.roundCorner({ radius: 0.2, resolution: 8 })
      const geometry = new ShapeExtrusionGeometry({
        shape: shape.points,
        path: -2,
      })
      setup(new Mesh(geometry, new AutoLitMaterial({
        map: new DebugTexture(),
        side: 0,
      })), { parent: group, position: [2, 2, 0] })
      setup(new Mesh(geometry, new AutoLitMaterial({
        color: 'yellow',
        map: new DebugTexture(),
        side: 1,
      })), { parent: group, position: [2, 2, 0] })
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
              z: -t * 2,
              rotationZ: .5 * t * Math.PI * 2,
            })
          }
        },
        pathLength: 60,
      })

      setup(new Mesh(geometry, new AutoLitMaterial({
        side: 0,
        map: new DebugTexture({ repeat: 4 }),
      })), { parent: group, position: [1.5, 1.5, 0] })
      setup(new Mesh(geometry, new AutoLitMaterial({
        color: 'cyan',
        side: 1,
      })), { parent: group, position: [1.5, 1.5, 0] })

      setup(new Mesh(geometry, new AutoLitMaterial({
        side: 0,
        wireframe: true,
      })), { parent: group, position: [3.5, 1.5, 0] })
      setup(new Mesh(geometry, new AutoLitMaterial({
        color: 'blue',
        side: 1,
        customProgramCacheToken: 'abcdefghijk',
        onBeforeCompile: shader => {
          ShaderForge.with(shader)
            .vertex.after('begin_vertex', /* glsl */`
              transformed.xy *= 0.995;
              // transformed.xy *= 1.004;
            `)
            .vertex.after('fog_vertex', /* glsl */`
              gl_Position.z += -0.0005;
            `)
        }
      })), { parent: group, position: [3.5, 1.5, 0] })
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
        size: 3,
        focus: [2.5, 1.5],
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
