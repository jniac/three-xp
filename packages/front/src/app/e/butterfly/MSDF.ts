import { Box3, Color, Mesh, ShaderMaterial, Sphere, Texture, Vector3 } from 'three'
import { MSDFTextGeometry as MSDFTextBaseGeometry, uniforms } from 'three-msdf-text-utils'

import geistMonoData from '@/fonts/msdf/geist/geist-mono-latin-600-normal-msdf-atlas.png?base64'
import geistMonoJson from '@/fonts/msdf/geist/geist-mono-latin-600-normal-msdf.json'

function cloneUniforms<T extends Record<string, { value: any }>>(
  uniforms: T,
  {
    cloneTextures = false,
  } = {}
): T {
  const clonedUniforms: Record<string, any> = {}
  for (const key in uniforms) {
    let value = uniforms[key].value

    if (value && typeof value === 'object') {
      if (value instanceof Texture) {
        if (cloneTextures) {
          value = value.clone()
        }
      }

      else if (value && typeof value.clone === 'function') {
        value = value.clone()
      }


      // For some reason
      else if ('r' in value && 'g' in value && 'b' in value) {
        value = new Color(value.r, value.g, value.b)
      }

      else {
        throw new Error(`Cannot clone uniform value for key "${key}"`)
      }
    }

    clonedUniforms[key] = { value }
  }
  return clonedUniforms as T
}

export class MSDFMaterial extends ShaderMaterial {
  static createUniforms() {
    return {
      ...cloneUniforms(uniforms.common),
      ...cloneUniforms(uniforms.rendering),
      ...cloneUniforms(uniforms.strokes),
      uClipDepthOffset: { value: 0 },
    }
  }

  uniforms: ReturnType<typeof MSDFMaterial.createUniforms>

  constructor() {
    const uniforms = MSDFMaterial.createUniforms()
    super({
      side: 2,
      transparent: true,
      defines: {
        IS_SMALL: false,
      },
      uniforms: uniforms,
      vertexShader: /* glsl */ `
        // Uniforms
        uniform float uClipDepthOffset;
        
        // Attribute
        attribute vec2 layoutUv;

        attribute float lineIndex;

        attribute float lineLettersTotal;
        attribute float lineLetterIndex;

        attribute float lineWordsTotal;
        attribute float lineWordIndex;

        attribute float wordIndex;

        attribute float letterIndex;

        // Varyings
        varying vec2 vUv;
        varying vec2 vLayoutUv;
        varying vec3 vViewPosition;
        varying vec3 vNormal;

        varying float vLineIndex;

        varying float vLineLettersTotal;
        varying float vLineLetterIndex;

        varying float vLineWordsTotal;
        varying float vLineWordIndex;

        varying float vWordIndex;

        varying float vLetterIndex;

        void main() {
          // Output
          vec4 mvPosition = vec4(position, 1.0);
          mvPosition = modelViewMatrix * mvPosition;
          gl_Position = projectionMatrix * mvPosition;

          gl_Position.w += uClipDepthOffset;

          // Varyings
          vUv = uv;
          vLayoutUv = layoutUv;
          vViewPosition = -mvPosition.xyz;
          vNormal = normal;

          vLineIndex = lineIndex;

          vLineLettersTotal = lineLettersTotal;
          vLineLetterIndex = lineLetterIndex;

          vLineWordsTotal = lineWordsTotal;
          vLineWordIndex = lineWordIndex;

          vWordIndex = wordIndex;

          vLetterIndex = letterIndex;
        }
    `,
      fragmentShader: /* glsl */ `
        // Varyings
        varying vec2 vUv;

        // Uniforms: Common
        uniform float uOpacity;
        uniform float uThreshold;
        uniform float uAlphaTest;
        uniform vec3 uColor;
        uniform sampler2D uMap;

        // Uniforms: Strokes
        uniform vec3 uStrokeColor;
        uniform float uStrokeOutsetWidth;
        uniform float uStrokeInsetWidth;

        // Utils: Median
        float median(float r, float g, float b) {
          return max(min(r, g), min(max(r, g), b));
        }

        void main() {
          // Common
          // Texture sample
          vec3 s = texture2D(uMap, vUv).rgb;

          // Signed distance
          float sigDist = median(s.r, s.g, s.b) - 0.5;

          float afwidth = 1.4142135623730951 / 2.0;

          #ifdef IS_SMALL
            float alpha = smoothstep(uThreshold - afwidth, uThreshold + afwidth, sigDist);
          #else
            float alpha = clamp(sigDist / fwidth(sigDist) + 0.5, 0.0, 1.0);
          #endif

          // Strokes
          // Outset
          float sigDistOutset = sigDist + uStrokeOutsetWidth * 0.5;

          // Inset
          float sigDistInset = sigDist - uStrokeInsetWidth * 0.5;

          #ifdef IS_SMALL
            float outset = smoothstep(uThreshold - afwidth, uThreshold + afwidth, sigDistOutset);
            float inset = 1.0 - smoothstep(uThreshold - afwidth, uThreshold + afwidth, sigDistInset);
          #else
            float outset = clamp(sigDistOutset / fwidth(sigDistOutset) + 0.5, 0.0, 1.0);
            float inset = 1.0 - clamp(sigDistInset / fwidth(sigDistInset) + 0.5, 0.0, 1.0);
          #endif

          // Border
          float border = outset * inset;

          // Alpha Test
          if (alpha < uAlphaTest) discard;

          // Output: Common
          vec4 filledFragColor = vec4(uColor, uOpacity * alpha);

          // Output: Strokes
          vec4 strokedFragColor = vec4(uStrokeColor, uOpacity * border);

          gl_FragColor = filledFragColor;
        }
    `,
    })
    this.uniforms = uniforms
  }

  static #now = Date.now();
  customProgramCacheKey(): string {
    return `MSDFMaterial-${MSDFMaterial.#now}`
  }
}

class MSDFTextGeometry extends MSDFTextBaseGeometry {
  constructor(options: Exclude<ConstructorParameters<typeof MSDFTextBaseGeometry>[0], string>) {
    super(options)
    const scalar = 1 / options.font.common.base
    this.scale(scalar, -scalar)
    console.log(this.boundingSphere)
  }

  /**
   * MSDFTextGeometry position item's size is 2, so scale should be implemented accordingly.
   */
  override scale(x: number, y: number, z?: number): this {
    const array = this.attributes.position.array as Float32Array
    const min = new Vector3(Infinity, Infinity, 0)
    const max = new Vector3(-Infinity, -Infinity, 0)
    for (let i = 0; i < array.length; i += 2) {
      const newX = array[i] * x
      const newY = array[i + 1] * y
      min.x = Math.min(min.x, newX)
      array[i] = newX
      array[i + 1] = newY
      min.x = Math.min(min.x, newX)
      min.y = Math.min(min.y, newY)
      max.x = Math.max(max.x, newX)
      max.y = Math.max(max.y, newY)
    }
    this.boundingBox ??= new Box3()
    this.boundingBox.set(min, max)
    this.boundingSphere ??= new Sphere()
    this.boundingBox.getBoundingSphere(this.boundingSphere)
    return this
  }

  uniformScale(scalar: number) {
    this.scale(scalar, scalar, scalar)
  }
}

export class MSDFTextMesh extends Mesh {
  constructor(text: string, {
    color = '#fff',
    font = geistMonoJson,
    atlasBase64 = geistMonoData,
  } = {}) {
    const geometry = new MSDFTextGeometry({
      text,
      font,
    })

    const image = new Image()
    image.src = atlasBase64
    image.onload = () => {
      atlasTexture.needsUpdate = true
    }
    const atlasTexture = new Texture(image)
    atlasTexture.needsUpdate = true

    const material = new MSDFMaterial()
    material.uniforms.uColor.value.set(color).convertSRGBToLinear()
    material.uniforms.uClipDepthOffset.value = .0001
    material.uniforms.uMap.value = atlasTexture

    super(geometry, material)
  }
}
