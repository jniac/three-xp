import { BufferGeometry, Color, Group, IcosahedronGeometry, InstancedMesh, Line, LineBasicMaterial, Matrix4, MeshBasicMaterial, Vector3, Vector4 } from 'three'
import { NURBSCurve } from 'three/examples/jsm/curves/NURBSCurve.js'

import { fromTransformDeclaration } from 'some-utils-three/declaration'

export class SimplifiedNurbsCurve extends Group {
  static instancedGeometry = new IcosahedronGeometry(0.005, 12)

  degree = 8
  color = new Color(0xff0000)

  nurbsCurve: NURBSCurve | null = null

  controlPoints: Vector4[] = []
  points: Vector3[] = []

  setControlPoints(value: (Vector3 | Vector4)[], {
    curveSubdivisions = 512,
  } = {}) {
    const { degree, color } = this

    const controlPoints = value.map(p => p instanceof Vector3 ? new Vector4(p.x, p.y, p.z, 1) : p)
    const knotVector = []
    const numControlPoints = controlPoints.length
    for (let i = 0; i <= degree; i++) knotVector.push(0)
    for (let i = 1; i <= numControlPoints - degree; i++) knotVector.push(i)
    for (let i = 0; i < degree; i++) knotVector.push(numControlPoints - degree)
    const nurbsCurve = new NURBSCurve(degree, knotVector, controlPoints)
    const points = nurbsCurve.getSpacedPoints(curveSubdivisions)
    const curveGeometry = new BufferGeometry().setFromPoints(points)
    const nurbsLine = new Line(curveGeometry, new LineBasicMaterial({ color }))
    this.add(nurbsLine)

    const instancedPoints = new InstancedMesh(SimplifiedNurbsCurve.instancedGeometry, new MeshBasicMaterial({ color }), controlPoints.length)
    this.add(instancedPoints)
    const m = new Matrix4()
    for (const [i, point] of controlPoints.entries()) {
      const { x, y, z, w } = point
      instancedPoints.setMatrixAt(i, fromTransformDeclaration({ x, y, z, scaleScalar: w }, m))
    }

    this.controlPoints = controlPoints
    this.nurbsCurve = nurbsCurve
    this.points = points
  }
}
