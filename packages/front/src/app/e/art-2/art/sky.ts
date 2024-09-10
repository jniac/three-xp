import { vec3 } from 'some-utils-ts/glsl/conversion'

import { BackSide, IcosahedronGeometry, Mesh, ShaderChunk, ShaderMaterial } from 'three'
import { colors } from './colors'

const vertexShader = /* glsl */ `
  varying vec3 vWorldNormal;

  vec3 rotate(mat4 m, vec3 v) {
    return vec3(
      dot(v, vec3(m[0][0], m[1][0], m[2][0])),  // X component
      dot(v, vec3(m[0][1], m[1][1], m[2][1])),  // Y component
      dot(v, vec3(m[0][2], m[1][2], m[2][2]))   // Z component
    );
  }

  void main() {
    vWorldNormal = normalize(rotate(modelMatrix, position));

    // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    // Ignore the position, we only need the normal:
    gl_Position = projectionMatrix * vec4(rotate(modelViewMatrix, position), 1.0);
  }
`

const fragmentShader =  /* glsl */ `
  ${ShaderChunk.cube_uv_reflection_fragment}

  varying vec3 vWorldNormal;

  float signedDistanceToPlane(vec3 p, vec3 origin, vec3 normal) {
    return dot(normalize(normal), p - origin);
  } 

  void main() {
    float d = signedDistanceToPlane(vWorldNormal, vec3(0.313, 0.0, 0.0), normalize(vec3(-1.0, 1.0, 0.0)));
    float alpha = smoothstep(0.0, 0.001, d);
    gl_FragColor.rgb = mix(${vec3(colors.black)}, ${vec3(colors.red)}, alpha);
    gl_FragColor.rgb = pow(gl_FragColor.rgb, vec3(1.33));
    gl_FragColor.a = 1.0;
  }
`

export class Sky extends Mesh {
  constructor() {
    const material = new ShaderMaterial({
      depthWrite: false,
      side: BackSide,
      vertexShader,
      fragmentShader,
      uniforms: {},
    })

    const geometry = new IcosahedronGeometry(10, 12)
    super(geometry, material)
    this.renderOrder = -1
    this.name = 'sky'
  }
}
