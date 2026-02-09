import { BufferAttribute, BufferGeometry, Vector2 } from 'three'

import { handlePointer } from 'some-utils-dom/handle/pointer'
import { useGroup } from 'some-utils-misc/three-provider'
import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { debugHelper, DebugHelper } from 'some-utils-three/helpers/debug'
import { setup } from 'some-utils-three/utils/tree'
import { Message } from 'some-utils-ts/message'
import { onTick } from 'some-utils-ts/ticker'

import { SurfaceWalker } from '../core/walker'

const drawTriangle2DSolver_cache = {
  p0: new Vector2(),
  p1: new Vector2(),
  p2: new Vector2(),
}
function drawTriangle2DSolver(
  walker: SurfaceWalker,
  debugHelper: DebugHelper,
) {
  const {
    t0_u,
    t0_v,
    t0_start_uv,
    t0_delta_uv,
    t1_p0,
    t1_p1,
    t1_p2,
    t1_u,
    t1_v,
    t1_I_uv,
    t1_remaining_delta_uv,
  } = walker.solver
  debugHelper
    .debugTriangle([0, t0_u, t0_v], { color: '#0ff' })
    .debugTriangle([t1_p0, t1_p1, t1_p2], { color: '#0ff' })

  const { p0, p1, p2 } = drawTriangle2DSolver_cache
  p0.set(0, 0).addScaledVector(t0_u, t0_start_uv.x).addScaledVector(t0_v, t0_start_uv.y)
  p1.copy(t1_p0).addScaledVector(t1_u, t1_I_uv.x).addScaledVector(t1_v, t1_I_uv.y)
  p2.copy(t1_p0).addScaledVector(t1_u, t1_I_uv.x + t1_remaining_delta_uv.x).addScaledVector(t1_v, t1_I_uv.y + t1_remaining_delta_uv.y)
  debugHelper
    .polyline([p0, p1, p2], { points: { shape: 'circle' } })
}

export function Triangles() {
  useGroup('Triangles', function* (group, three) {
    setup(debugHelper, group)
    const geometry = new BufferGeometry()
    const A = [0, 2, 0]
    const B = [-1, 0, 0]
    const C = [.5, 0, 0]
    const D = [2, 2, -2]
    const positions = new Float32Array([
      ...A,
      ...B,
      ...C,

      ...A,
      ...C,
      ...D,

      ...A,
      -1, 2.5, 0,
      ...B,

      ...B,
      0, -1, 0,
      ...C,

      ...C,
      2, 0, 0,
      ...D,
    ])
    geometry.setAttribute('position', new BufferAttribute(positions, 3))
    geometry.computeVertexNormals()
    // setup(new AutoLitWireframeMesh(geometry, { wireframeColor: '#f00' }), group)
    const helper = setup(new DebugHelper(), group)

    const walker = new SurfaceWalker()
      .fromGeometry(geometry)
    const startUV = new Vector2(.3, .1)
    const deltaUV = new Vector2(.5, .5)

    walker.rotateVertexIndex(1, 0)
    walker.rotateVertexIndex(2, 0)
    walker.rotateVertexIndex(3, 0)

    const triangle3DColors = [
      '#ff0',
      '#f30',
      '#f82',
      '#c3f',
    ]

    yield onTick('three', () => {
      const result = walker.walk(0, startUV, deltaUV)

      helper.clear()
      helper.debugTriangle([geometry, 0], { text: 0, color: triangle3DColors[0] })
      helper.debugTriangle([geometry, 1], { text: 1, color: triangle3DColors[1] })
      helper.debugTriangle([geometry, 2], { text: 2, color: triangle3DColors[2] })
      helper.debugTriangle([geometry, 3], { text: 3, color: triangle3DColors[3] })
      helper.debugTriangle([geometry, 4], { text: 4, color: triangle3DColors[0] })

      const t0_dest = walker.getTriangle(0).getPosition(startUV.clone().add(deltaUV))
      helper.point(t0_dest, { color: '#3ff', shape: 'ring', size: .3 })

      const t1_dest_uv = walker.solver.t1_I_uv.clone().add(walker.solver.t1_remaining_delta_uv)
      const t1_dest = walker.path?.[1]
        ? walker.getTriangle(walker.path[1].triangleIndex).getPosition(t1_dest_uv)
        : t0_dest
      helper.point(t1_dest, { color: '#3ff', shape: 'x', size: .3 })

      console.log(result.path.length)
      helper.polyline([
        result.path[0].getPosition0(),
        ...result.path.map(segment => segment.getPosition1()),
      ], { color: '#0ff', points: { shape: 'circle' } })
      // helper.polyline([walker.path[0].getPosition0(), walker.path[0].getPosition1(), t1_dest], { color: '#0ff', points: { shape: 'circle' } })

      helper.setTransformMatrix({ y: -3 })
      drawTriangle2DSolver(walker, helper)
      helper.resetTransformMatrix()
    })

    const controls = Message.requireInstanceOrThrow(VertigoControls)
    let dragging = false
    yield handlePointer(three.domContainer, {
      onDown: info => {
        const { shiftKey } = info.event as MouseEvent
        if (shiftKey) {
          dragging = true
          controls.setEnabled(false)
        }
      },
      onUp: () => {
        if (dragging) {
          dragging = false
          controls.setEnabled(true)
        }
      },
      onDrag: () => {
        if (dragging) {
          const { intersected, point } = three.pointer.intersectPlane('xy')
          if (intersected) {
            const uv = walker.getTriangle(0).getUV(point)
            deltaUV.subVectors(uv, startUV)
          }
        }
      },
    })
  }, [])

  return null
}