
import { BufferGeometry, CapsuleGeometry, Color, DirectionalLight, DoubleSide, Group, HemisphereLight, IcosahedronGeometry, InstancedBufferAttribute, InstancedMesh, Matrix4, MeshBasicMaterial, MeshPhysicalMaterial, Object3D, PlaneGeometry, Points, PointsMaterial, Vector3 } from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import { ShaderForge } from 'some-utils-three/shader-forge'
import { computeTangentMatrixFromNormal } from 'some-utils-three/utils/matrix'
import { glsl_easings } from 'some-utils-ts/glsl/easings'
import { PRNG } from 'some-utils-ts/random/prng'
import { TickCallback, Ticker } from 'some-utils-ts/ticker'

import { glsl_utils } from 'some-utils-ts/glsl/utils'
import { glsl_looping } from './looping'
import { setvertexColors } from './utils'

class InstanceMatrixHelper extends InstancedMesh {
  private static _geometry: BufferGeometry
  private static getGeometry() {
    if (InstanceMatrixHelper._geometry) {
      return InstanceMatrixHelper._geometry
    }

    const geometryX = new CapsuleGeometry(.05, 1, 1, 6)
      .rotateZ(Math.PI / 2)
      .translate(.5, 0, 0)
    setvertexColors(geometryX, '#c60613')
    const geometryY = geometryX.clone()
      .rotateZ(Math.PI / 2)
    setvertexColors(geometryY, '#01b35a')
    const geometryZ = geometryX.clone()
      .rotateY(-Math.PI / 2)
    setvertexColors(geometryZ, '#321bc7')

    InstanceMatrixHelper._geometry = mergeGeometries([geometryX, geometryY, geometryZ])

    return InstanceMatrixHelper._geometry
  }

  private static uniforms = {
    uSize: { value: .1 },
  }

  private static _material: MeshBasicMaterial
  private static getMaterial() {
    if (InstanceMatrixHelper._material) {
      return InstanceMatrixHelper._material
    }

    InstanceMatrixHelper._material = new MeshBasicMaterial({ vertexColors: true })

    InstanceMatrixHelper._material.onBeforeCompile = shader => ShaderForge.with(shader)
      .uniforms(InstanceMatrixHelper.uniforms)
      .vertex.replace('begin_vertex', /* glsl */ `
        vec3 transformed = vec3(position);
        transformed *= uSize;
        #ifdef USE_ALPHAHASH
          vPosition = vec3(position);
        #endif
      `)

    return InstanceMatrixHelper._material
  }

  size: number

  constructor(bufferAttribute: InstancedBufferAttribute, size = .1) {
    super(
      InstanceMatrixHelper.getGeometry(),
      InstanceMatrixHelper.getMaterial(),
      bufferAttribute.count)

    this.instanceMatrix = bufferAttribute

    this.size = size
    this.onBeforeRender = () => {
      InstanceMatrixHelper.uniforms.uSize.value = this.size
    }
  }

  addTo(parent: Object3D) {
    parent.add(this)
    return this
  }
}

export class SphereToSphereDemo extends Group {
  onTick: TickCallback

  constructor() {
    super()
    PRNG.reset()

    const sky = new HemisphereLight('#ffffff', '#926969', 1)
    this.add(sky)

    const sun = new DirectionalLight('#ffffff', 2)
    this.add(sun)
    sun.position.set(2, 4, 1)

    const geometryStart = new IcosahedronGeometry(1, 1)
    const geometryEnd = geometryStart.clone()

    const pointStart = new Points(geometryStart, new PointsMaterial({ size: .05 }))
    this.add(pointStart)

    const pointEnd = new Points(geometryEnd, new PointsMaterial({ size: .05 }))
    this.add(pointEnd)
    pointEnd.position.set(0, 0, -8)
    pointEnd.rotation.set(0, 0, Math.PI * 0.66)

    this.onTick = ({ deltaTime, time }) => {
      pointEnd.position.y = Math.sin(time * .33) * .5
      // pointEnd.rotation.x += .1 * deltaTime
      // pointEnd.rotation.y += .1 * deltaTime
      // pointEnd.rotation.z += .1 * deltaTime
    }

    const count = geometryStart.attributes.position.count
    const lines = new InstancedMesh(
      new PlaneGeometry(1, 1, 1000, 1).translate(.5, .5, 0),
      new MeshPhysicalMaterial({
        // wireframe: true,
        side: DoubleSide,
        flatShading: true,
      }),
      count)
    this.add(lines)

    const aStartMat = new InstancedBufferAttribute(new Float32Array(count * 16), 16)
    const aEndMat = new InstancedBufferAttribute(new Float32Array(count * 16), 16)
    lines.geometry.setAttribute('aStartMat', aStartMat)
    lines.geometry.setAttribute('aEndMat', aEndMat)
    lines.frustumCulled = false

    const matrix = new Matrix4()
    const up = new Vector3(0, 1, 0)
    const p = new Vector3()
    const n = new Vector3()
    const color = new Color()
    for (let i = 0; i < count; i++) {
      // Start matrix:
      p.fromBufferAttribute(geometryStart.attributes.position, i)
      n.copy(p) // normal = position for a unit sphere
      computeTangentMatrixFromNormal(matrix, n, up, p)
      matrix.toArray(aStartMat.array, i * 16)

      // End matrix:
      p.fromBufferAttribute(geometryEnd.attributes.position, i)
      computeTangentMatrixFromNormal(matrix, n, up, p)
      matrix.toArray(aEndMat.array, i * 16)

      // Color:
      // color.setHSL(i / count, 1, .5)
      color.set(0xffffff * PRNG.random())
      lines.setColorAt(i, color)
    }

    const uniforms = {
      uTime: { get value() { return Ticker.current().time } },
      uWorldStartMatrix: { value: pointStart.matrix },
      uWorldEndMatrix: { value: pointEnd.matrix },
      uWidth: { value: .2 },
    }
    lines.material.onBeforeCompile = shader => ShaderForge.with(shader)
      .uniforms(uniforms)
      .vertex.top(
        glsl_utils,
        glsl_easings,
        glsl_looping)
      .vertex.top(/* glsl */ `
      attribute mat4 aStartMat;
      attribute mat4 aEndMat;

      vec3 bezier3(vec3 a, vec3 b, vec3 c, vec3 d, float t) {
        vec3 ab = mix(a, b, t);
        vec3 bc = mix(b, c, t);
        vec3 cd = mix(c, d, t);  
        vec3 ab_bc = mix(ab, bc, t);
        vec3 bc_cd = mix(bc, cd, t);
        return mix(ab_bc, bc_cd, t);
      }

      vec3 bezier3_tangent(vec3 a, vec3 b, vec3 c, vec3 d, float t) {
        return 3.0 * ( 
          (1.0 - t) * (1.0 - t) * (b - a) + 
          2.0 * (1.0 - t) * t * (c - b) + 
          t * t * (d - c));
      }
    `)
      .vertex.replace('begin_vertex', /* glsl */ `
      mat4 startMat = uWorldStartMatrix * aStartMat;
      mat4 endMat = uWorldEndMatrix * aEndMat;

      vec3 start = startMat[3].xyz;
      vec3 end = endMat[3].xyz;

      float d = distance(start, end);

      vec3 p0 = start;
      vec3 p1 = mix(start, end, 0.0) + d * 0.1 * startMat[2].xyz;
      vec3 p2 = mix(start, end, 1.0) + d * 0.1 * endMat[2].xyz;
      vec3 p3 = end;
      
      // p1 = mix(start, end, 0.33);
      // p2 = mix(start, end, 0.66);

      vec3 normal = mix(startMat[2].xyz, endMat[2].xyz, position.x);
      vec3 up = mix(startMat[1].xyz, endMat[1].xyz, position.x);
      vec3 tangent = bezier3_tangent(p0, p1, p2, p3, position.x);

      float width = (position.y - 0.5)
        * easeInThenOut(position.x, 6.0)
        * uWidth;
      
      float loopT = inverseLerp(0.0, 0.66, position.x);
      vec2 loop = looping(loopT);
      // loop = vec2(position.x, 0.0);

      vec3 transformed = 
        bezier3(p0, p1, p2, p3, position.x)
        + tangent * (loop.x - loopT) * d * 0.066 + normal * loop.y * d * 0.66
        + up * width;
      
      #ifdef USE_ALPHAHASH
        vPosition = transformed;
      #endif
    `)
      .vertex.replace('beginnormal_vertex', /* glsl */ `
      vec3 objectNormal = vec3(normal);

      #ifdef USE_TANGENT
        vec3 objectTangent = vec3(tangent.xyz);
      #endif
    `)

    geometryStart.computeBoundingBox()
    geometryStart.computeBoundingSphere()
    geometryEnd.computeBoundingBox()
    geometryEnd.computeBoundingSphere()

    lines.computeBoundingBox()
    lines.boundingBox?.copy(geometryStart.boundingBox!.clone())
      .union(geometryEnd.boundingBox!)
      .expandByScalar(1)

    lines.computeBoundingSphere()
    lines.boundingSphere?.copy(geometryStart.boundingSphere!.clone())
      .union(geometryEnd.boundingSphere!)
      .expandByPoint(new Vector3().setScalar(1))

    // prevent re-compute:
    lines.geometry.computeBoundingBox = () => { }
    lines.geometry.computeBoundingSphere = () => { }

    new InstanceMatrixHelper(aStartMat)
      .addTo(this)
  }
}
