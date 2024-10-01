import { DoubleSide, InstancedBufferAttribute, InstancedMesh, Matrix4, MeshPhysicalMaterial, PlaneGeometry, Vector4 } from 'three'

import { ShaderForge } from 'some-utils-three/shader-forge'
import { makeColor } from 'some-utils-three/utils/make'
import { glsl_easings } from 'some-utils-ts/glsl/easings'
import { glsl_utils } from 'some-utils-ts/glsl/utils'
import { PRNG } from 'some-utils-ts/random/prng'
import { Ticker } from 'some-utils-ts/ticker'

import { glsl_looping } from '../../path-with-loop/looping'

import { ScatteredPlaneProps } from './scattered'

export class ScatteredPlaneLines extends InstancedMesh {

  parts: {
    aStartMat: InstancedBufferAttribute
    aEndMat: InstancedBufferAttribute
  }

  constructor(props: ScatteredPlaneProps) {
    const { row, col } = props
    const count = row * col

    const geometry = new PlaneGeometry(1, 1, 100, 1)
    const material = new MeshPhysicalMaterial({
      side: DoubleSide,
      flatShading: true,
    })

    const aStartMat = new InstancedBufferAttribute(new Float32Array(count * 16), 16)
    const aEndMat = new InstancedBufferAttribute(new Float32Array(count * 16), 16)
    geometry.setAttribute('aStartMat', aStartMat)
    geometry.setAttribute('aEndMat', aEndMat)

    const uniforms = {
      uTime: Ticker.get('three').uTime,
      uLength: { value: 1 },
      uWidth: { value: .01 },
      uRand: { value: PRNG.vector(new Vector4(), { min: 0, max: 1 }) },
      uWorldStartMatrix: { value: new Matrix4().identity() },
      uWorldEndMatrix: { value: new Matrix4().identity() },
    }

    material.onBeforeCompile = shader => ShaderForge.with(shader)
      .shaderName('with-loop')
      .uniforms(uniforms)
      .vertex.top(
        glsl_utils,
        glsl_easings,
        glsl_looping)
      .vertex.top(/* glsl */ `
        attribute mat4 aStartMat;
        attribute mat4 aEndMat;

        float rand(vec3 p) {
          return fract(sin(dot(p, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
        }

        // float rand(vec3 p) {
        //   p = fract(p * vec3(443.8975, 441.4236, 437.1954));
        //   p += dot(p, p.yzx + 19.19);
        //   return fract((p.x + p.y) * p.z);
        // }

        float rand(vec3 p, float rangeMin, float rangeMax) {
          return mix(rangeMin, rangeMax, rand(p));
        }

        float rand11(vec3 p) {
          float r = rand(p) * 2.0 - 1.0;
          float s = sign(r);
          r = fract(r);
          r *= r * r * r;
          return r * s;
        }

        float rand11(vec3 p, float rangeMin, float rangeMax) {
          return (rand11(p) * 0.5 + 0.5) * (rangeMax - rangeMin) + rangeMin;
        }

        vec3 bezier3(vec3 a, vec3 b, vec3 c, vec3 d, float t) {
          t = clamp(t, 0.0, 1.0);
          vec3 ab = mix(a, b, t);
          vec3 bc = mix(b, c, t);
          vec3 cd = mix(c, d, t);  
          vec3 ab_bc = mix(ab, bc, t);
          vec3 bc_cd = mix(bc, cd, t);
          return mix(ab_bc, bc_cd, t);
        }

        vec3 bezier3_tangent(vec3 a, vec3 b, vec3 c, vec3 d, float t) {
          t = clamp(t, 0.0, 1.0);
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

        start += vec3(rand11(start.xyz), rand11(start.yzx), rand11(start.zxy)) * 0.66;
        end += vec3(rand11(start.zyx), rand11(start.xzy), rand11(start.yxz)) * 0.33;
        
        float dt = mix(-uLength, 1.0, fract(uTime * 0.33 * 0.0 + rand11(start) * 0.4));
        float t = position.x * uLength + dt;
        t = clamp(t, 0.0, 1.0);
        float d = distance(start, end);

        vec3 p0 = start;
        vec3 p1 = mix(start, end, 0.2) + d * 0.2 * startMat[2].xyz;
        vec3 p2 = mix(start, end, 0.8) + d * 0.2 * endMat[2].xyz;
        vec3 p3 = end;
        
        // p1 = mix(start, end, 0.33);
        // p2 = mix(start, end, 0.66);

        vec3 normal = normalize(mix(startMat[2].xyz, endMat[2].xyz, t));
        vec3 up = normalize(mix(startMat[1].xyz, endMat[1].xyz, t));
        vec3 tangent = normalize(bezier3_tangent(p0, p1, p2, p3, t));
        
        float shortT = (t - dt) / uLength;
        float width = (position.y - 0.5)
          * easeInThenOut(t, 6.0)
          * easeInThenOut(shortT, 3.0)
          * mix(0.33, 1.0, pcurve(t, 1.0, 2.0)) // Narrower at the end.
          * uWidth;
        
        float randomness = 0.2;
        float startLoopT = rand(start) * randomness;
        float loopT = startLoopT + inverseLerp(0.0, 1.0 - randomness, t);

        vec2 loop = looping(loopT, 0.3, 1.0, 3.0, rand11(start, 0.6, 1.2), 0.3);
        // loop = vec2(t, 0.0);
        
        // Loop Random Scalar:
        vec2 lrs = vec2(
          rand11(start, 0.4, 1.0),
          rand11(start.zyx, 0.9, 1.1));
        vec3 transformed = 
          bezier3(p0, p1, p2, p3, t)
          + tangent * (loop.x - loopT) * d * lrs.x + normal * loop.y * d * lrs.y
          + up * width;
        
        #ifdef USE_ALPHAHASH
          vPosition = transformed;
        #endif
      `)

    super(geometry, material, count)

    this.name = 'lines'
    this.parts = { aStartMat, aEndMat }

    for (let i = 0; i < count; i++) {
      this.setColorAt(i, makeColor(PRNG.pick(['#ff0000', '#00ff00', '#0000ff'])))
    }
  }
}
