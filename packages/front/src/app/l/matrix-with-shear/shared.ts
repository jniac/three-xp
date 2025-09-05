import { BufferGeometry, ColorRepresentation, Group, LineBasicMaterial, LineSegments, Matrix4, Mesh, TorusKnotGeometry, Vector3 } from 'three'

import { AxesGeometry } from 'some-utils-three/geometries/axis'
import { LineGeometryUtils } from 'some-utils-three/geometries/line-utils'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { setup } from 'some-utils-three/utils/tree'
import { Tick } from 'some-utils-ts/ticker'

export const style = {
  xColor: '#ff3333',
  yColor: '#33cc66',
  zColor: '#3366ff',
}

export class Basis {
  p = new Vector3();
  u = new Vector3(1, 0, 0);
  v = new Vector3(0, 1, 0);
  w = new Vector3(0, 0, 1);
  set(p: Vector3, u: Vector3, v: Vector3, w: Vector3) {
    this.p.copy(p)
    this.u.copy(u)
    this.v.copy(v)
    this.w.copy(w)
    return this
  }
  fromMatrix4(m: Matrix4) {
    this.p.setFromMatrixPosition(m)
    this.u.setFromMatrixColumn(m, 0)
    this.v.setFromMatrixColumn(m, 1)
    this.w.setFromMatrixColumn(m, 2)
    return this
  }
  scale(s: Vector3) {
    this.u.multiplyScalar(s.x)
    this.v.multiplyScalar(s.y)
    this.w.multiplyScalar(s.z)
    return this
  }
  lerpBasis(a: Basis, b: Basis, t: number) {
    this.p.lerpVectors(a.p, b.p, t)
    this.u.lerpVectors(a.u, b.u, t)
    this.v.lerpVectors(a.v, b.v, t)
    this.w.lerpVectors(a.w, b.w, t)
    return this
  }
  lerp(other: Basis, t: number) {
    this.p.lerp(other.p, t)
    this.u.lerp(other.u, t)
    this.v.lerp(other.v, t)
    this.w.lerp(other.w, t)
    return this
  }
  toMatrix4(m: Matrix4 = new Matrix4()) {
    m.makeBasis(this.u, this.v, this.w)
    m.setPosition(this.p)
    return m
  }
}

export class MyObject extends Group {
  static shared = {
    torusKnotGeometry: new TorusKnotGeometry(.15, .07, 256, 64),
    axesGeometry: new AxesGeometry(),
    cubeGeometry: LineGeometryUtils.setAsBounds(new BufferGeometry(), 0, 1),
    autoLitVertexColorsMaterial: new AutoLitMaterial({ vertexColors: true }),
  };

  constructor(color: ColorRepresentation = 'white') {
    super()
    const {
      torusKnotGeometry, axesGeometry, autoLitVertexColorsMaterial, cubeGeometry,
    } = MyObject.shared
    setup(new Mesh(torusKnotGeometry, new AutoLitMaterial({ color })), this)
    setup(new Mesh(axesGeometry, autoLitVertexColorsMaterial), this)
    setup(new LineSegments(cubeGeometry, new LineBasicMaterial({ color })), this)
  }
}

export class TwinObject extends Group {
  objA = setup(new MyObject(), this);
  objB = setup(new MyObject('yellow'), this);
  objC = setup(new MyObject('red'), this);
  basisA = new Basis();
  basisB = new Basis();
  basisC = new Basis();
  onTick(tick: Tick) {
    const t = tick.sin01Time({ frequency: 1 / 5 })
    this.objC.matrixAutoUpdate = false
    this.basisA.fromMatrix4(this.objA.matrix)
    this.basisB.fromMatrix4(this.objB.matrix)
    this.basisC.lerpBasis(this.basisA, this.basisB, t)
    this.basisC.toMatrix4(this.objC.matrix)
  }
}
