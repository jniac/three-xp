'use client'
import { BoxGeometry, BufferGeometry, Mesh, Vector2 } from 'three'

import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { SkyMesh } from 'some-utils-three/objects/sky-mesh'
import { setup } from 'some-utils-three/utils/tree'
import { onTick } from 'some-utils-ts/ticker'

import { handlePointer } from 'some-utils-dom/handle/pointer'
import { useEffects } from 'some-utils-react/hooks/effects'
import { AutoLitWireframeMesh } from './AutoLitWireframeMesh'
import { OptimizedTriangleWalker } from './deepseek'
import { GeometryTriangleHelper } from './GeometryTriangleHelper'
import { HalfEdgeMesh } from './half-edge-mesh'
import { TorusKnotGroup, TorusKnotInspector } from './views/TorusKnot'
import { Triangles } from './views/Triangles'

function ThreeSettings() {
  useGroup('ThreeSettings', function* (group) {
    setup(new DebugHelper(), group)
      .regularGrid({ opacity: [.1, .02] })

    setup(new SkyMesh({ color: '#226' }), group)
  }, [])

  return null
}

function RaycastInfo() {
  const three = useThreeWebGL()
  const { ref } = useEffects<HTMLDivElement>(function* (div) {
    const triToDraw = [] as [geometry: BufferGeometry, triangleIndex: number][]

    const helper = setup(new DebugHelper(), three.scene).onTop()
    yield () => {
      helper.clear()
      helper.removeFromParent()
    }
    const updateHelper = () => {
      helper.clear()
      for (const [geometry, triangleIndex] of triToDraw) {
        helper.debugTriangle([geometry, triangleIndex], { color: '#c03' })
      }
    }

    yield handlePointer(three.domElement, {
      onTap: () => {
        const [intersection] = three.pointer.raycast(three.scene)
        if (intersection) {
          const currentGeometry = (intersection.object as Mesh).geometry
          const { faceIndex: currentTriangleIndex } = intersection
          if (currentTriangleIndex === null || currentTriangleIndex === undefined)
            return
          const existingIndex = triToDraw.findIndex(([geometry, triangleIndex]) => geometry === currentGeometry && triangleIndex === currentTriangleIndex)
          if (existingIndex !== -1) {
            triToDraw.splice(existingIndex, 1)
          } else {
            triToDraw.push([currentGeometry, currentTriangleIndex])
          }
          updateHelper()
        }
      },
    })

    yield onTick('three', tick => {
      const [intersection] = three.pointer.raycast(three.scene)
      if (intersection) {
        div.innerText = `${intersection.object.name || intersection.object.constructor.name}`
          + `\nUV: (${intersection.uv?.x.toFixed(2)}, ${intersection.uv?.y.toFixed(2)})`
          + `\ntri: ${intersection.faceIndex}`
      }
    })
  }, [])
  return (
    <div
      ref={ref}
      className='p-4 backdrop-blur-2xl bg-black/30 rounded border border-[#fff6]'
    >
      Hello
    </div>
  )
}

export function MyScene() {
  useGroup('MyScene', function* (group) {
    setup(new DebugHelper(), group)
      .regularGrid({ opacity: [1, .5] })

    const helper = setup(new DebugHelper(), group)

    const hem = new HalfEdgeMesh()
    hem.fromGeometry(new BoxGeometry(2, 2, 2, 2, 2, 2))

    const mesh = setup(new AutoLitWireframeMesh(hem.toGeometry(), { baseColor: '#def', wireframeColor: '#00f' }), group)
    // mesh.visible = false

    yield onTick('three', tick => {
      helper.clear()
      helper.points(hem.getVertices().map(v => v.position), { size: .025 })
      // helper.texts(hem.getVertices().map(v => v.position), {
      //   texts: hem.getVertices().map((_, i) => i.toString()),
      //   size: 0.3,
      //   color: 'blue',
      // })
    })

    {
      const walker = new OptimizedTriangleWalker(mesh.geometry)

      // Start at triangle 0, UV position (0.3, 0.3)
      const startTriangle = 0
      const startUV = new Vector2(0.1, 0.4)
      const deltaUV = new Vector2(0.4, 0.3) // Move in UV space

      const tri0 = new GeometryTriangleHelper(mesh.geometry, startTriangle, startUV)
      const triangleHelper = setup(new DebugHelper(), group)
      triangleHelper.debugTriangle([tri0.A, tri0.B, tri0.C], { color: 'red' })
      triangleHelper.point(tri0.P, { color: 'yellow', size: 0.1 })
      triangleHelper.point(tri0.getPoint(startUV.clone().add(deltaUV)), { color: 'green', size: 0.1 })
      // triangleHelper.circle({ center: tri.A, radius: .1 }, { color: 'red' })
      // triangleHelper.polygon([tri.A, tri.B, tri.C], { color: 'red', arrow: { type: 'triple' } })
      // triangleHelper.point(tri.P, { color: 'yellow', size: 0.1 })
      mesh.visible = false

      // Walk across triangles
      const result = walker.walk(startTriangle, startUV, deltaUV)

      console.log(`Ended at triangle ${result.triangleIndex}, UV (${result.uv.x}, ${result.uv.y})`)

      const tri1 = new GeometryTriangleHelper(mesh.geometry, result.triangleIndex, result.uv)
      triangleHelper.point(tri1.P, { color: 'purple', size: 0.4, shape: 'ring-thin' })
    }
  }, [])

  return null
}


export function PageClient() {
  return (
    <ThreeProvider
      vertigoControls={{
        size: 7,
      }}>
      <ThreeSettings />
      <Triangles x={-5} />
      <TorusKnotGroup />
      <div className='thru p-8 flex flex-col gap-1 items-start'>
        <RaycastInfo />
        <TorusKnotInspector />
      </div>
      {/* <MyScene /> */}
    </ThreeProvider>
  )
}
