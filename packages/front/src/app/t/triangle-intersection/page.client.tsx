'use client'
import { BoxGeometry, Color, ColorRepresentation, IcosahedronGeometry, InstancedMesh, Matrix4, Mesh, MeshBasicMaterial, Quaternion, Ray, TorusKnotGeometry, Vector3 } from 'three'

import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { MeshIntersection, rayGeometryAllIntersections, rayMeshAllIntersections, rayMeshFirstIntersection } from 'some-utils-three/experimental/geometry/intersection'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { makeMatrix4 } from 'some-utils-three/utils/make'
import { setup } from 'some-utils-three/utils/tree'
import { almostEqual } from 'some-utils-ts/math/basic'
import { onTick } from 'some-utils-ts/ticker'

import { AutoLitWireframeMesh } from '@/app/e/mesh-walk/AutoLitWireframeMesh'
import { HashMap } from '@/app/e/mesh-walk/surface-walker/hash-map'

function ThreeSettings() {
  const three = useThreeWebGL()
  three.pipeline.basicPasses.fxaa.enabled = false
  three.scene.background = new Color('hsl(200, 20%, 10%)')
  useGroup('my-scene', function* (group) {
    setup(new DebugHelper().regularGrid(), group)
  })
  return null
}

function DemoOneMesh() {
  useGroup('my-scene', function* (group) {

    const mesh = setup(new AutoLitWireframeMesh(
      new TorusKnotGeometry(1, 0.4, 100, 16).rotateY(Math.PI),
      { wireframeColor: 'blue' },
    ), {
      parent: group,
      rotationY: '25deg',
    })

    const helper = setup(new DebugHelper(), group).zOffset({ points: .01 })
    const textHelper = setup(new DebugHelper(), group).onTop()

    yield onTick('three', tick => {
      helper.clear()
      textHelper.clear()

      mesh.rotateY(tick.deltaTime * .1)

      const origin = new Vector3(.2, .2, 1)
      const direction = new Vector3(
        tick.cosTime({ frequency: 1 / Math.E }) * 0.4,
        tick.cosTime({ frequency: 1 / Math.PI }) * 0.4,
        -4,
      )

      helper.point(origin, { color: 'yellow', shape: 'circle' })
      helper.line(origin, origin.clone().add(direction.clone()), { color: 'yellow' })

      const mi = mesh.matrixWorld.clone().invert()
      const results = rayGeometryAllIntersections(origin.clone().applyMatrix4(mi), direction.clone().transformDirection(mi), mesh.geometry, {
        mode: 'Segment',
      })
      for (const result of results) {
        const p = result.getPoint()
        const n = result.getNormal()
        p.applyMatrix4(mesh.matrixWorld)
        n.transformDirection(mesh.matrixWorld)
        helper.point(p, { color: 'red', shape: 'circle', size: .05 })
        helper.line(p, p.clone().add(n.multiplyScalar(.2)), { color: 'red' })
        textHelper.text(p, `${result.triangleIndex}`, { color: 'red', size: .1, offset: [0, .05] })
      }

      const firstResult = rayMeshFirstIntersection(origin, direction, mesh)
      if (firstResult) {
        const p = firstResult.getPoint()
        const n = firstResult.getNormal()
        helper.point(p, { color: 'cyan', shape: 'ring', size: .1 })
        helper.line(p, p.clone().add(n.multiplyScalar(.2)), { color: 'cyan' })
      }
    })
  })

  return null
}

function DemoInstancedMesh() {
  useGroup('my-scene', function* (group) {
    setup(new DebugHelper().regularGrid(), group)

    const geometry = new BoxGeometry()
    const mesh = setup(new InstancedMesh(geometry, new AutoLitMaterial({ wireframe: true, shadowColor: 'red' }), 4), group)

    setup(mesh, {
      rotation: '1deg, 2deg, 4deg',
    })

    mesh.updateMatrixWorld(true)

    mesh.setMatrixAt(0, makeMatrix4({
      rotation: '10deg, 20deg, 30deg',
    }))

    mesh.setMatrixAt(1, makeMatrix4({
      z: -1.5,
      rotation: '40deg, 10deg, 30deg',
    }))

    mesh.setMatrixAt(2, makeMatrix4({
      z: -3,
      rotation: '40deg, 10deg, 30deg',
      scale: [1, .5, 2],
    }))

    mesh.setMatrixAt(3, new Matrix4()
      .makeBasis(new Vector3(2, 0, -.5), new Vector3(0, 1, -.5), new Vector3(0, -.5, 1))
      .setPosition(0, 0, -4.5))

    const helper = setup(new DebugHelper(), group).zOffset({ points: .001 })

    const drawIntersection = (I: MeshIntersection, color: ColorRepresentation = 'red') => {
      const p = I.getPoint()
      const n = I.getNormal()
      helper.point(p, { color, shape: 'circle', size: .05 })
      helper.circle({ center: p, axis: n, radius: .05 }, { color })
      helper.line(p, p.clone().add(n.multiplyScalar(.2)), { color })
    }

    yield onTick('three', tick => {
      helper.clear()
      const ray = new Ray(
        new Vector3(0, 0, 1),
        new Vector3(
          tick.cos01Time({ frequency: 1 / 8 }),
          tick.sin01Time({ frequency: 1 / 8 }),
          -10,
        ).normalize().multiplyScalar(tick.lerpCos01Time(1, 10)),
      )
      helper.line(ray.origin, ray.at(1, new Vector3()), { color: 'yellow' })

      for (const I of rayMeshAllIntersections(ray.origin, ray.direction, mesh, { mode: 'Segment', culling: 'FrontFace' }))
        drawIntersection(I, 'cyan')

      for (const I of rayMeshAllIntersections(ray.origin, ray.direction, mesh, { mode: 'Segment', culling: 'BackFace' }))
        drawIntersection(I, '#f70')
    })
  })

  return null
}

export function ProbeGeometry() {
  useGroup('probe-geometry', function* (group) {
    const q = new Quaternion().random()
    const g0 = new IcosahedronGeometry(1, 0).applyQuaternion(q)
    const g1 = new IcosahedronGeometry(1, 1).applyQuaternion(q)
    const g2 = new IcosahedronGeometry(1, 2).applyQuaternion(q)

    const createHm = () => new HashMap<Vector3, number>({
      hash: ({ x, y, z }) => Math.abs(x) * 10000 + Math.abs(y) * 100 + Math.abs(z),
      equals: (v1, v2) => (almostEqual(v1.x, v2.x) && almostEqual(v1.y, v2.y) && almostEqual(v1.z, v2.z))
        || (almostEqual(v1.x, -v2.x) && almostEqual(v1.y, -v2.y) && almostEqual(v1.z, -v2.z)), // account for duplicated vertices in opposite directions
      clone: v => v.clone(),
    })
    const globalHm = createHm()
    const pushGeometryVerticesToHashMap = (geometry: IcosahedronGeometry) => {
      const hm = createHm()
      const pa = geometry.attributes.position.array as Float32Array
      for (let i = 0; i < pa.length; i += 3) {
        const v = new Vector3(pa[i], pa[i + 1], pa[i + 2])
        if (v.z < 0)
          v.negate()
        globalHm.set(v, 1)
        hm.set(v, 1)
      }
      return {
        hm,
        verts: [...hm.keys()],
      }
    }
    const absRound = (v: number) => Number.parseFloat(Math.abs(v).toFixed(12))
    const bundle0 = pushGeometryVerticesToHashMap(g0)
    const bundle1 = pushGeometryVerticesToHashMap(g1)
    const bundle2 = pushGeometryVerticesToHashMap(g2)
    console.log('Unique vertices:', globalHm.size)
    const allValues = new Set(globalHm.keys().flatMap(v => [v.x, v.y, v.z]).map(absRound).toArray().sort())
    const valueSymbols = new Map<number, string>([...allValues].map((v, i) => [v, `v${i}`]))

    const print = () => {
      const lines = [] as string[]
      for (const [v, symbol] of valueSymbols.entries()) {
        lines.push(`const ${symbol} = ${v}`)
      }
      const pushHm = (hm: HashMap<Vector3, number>) => {
        lines.push('')
        lines.push(`const probe${hm.size * 2} = [`)
        for (const key of hm.keys()) {
          const x = valueSymbols.get(absRound(key.x)) ?? 'NaN'
          const y = valueSymbols.get(absRound(key.y)) ?? 'NaN'
          const z = valueSymbols.get(absRound(key.z)) ?? 'NaN'
          const sx = key.x < 0 ? '-' : ''
          const sy = key.y < 0 ? '-' : ''
          const sz = key.z < 0 ? '-' : ''
          lines.push(`  ${sx}${x}, ${sy}${y}, ${sz}${z},`)
        }
        lines.push(`]`)
      }
      pushHm(bundle0.hm)
      pushHm(bundle1.hm)
      pushHm(bundle2.hm)
      return lines.join('\n')
    }

    console.log(print())


    setup(new Mesh(g0, new MeshBasicMaterial({ wireframe: true })), {
      parent: group,
      position: [-2.5, 0, 0],
    })

    setup(new Mesh(g1, new MeshBasicMaterial({ wireframe: true })), {
      parent: group,
      position: [0, 0, 0],
    })

    setup(new Mesh(g2, new MeshBasicMaterial({ wireframe: true })), {
      parent: group,
      position: [2.5, 0, 0],
    })



    const helper = setup(new DebugHelper(), group)

    helper.setTransformMatrix({ x: -2.5 })
    for (const [index, key] of bundle0.verts.entries()) {
      helper.text(key, `${index}`, { color: 'cyan', size: .25 })
    }
  })
  return null
}

export function PageClient() {

  return (
    <ThreeProvider
      vertigoControls={{
        size: 8,
      }}
    >
      <ThreeSettings />
      {/* <DemoInstancedMesh /> */}
      <ProbeGeometry />
    </ThreeProvider>
  )
}
