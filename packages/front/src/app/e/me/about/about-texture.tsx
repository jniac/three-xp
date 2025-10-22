import { CanvasTexture, RepeatWrapping, SRGBColorSpace, Vector2, WebGLRenderer } from 'three'

import { GpuCompute } from 'some-utils-three/experimental/gpu-compute/gpu-compute'

import { config } from '@/config'
import { glsl_utils } from 'some-utils-ts/glsl/utils'

const fontUrl = `${config.assetsPath}fonts/Lithops-Regular.woff2`

const glsl_compute_sdf_2D = /* glsl */ `
  const int MAX_KERNEL_RADIUS = 20;
  // Computes the signed distance field for a binary texture.
  // Use the red channel of the texture as the binary input (0.0 = outside, 1.0 = inside).
  float signedDistanceField(sampler2D uTexture, vec2 vUv, vec2 uTexelSize, int uKernelRadius) {
    float centerValue = texture2D(uTexture, vUv).r;
    bool inside = centerValue > 0.5;

    float minDistance = 1e20;
    vec2 texelAspect = normalize(uTexelSize);

    for (int dy = -MAX_KERNEL_RADIUS; dy <= MAX_KERNEL_RADIUS; dy++) {
      for (int dx = -MAX_KERNEL_RADIUS; dx <= MAX_KERNEL_RADIUS; dx++) {
        if (abs(dx) > uKernelRadius || abs(dy) > uKernelRadius) continue;

        vec2 offset = vec2(float(dx), float(dy)) * uTexelSize;
        vec2 sampleUv = vUv + offset;
        float sampleValue = texture2D(uTexture, sampleUv).r;

        if ((inside && sampleValue <= 0.5) || (!inside && sampleValue > 0.5)) {
          float dist = length(offset / texelAspect);
          minDistance = min(minDistance, dist);
        }
      }
    }

    return inside ? -minDistance : minDistance;
  }
`

async function createStencilTexture() {
  const size = new Vector2(1024, 1024)
  const canvas = document.createElement('canvas')
  canvas.width = size.x
  canvas.height = size.y

  const font = new FontFace('Lithops', `url(${fontUrl})`)
  await font.load()
  await document.fonts.ready

  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, size.x, size.y)
  ctx.fillStyle = '#ff0'
  ctx.font = '430px Lithops'

  let y = 10
  const stepY = 330
  ctx.fillText('Procedural Design', -100, y += stepY)
  ctx.fillText('Algorithmic Art', -300, y += stepY)
  ctx.fillText('Generative Art', -300, y += stepY)

  ctx.globalCompositeOperation = 'screen'
  ctx.fillStyle = '#00f'
  // Note: the blue stripe (line id) has not been tested, overlapping with text may cause artifacts.
  ctx.fillRect(0, y + stepY, size.x, stepY)

  const stencilMap = new CanvasTexture(canvas)
  stencilMap.colorSpace = SRGBColorSpace

  return { stencilMap, size }
}

async function loadStencilTexture() {
  const url = `${config.assetsPath}me/about-bg-map.png`
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = url
  })
  const stencilMap = new CanvasTexture(img)
  stencilMap.colorSpace = SRGBColorSpace
  const size = new Vector2(img.width, img.height)
  return { stencilMap, size }
}

export async function createSdfTexture(renderer: WebGLRenderer) {
  const { stencilMap, size } = await loadStencilTexture()
  const distanceCompute = new GpuCompute({ size, filter: 'linear', generateMipmaps: true, wrap: RepeatWrapping })
    .shaders({
      initial: {
        uniforms: {
          uStencilMap: { value: stencilMap },
          uStencilMapSize: { value: size },
        },
        fragmentTop: `
          ${glsl_compute_sdf_2D}
          ${glsl_utils}
        `,
        fragmentColor: /* glsl */ `
          vec4 stencilTexel = texture2D(uStencilMap, vUv);
          int kernelRadius = 20;
          vec2 texelSize = 1.0 / uStencilMapSize;
          
          float dist = 
            signedDistanceField(uStencilMap, vUv, texelSize, kernelRadius);
          
          dist = dist >= 0.0 
            ? dist
            : spow(dist * 1000.0, 2.0) / 1000.0; // compress negative distances 
          
          dist /= length(texelSize * float(kernelRadius) / 1.414213); // normalize by max distance in kernel

          gl_FragColor = vec4(dist, 0.0, stencilTexel.b, 1.0); // blue is "line id"
          // gl_FragColor = vec4(stencilTexel.r, 1.0, 1.0, 1.0);
      `,
      },
    })
    .initialize(renderer)

  return {
    size,
    map: distanceCompute.currentTexture(),
  }
}
