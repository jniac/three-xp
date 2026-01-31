import { BufferAttribute, BufferGeometry, Vector2 } from 'three'

import { handlePointer } from 'some-utils-dom/handle/pointer'
import { useGroup } from 'some-utils-misc/three-provider'
import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { debugHelper, DebugHelper } from 'some-utils-three/helpers/debug'
import { setup } from 'some-utils-three/utils/tree'
import { Message } from 'some-utils-ts/message'
import { onTick } from 'some-utils-ts/ticker'

import { GeometryWalker } from '../core/walker'

const drawTriangle2DSolver_cache = {
  p0: new Vector2(),
  p1: new Vector2(),
  p2: new Vector2(),
}
function drawTriangle2DSolver(
  walker: GeometryWalker,
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
    const positions = new Float32Array([
      0, 2, 0,
      -1, 0, 0,
      .5, 0, 0,

      0, 2, 0,
      .5, 0, 0,
      2, 2, -2,

      0, 2, 0,
      -1, 2.5, 0,
      -1, 0, 0,

      -1, 0, 0,
      0, -1, 0,
      .5, 0, 0,
    ])
    geometry.setAttribute('position', new BufferAttribute(positions, 3))
    geometry.computeVertexNormals()
    // setup(new AutoLitWireframeMesh(geometry, { wireframeColor: '#f00' }), group)
    const helper = setup(new DebugHelper(), group)

    const walker = new GeometryWalker()
      .fromGeometry(geometry)
    const startUV = new Vector2(.3, .1)
    const deltaUV = new Vector2(.5, .5)

    walker.rotateVertexIndex(1, 0)
    walker.rotateVertexIndex(2, 0)
    walker.rotateVertexIndex(3, 0)

    yield onTick('three', () => {
      walker.walk(0, startUV, deltaUV)

      helper.clear()
      helper.debugTriangle([geometry, 0], { text: 0, color: 'yellow' })
      helper.debugTriangle([geometry, 1], { text: 1, color: '#f30' })
      helper.debugTriangle([geometry, 2], { text: 2, color: '#f82' })
      helper.debugTriangle([geometry, 3], { text: 3, color: '#c3f' })

      const t0_dest = walker.getTriangle(0).getPosition(startUV.clone().add(deltaUV))
      helper.point(t0_dest, { color: '#3ff', shape: 'ring', size: .3 })

      const t1_dest_uv = walker.solver.t1_I_uv.clone().add(walker.solver.t1_remaining_delta_uv)
      const t1_dest = walker.path?.[1]
        ? walker.getTriangle(walker.path[1].triangleIndex).getPosition(t1_dest_uv)
        : t0_dest
      helper.point(t1_dest, { color: '#3ff', shape: 'x', size: .3 })

      helper.polyline([walker.path[0].getPosition0(), walker.path[0].getPosition1(), t1_dest], { color: '#0ff', points: { shape: 'circle' } })

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