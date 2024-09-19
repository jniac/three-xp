'use client'
import { AxesGeometry } from 'some-utils-three/geometries/axis'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { ShaderForge } from 'some-utils-three/shader-forge'
import { glsl_easings } from 'some-utils-ts/glsl/easings'
import { TickCallback, Ticker } from 'some-utils-ts/ticker'
import { DoubleSide, Mesh, MeshPhysicalMaterial, Object3D, PlaneGeometry } from 'three'
import { glsl_looping } from './looping'
import { addTo } from './utils'

class Axes extends Mesh {
  constructor() {
    super(
      new AxesGeometry({
        xColor: '#ff338b',
        yColor: '#33cc9c',
        zColor: '#4e33ff',
      }),
      new AutoLitMaterial()
    )
  }
}

export class AxesToAxesDemo extends Object3D {
  axes1 = addTo(new Axes(), this)
  axes2 = addTo(new Axes(), this)

  onTick: TickCallback = ({ deltaTime }) => {
    const { axes1, axes2 } = this
    axes1.rotation.y += .5 * deltaTime
    axes2.rotation.x += .5 * deltaTime
  }

  constructor() {
    super()

    const { axes1, axes2 } = this

    axes1.position.set(-1, 0, 0)
    axes1.rotation.x = -Math.PI / 2

    axes2.position.set(1, 0, 0)
    axes2.rotation.x = -Math.PI / 2

    const geometry = new PlaneGeometry(1, 1, 1000, 1).translate(.5, .5, 0)
    const material = new MeshPhysicalMaterial({
      side: DoubleSide,
      flatShading: true,
      emissiveIntensity: .25,
      emissive: '#ffffff',
    })
    addTo(new Mesh(geometry, material), this)

    const uniforms = {
      uTime: { get value() { return Ticker.current().time } },
      uWidth: { value: .6 },
      uStartMatrix: { value: axes1.matrix },
      uEndMatrix: { value: axes2.matrix },
    }

    material.onBeforeCompile = shader => ShaderForge.with(shader)
      .uniforms(uniforms)
      .vertex.top(
        glsl_easings,
        glsl_looping)
      .vertex.top(/* glsl */ `
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
        vec3 start = uStartMatrix[3].xyz;
        vec3 end = uEndMatrix[3].xyz;

        vec3 p0 = start;
        vec3 p1 = mix(start, end, 0.0) + uStartMatrix[2].xyz;
        vec3 p2 = mix(start, end, 1.0) + uEndMatrix[2].xyz;
        vec3 p3 = end;

        vec3 up = mix(uStartMatrix[1].xyz, uEndMatrix[1].xyz, position.x);
        vec3 tangent = bezier3_tangent(p0, p1, p2, p3, position.x);
        vec3 normal = cross(tangent, up);

        float width = (position.y - 0.5)
          // * easeInThenOut(position.x, 3.0)
          * uWidth;

        vec2 loop = looping(position.x);

        vec3 transformed = 
          bezier3(p0, p1, p2, p3, position.x)
          + tangent * (loop.x - position.x) * 2.0 + normal * loop.y * 2.0
          + up * width;
      `)
      .vertex.replace('project_vertex', /* glsl */`
        vec4 mvPosition = vec4( transformed, 1.0 );
        #ifdef USE_BATCHING
          mvPosition = batchingMatrix * mvPosition;
        #endif
        #ifdef USE_INSTANCING
          mvPosition = instanceMatrix * mvPosition;
        #endif
        mvPosition = modelViewMatrix * mvPosition;
        gl_Position = projectionMatrix * mvPosition;
      `)
  }
}
