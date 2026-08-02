import { Color, Mesh, ShaderMaterial, Texture } from 'three'
import { MSDFTextGeometry, uniforms } from 'three-msdf-text-utils'

import { useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { TransformTool } from 'some-utils-three/objects/tools'
import { setup } from 'some-utils-three/utils/tree'
import { find } from 'some-utils-three/utils/tree/find'

import geistMonoData from '@/fonts/msdf/geist/geist-mono-latin-600-normal-msdf-atlas.png?base64'
import geistMonoJson from '@/fonts/msdf/geist/geist-mono-latin-600-normal-msdf.json'

import { Umbellifer } from '../me/about/umbellifer'
import { Butterfly } from './Butterfly'

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

class MSDFMaterial extends ShaderMaterial {
  static createUniforms() {
    return {
      ...cloneUniforms(uniforms.common),
      ...cloneUniforms(uniforms.rendering),
      ...cloneUniforms(uniforms.strokes),
      uDepthOffset: { value: 0 },
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
      vertexShader: /* glsl */`
        // Uniforms
        uniform float uDepthOffset;
        
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

          gl_Position.w += uDepthOffset;

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
      fragmentShader: /* glsl */`
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

  static #now = Date.now()
  customProgramCacheKey(): string {
    return `MSDFMaterial-${MSDFMaterial.#now}`
  }
}

export function getMesh() {
  const geometry = new MSDFTextGeometry({
    text: 'Hello',
    font: geistMonoJson,
  })

  const image = new Image()
  image.src = geistMonoData
  image.onload = () => {
    atlasTexture.needsUpdate = true
  }
  const atlasTexture = new Texture(image)
  atlasTexture.needsUpdate = true

  const material = new MSDFMaterial()
  material.uniforms.uColor.value.set('#220793')
  material.uniforms.uDepthOffset.value = -0.1
  material.uniforms.uMap.value = atlasTexture

  const mesh = new Mesh(geometry, material)
  mesh.scale.setScalar(1 / 50)
  mesh.rotation.x = -Math.PI
  mesh.position.set(-10, 0, 0)
  return mesh
}


export function MyScene() {
  const three = useThreeWebGL()
  useGroup('my-scene', async function* (group) {
    setup(new DebugHelper(), group)
      .regularGrid({ subdivisions: [30], opacity: [.01] })

    three.scene.background = new Color('hsl(257, 24%, 6%)')

    setup(new Butterfly({ color: 'white' }), {
      position: [0, 1.5, 2.4],
      rotation: [.3, .02, .53],
      parent: group,
    })

    setup(new Butterfly(), {
      position: [5.45, -3.90, 1.01],
      rotation: [.82, 1.25, -.07],
      parent: group,
    })

    yield three.ticker.onTick(tick => {
      for (const child of group.children) {
        if (child instanceof Butterfly) {
          child.update(tick.deltaTime)
        }
      }
    })

    setup(getMesh(), group)

    setup(new Umbellifer({
      seed: 1234,
      scaleFactor: 8,
      lineWidthFactor: 1.5,
      splitIndices: [[2], [1]],
      stemColor: 'hsl(249, 27%, 56%)',
      leafColor: '#e8e8e8',
    }), {
      position: [4.6, -17.4, -3.8],
      rotation: [.19, .47, 0],
      parent: group,
    })

    if (false) {
      const tool = setup(new TransformTool(), group)
      // tool.attach(find(group, Umbellifer)!, { localPivot: [0, 20, 0] })
      tool.attach(find(group, Butterfly)!)
    }
  }, [])
  return null
}