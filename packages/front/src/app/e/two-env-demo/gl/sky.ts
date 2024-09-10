import { BackSide, IcosahedronGeometry, Mesh, ShaderMaterial, Texture } from 'three'

import cube_uv_reflection_fragment from '../glsl/cube_uv_reflection_fragment.glsl'

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
    vWorldNormal = rotate(modelMatrix, position);

    // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    // Ignore the position, we only need the normal:
    gl_Position = projectionMatrix * vec4(rotate(modelViewMatrix, position), 1.0);
  }
`

const fragmentShader =  /* glsl */ `
  ${cube_uv_reflection_fragment}

  uniform sampler2D envMap1;
  uniform sampler2D envMap2;
  uniform float uEnvMix;
  uniform float uRoughness;
  
  varying vec3 vWorldNormal;

  void main() {
    vec3 env1 = textureCubeUV(envMap1, vWorldNormal, uRoughness).rgb;
    vec3 env2 = textureCubeUV(envMap2, vWorldNormal, uRoughness).rgb;
    gl_FragColor = vec4(mix(env1, env2, uEnvMix), 1.0);
  }
`

/**
 * Copy-pasted from https://github.com/mrdoob/three.js/blob/dev/src/renderers/webgl/WebGLProgram.js#L462-L476
 */
function _generateCubeUVSize(imageHeight: number) {
  const maxMip = Math.log2(imageHeight) - 2
  const texelHeight = 1.0 / imageHeight
  const texelWidth = 1.0 / (3 * Math.max(Math.pow(2, maxMip), 7 * 16))
  return { texelWidth, texelHeight, maxMip }
}

export function createSky(envMap1: Texture, envMap2: Texture) {
  const {
    texelWidth,
    texelHeight,
    maxMip,
  } = _generateCubeUVSize(envMap1.image.height)

  const sky = new Mesh(
    new IcosahedronGeometry(10, 8),
    new ShaderMaterial({
      depthWrite: false, // The sky should not write to the depth buffer
      defines: {
        ENVMAP_TYPE_CUBE_UV: '',
        CUBEUV_MAX_MIP: maxMip.toFixed(1),
        CUBEUV_TEXEL_WIDTH: texelWidth.toFixed(6),
        CUBEUV_TEXEL_HEIGHT: texelHeight.toFixed(6),
      },
      uniforms: {
        envMap1: { value: envMap1 },
        envMap2: { value: envMap2 },
        uEnvMix: { value: 0 },
        uRoughness: { value: .5 },
      },
      vertexShader,
      fragmentShader,
      side: BackSide
    })
  )

  sky.renderOrder = -1

  return sky
}
