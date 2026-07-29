import { Group, Mesh, MeshBasicMaterial, MeshBasicMaterialParameters, PlaneGeometry, Texture } from 'three'

import { ShaderForge } from 'some-utils-three/shader-forge'
import { setup } from 'some-utils-three/utils/tree'
import { remap } from 'some-utils-ts/math/basic'
import { Tick } from 'some-utils-ts/ticker'

import { glsl_stegu_snoise } from 'some-utils-ts/glsl/stegu-snoise'
import butterFlyTypeABase64 from './assets/butterfly-type-a.png?base64'

class ButterflyMaterial extends MeshBasicMaterial {
  static shared = (() => {
    const createTexture = () => {
      const img = new Image()
      img.src = butterFlyTypeABase64
      img.onload = () => {
        texture.needsUpdate = true
      }
      const texture = new Texture(img)
      return texture
    }
    const isClient = typeof window !== 'undefined'
    const shared = {
      map: isClient ? createTexture() : new Texture(),
      mapAspect: 332 / 268,
    }
    return shared
  })()

  constructor(params?: MeshBasicMaterialParameters) {
    super({
      side: 2,
      ...params,
      map: ButterflyMaterial.shared.map,
    })
    this.onBeforeCompile = shader => ShaderForge.with(shader)
      .createVarying('sf_vWorldNormal')
      .fragment.top(glsl_stegu_snoise)
      .fragment.after('map_fragment', /* glsl */`        
        float alpha = max(diffuseColor.r, max(diffuseColor.g, diffuseColor.b));
        if (alpha < 0.9) {
          discard;
        }

        vec3 sunPosition = normalize(vec3(1, 3, 2));
        float sunLight = dot(sunPosition, sf_vWorldNormal) * 0.5 + 0.5;
        // sunLight = pow(sunLight, 1.5);
        // sunLight = mix(0.1, 1.0, sunLight);
        diffuseColor.rgb = vec3(1.0) * sunLight;
      `)
  }

  static #now = Date.now()
  customProgramCacheKey(): string {
    return `ButterflyMaterial-${ButterflyMaterial.#now}`
  }
}

export class Butterfly extends Group {
  parts = (() => {
    const size = 2.4
    const geometry = new PlaneGeometry(ButterflyMaterial.shared.mapAspect, 1)
      .translate(0, 0.5, 0)
      .scale(size, size, size)
    const material = new ButterflyMaterial()
    const wing1 = setup(new Mesh(geometry, material), this)
    const wing2 = setup(new Mesh(geometry, material), this)
    wing1.rotateX(.5)
    wing2.rotateX(-.5)
    return { wing1, wing2 }
  })()

  state = {
    time: 0,
  }

  onTick(tick: Tick) {
    this.state.time += tick.deltaTime
    const angle = remap(Math.sin(this.state.time * 4), -1, 1, .2, 1.2)
    this.parts.wing1.rotation.x = angle
    this.parts.wing2.rotation.x = -angle

    // this.rotation.z = .1
  }
}