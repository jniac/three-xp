'use client'

import { Group, InstancedMesh, MeshBasicMaterial, PlaneGeometry } from 'three'

import { FpsMeter } from 'some-utils-misc/fps-meter'
import { ThreeProvider, useGroup, } from 'some-utils-misc/three-provider'
import { ShaderForge } from 'some-utils-three/shader-forge'
import { makeColor, makeMatrix4 } from 'some-utils-three/utils/make'
import { setup } from 'some-utils-three/utils/tree'
import { glsl_utils } from 'some-utils-ts/glsl/utils'
import { RandomUtils } from 'some-utils-ts/random/random-utils'
import { Ticker } from 'some-utils-ts/ticker'

class OvvoLayers extends Group {
  timescale = 1

  constructor({
    count = 8,
  } = {}) {
    super()
    this.name = 'OvvoLayers'

    const geometry = new PlaneGeometry()

    const material = new MeshBasicMaterial({
      transparent: true,
    })

    const uniforms = {
      uTime: { value: 0 },
    }
    material.onBeforeCompile = shader => ShaderForge.with(shader)
      .defines('USE_UV')
      .uniforms(uniforms)
      .varying({
        vHash: 'vec4',
      })
      .top(glsl_utils)
      .vertex.mainAfterAll(/* glsl */`
        // Push each layer back a little bit to avoid z-fighting
        gl_Position.z += -0.0001 * float(gl_InstanceID);

        vHash = vec4(
          hash(float(gl_InstanceID)),
          hash(float(gl_InstanceID) * 7.3),
          hash(float(gl_InstanceID) * 15.7),
          hash(float(gl_InstanceID) * 23.9)
        );
      `)
      .fragment.after('map_fragment', /* glsl */`
        vec2 uv = vUv;
        float threshold0 = 0.5;
        float amplitude = 0.1;
        float threshold1 = threshold0;

        float time = uTime * 0.333;
        threshold1 += amplitude * sin(uv.x * 1.6783 * (1.0 + vHash.z) + vHash.w * 2.0 * 6.28)
          * sin(time * 0.13 + vHash.y * 6.28);
        threshold1 += amplitude * 0.6 * sin(uv.x * 3.739 * (1.0 + vHash.x) + vHash.y * 2.0 * 6.28)
          * sin(time * 0.1 + vHash.w * 6.28);

        // Small waves
        threshold1 += amplitude * 0.2 * sin(uv.x * 8.2837 * (1.0 + vHash.y) + vHash.z * 2.0 * 6.28)
          * sin(time * 0.1172 + vHash.w * 6.28);
        threshold1 += amplitude * 0.1 * sin(uv.x * 9.7427 * (1.0 + vHash.z) + vHash.x * 2.0 * 6.28)
          * sin(time * 0.1172 + vHash.w * 6.28);

        float d0 = threshold0 + amplitude - uv.y;
        float d1 = threshold1 - uv.y;
        if (d1 > 0.0) {
          float shadow = 1.0 - (d0 * 1.0 + d1 * 2.0) * 0.75;
          shadow = clamp(shadow, 0.0, 1.0);

          diffuseColor.rgb = vec3(0.0);
          diffuseColor.a *= shadow;
        }

        diffuseColor.rgb *= 1.0 + 0.25 * (0.5 - hash(gl_FragCoord.xy * 0.005 + uTime));
      `)

    const mesh = new InstancedMesh(geometry, material, count)
    const ticker = Ticker.get('three')
    mesh.onBeforeRender = () => {
      uniforms.uTime.value += ticker.tick.deltaTime * this.timescale
    }
    this.add(mesh)

    RandomUtils.setRandom('parkmiller', 123456)
    for (let i = 0; i < count; i++) {
      mesh.setMatrixAt(i, makeMatrix4({
        y: (i - (count - 1) / 2) * 0.1,
      }))
      mesh.setColorAt(i, makeColor(RandomUtils.int(0x1000000)))
      mesh.setColorAt(i, makeColor('#535360ff'))
    }
  }
}

function MyScene() {
  useGroup('my-scene', function* (group) {
    setup(new OvvoLayers(), group)
  }, [])
  return null
}

export function PageClient() {
  return (
    <ThreeProvider
      vertigoControls={{
        size: 1,
        zoom: 2,
      }}
    >
      <div className='PageClient layer thru p-16'>
        <h1 className='mb-4 text-3xl font-bold'>
          OVVO Layers
        </h1>
        <p>
          This is a test page for the &quot;OVVO&quot; layers.
        </p>
        <FpsMeter />
      </div>


      <MyScene />
    </ThreeProvider>
  )
}