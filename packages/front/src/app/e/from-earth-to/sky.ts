import { ShaderForge } from 'some-utils-three/shader-forge'
import { setup } from 'some-utils-three/utils/tree'
import { PRNG } from 'some-utils-ts/random/prng'
import { BackSide, BufferGeometry, Float32BufferAttribute, Group, IcosahedronGeometry, Mesh, MeshBasicMaterial, Points, PointsMaterial, Vector2, Vector3 } from 'three'
import { randomPointOnUnitSphere } from './utils'

const RADIUS = 40

class Sphere extends Mesh {
  constructor() {
    const material = new MeshBasicMaterial({
      color: '#cccccc',
      side: BackSide,
    })

    const uniforms = {
      uResolution: { value: new Vector2() },
    }

    material.onBeforeCompile = shader => ShaderForge.with(shader)
      .uniforms(uniforms)
      .fragment.replace('map_fragment', /* glsl */ `
        vec2 p = gl_FragCoord.xy / uResolution * 2.0 - 1.0;
        float aspect = uResolution.x / uResolution.y;
        p *= aspect > 1.0 ? vec2(1.0, 1.0 / aspect) : vec2(aspect, 1.0);
        float alpha = 1.0 - length(p);
        diffuseColor.rgb *= mix(0.8, 1.4, alpha);
      `)

    const geometry = new IcosahedronGeometry(RADIUS, 12)
    super(geometry, material)

    this.onBeforeRender = (renderer) => {
      renderer
        .getSize(uniforms.uResolution.value)
        .multiplyScalar(renderer.getPixelRatio())
    }
  }
}

class Stars extends Points {
  constructor(count = 5000) {
    const geometry = new BufferGeometry()
    const positions = new Float32Array(count * 3)
    const instanceSizes = new Float32Array(count)
    const vector = new Vector3()
    for (let i = 0; i < count; i++) {
      randomPointOnUnitSphere(vector)
        .multiplyScalar(RADIUS * 0.9)
        .toArray(positions, i * 3)
      instanceSizes[i] = PRNG.between(.2, .5)
    }
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
    geometry.setAttribute('instanceSize', new Float32BufferAttribute(instanceSizes, 1))
    const material = new PointsMaterial({
      color: '#ffffff',
    })
    material.onBeforeCompile = shader => ShaderForge.with(shader)
      .vertex.top(/* glsl */ `
        attribute float instanceSize;
      `)
      .vertex.mainAfterAll(/* glsl */ `
        gl_PointSize *= instanceSize;
      `)
      .fragment.mainBeforeAll(/* glsl */ `
        float dist = length(gl_PointCoord - 0.5);
        if (dist > 0.5) discard;
      `)
    super(geometry, material)
  }
}

export class Sky extends Group {
  parts = {
    sphere: setup(new Sphere(), this),
    stars: setup(new Stars(), this),
  }
}
