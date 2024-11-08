import { BufferGeometry, ColorRepresentation, DataTexture, Line, LineDashedMaterial, NearestFilter, RepeatWrapping, RGBAFormat, Vector3 } from 'three'

import { ShaderForge } from 'some-utils-three/shader-forge'
import { PRNG } from 'some-utils-ts/random/prng'
import { Ticker } from 'some-utils-ts/ticker'

function createRandomTexture(length = 512) {
  const data = new Uint8Array(length * 4)
  let i = 0
  while (i < length) {
    let dashSize = PRNG.int(10, 20)
    if (i + dashSize > length) dashSize = length - i
    for (let j = 0; j < dashSize; j++) {
      const i2 = i + j
      data[i2 * 4] = 255 // R
    }
    i += dashSize
    i += PRNG.int(1, 80)
  }
  for (let i = 0; i < length; i += 2) {
    data[i * 4 + 1] = 255 // G
  }
  const texture = new DataTexture(data, length, 1, RGBAFormat)
  texture.minFilter = texture.magFilter = NearestFilter
  texture.wrapS = texture.wrapT = RepeatWrapping
  texture.needsUpdate = true
  return texture
}

export class AnimatedCurve extends Line {
  constructor(points: Vector3[], { color = <ColorRepresentation>'white' } = {}) {

    const geometry = new BufferGeometry().setFromPoints(points)
    const material = new LineDashedMaterial({ color })
    const texture = createRandomTexture()
    const uniforms = {
      uTime: Ticker.get('three').uTime,
      uTextureLengthRatio: { value: 40 },
      uScale: { value: 1 },
      uTexture: { value: texture },
      uLineLength: { value: -1 },
    }
    material.onBeforeCompile = shader => ShaderForge.with(shader)
      .uniforms(uniforms)
      .varying({
        vWorldPosition2: 'vec3',
      })
      .vertex.mainAfterAll(/* glsl */ `
        vWorldPosition2 = (modelMatrix * vec4(position, 1.0)).xyz;
      `)
      .fragment.top(/* glsl */ `
        float hash(vec3 p) {
          // Combine the components of the vec3 using dot products
          vec3 k = vec3(127.1, 311.7, 74.7); // Large primes to create randomness
          return fract(sin(dot(p, k)) * 43758.5453123); // Sine and fract create pseudo-randomness
        }
      `)
      .fragment.replace(/if .* {\s*discard;\s*}/, /* glsl */ `
        float alpha = vLineDistance / uLineLength;
        alpha = pow(alpha, 1.0 / 2.0);
        float x = mod(uLineLength * alpha / uTextureLengthRatio + uTime * -0.05, 1.0);
        vec4 texel = texture2D(uTexture, vec2(x, 0.5));
        float outHash = fract(hash(vWorldPosition2) + uTime * 10.0) + mix(5.0, -1.0, alpha);
        if (texel.r * outHash < 0.5) {
          discard;
        }
      `)

    super(geometry, material)

    this.computeLineDistances()

    // https://github.com/mrdoob/three.js/blob/master/src/objects/Line.js#L69
    uniforms.uLineLength.value = this.geometry.attributes.lineDistance.array.at(-1)!
  }
}
