import { CanvasTexture, SRGBColorSpace, Vector2, WebGLRenderer } from 'three'

import { ThreeProvider } from 'some-utils-misc/three-provider'
import { GpuCompute } from 'some-utils-three/experimental/gpu-compute/gpu-compute'

import { config } from '@/config'

import { Logo } from '../components/logo'
import { AboutLayoutProvider } from './about-layout'
import { AboutScene } from './scene'

import './about.css'

const fontUrl = config.assetsPath + 'fonts/Lithops-Regular.woff2'

const glsl_compute_sdf_2D = /* glsl */`
  const int MAX_KERNEL_RADIUS = 20;
  float signedDistanceField(sampler2D uTexture, vec2 vUv, vec2 uTexelSize, int uKernelRadius) {
    float centerValue = texture2D(uTexture, vUv).r;
    bool inside = centerValue > 0.5;

    float minDistance = 1e20;

    for (int dy = -MAX_KERNEL_RADIUS; dy <= MAX_KERNEL_RADIUS; dy++) {
        for (int dx = -MAX_KERNEL_RADIUS; dx <= MAX_KERNEL_RADIUS; dx++) {
            if (abs(dx) > uKernelRadius || abs(dy) > uKernelRadius) continue;

            vec2 offset = vec2(float(dx), float(dy)) * uTexelSize;
            vec2 sampleUv = vUv + offset;
            float sampleValue = texture2D(uTexture, sampleUv).r;

            if ((inside && sampleValue <= 0.5) || (!inside && sampleValue > 0.5)) {
                float dist = length(offset);
                minDistance = min(minDistance, dist);
            }
        }
    }

    return inside ? -minDistance : minDistance;
  }
`

export async function createTexture(renderer: WebGLRenderer) {
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
  ctx.fillStyle = '#ffffff'
  ctx.font = '400px Lithops'

  let y = 60
  ctx.fillText('Procedural Design', -100, y += 300)
  ctx.fillText('Algorithmic Art', -300, y += 300)
  ctx.fillText('Generative Art', -300, y += 300)

  const stencilMap = new CanvasTexture(canvas)
  stencilMap.colorSpace = SRGBColorSpace

  const distanceCompute = new GpuCompute({ size, filter: 'linear' })
    .shaders({
      initial: {
        uniforms: {
          uStencilMap: { value: stencilMap },
        },
        fragmentTop: glsl_compute_sdf_2D,
        fragmentColor: /* glsl */`
          vec4 stencilTexel = texture2D(uStencilMap, vUv);
          int kernelRadius = 20;
          vec2 texelSize = 1.0 / uTextureSize;
          float dist = 
            signedDistanceField(uStencilMap, vUv, texelSize, kernelRadius)
            / length(texelSize * float(kernelRadius) / 1.414213); // normalize by max distance in kernel
          gl_FragColor = vec4(dist, stencilTexel.r, 0.0, 1.0);
          // gl_FragColor = vec4(stencilTexel.r, 1.0, 1.0, 1.0);
      `,
      },
    })
    .initialize(renderer)

  return distanceCompute.currentTexture()
}

function Header() {
  return (
    <div className='relative flex p-4'>
      <Logo
        colors={{
          diamondTop: '#FAF392',
          diamondSides: '#ECDE0D',
          diamondBottom: '#B6AD1B',
          text: '#ECDE0D',
        }}
      />
    </div>
  )
}

export function AboutPage() {
  return (
    <div className='layer bg-[#220793]'>
      <AboutLayoutProvider>
        <ThreeProvider
          vertigoControls={{
            size: 1.4,
          }}
        >
          <div className='layer thru flex flex-col'>
            <Header />
            <div className='mx-4 h-[2px] bg-[blue] rounded-[1px]' />
            <div className='flex-1 flex flex-row'>
              <div className='flex-1' />
              <div className='my-4 w-[2px] bg-[blue] rounded-[1px]' />
              <div className='flex-1' />
            </div>
          </div>
          <div style={{ position: 'fixed', fontFamily: 'Lithops', visibility: 'hidden' }}>About Page</div>
          <AboutScene />
        </ThreeProvider>
      </AboutLayoutProvider>
    </div>
  )
}