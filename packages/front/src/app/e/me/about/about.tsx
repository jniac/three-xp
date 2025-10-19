'use client'

import { CanvasTexture, Mesh, MeshBasicMaterial, PlaneGeometry, SRGBColorSpace, Vector2, WebGLRenderer } from 'three'

import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { GpuCompute } from 'some-utils-three/experimental/gpu-compute/gpu-compute'
import { ShaderForge, vec3 } from 'some-utils-three/shader-forge'
import { setup } from 'some-utils-three/utils/tree'
import { glsl_stegu_snoise } from 'some-utils-ts/glsl/stegu-snoise'
import { Ticker } from 'some-utils-ts/ticker'

import { config } from '@/config'

import { glsl_utils } from 'some-utils-ts/glsl/utils'
import { Logo } from '../components/logo'
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

async function createTexture(renderer: WebGLRenderer) {
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

function MyScene() {
  const three = useThreeWebGL()!
  useGroup('my-scene', async function* (group) {
    const material = new MeshBasicMaterial({ map: await createTexture(three.renderer) })
    material.onBeforeCompile = shader => ShaderForge.with(shader)
      .defines('USE_UV')
      .uniforms({
        uTime: Ticker.get('three').uTime,
      })
      .fragment.top(
        glsl_utils,
        glsl_stegu_snoise,
      )
      .fragment.after('map_fragment', /* glsl */`
        float n = fnoise(vec3(vUv * 1.0, uTime * 0.15), 3);
        // n = spow(n, 2.0);
        float d = diffuseColor.r;
        d += n * 0.75;
        // d += -0.5 * (sin(uTime) * 0.5 + 0.5);
        d = smoothstep(0.0, 0.05, d);
        diffuseColor.rgb = mix(${vec3('#979687')}, ${vec3('#220793')}, d);

        // gamma correction
        diffuseColor.rgb = pow(diffuseColor.rgb, vec3(2.2));
      `)
    setup(new Mesh(new PlaneGeometry(), material), group)
  }, [])
  return null
}

export function AboutPage() {
  return (
    <div className='layer bg-[#220793]'>
      <ThreeProvider
        vertigoControls={{
          size: 1.4,
        }}
      >
        <div className='layer thru p-4'>
          <Logo
            colors={{
              diamondTop: '#FAF392',
              diamondSides: '#ECDE0D',
              diamondBottom: '#B6AD1B',
              text: '#ECDE0D',
            }}
          />
        </div>
        <div style={{ position: 'fixed', fontFamily: 'Lithops', visibility: 'hidden' }}>About Page</div>
        <MyScene />
      </ThreeProvider>
    </div>
  )
}