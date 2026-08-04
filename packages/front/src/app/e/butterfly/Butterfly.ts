import { CatmullRomCurve3, CurvePath, Group, Mesh, MeshBasicMaterial, MeshBasicMaterialParameters, PlaneGeometry, Quaternion, Texture, Vector3 } from 'three'

import { ShaderForge } from 'some-utils-three/shader-forge'
import { setup } from 'some-utils-three/utils/tree'
import { glsl_color_conversion } from 'some-utils-ts/glsl/color-conversion'
import { glsl_stegu_snoise } from 'some-utils-ts/glsl/stegu-snoise'
import { lerp } from 'some-utils-ts/math/basic'
import { easeInOut } from 'some-utils-ts/math/easing'
import { triangle } from 'some-utils-ts/math/waveform'

import butterFlyTypeASvgStr from './assets/butterfly-type-a.svg?raw'

class ButterflyMaterial extends MeshBasicMaterial {
  static shared = (() => {
    const createTexture = () => {
      const img = new Image()
      img.src = `data:image/svg+xml;base64,${btoa(butterFlyTypeASvgStr)}`
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
      .defines('USE_UV')
      .createVarying('sf_vWorldNormal')
      .fragment.top(
        glsl_stegu_snoise,
        glsl_color_conversion,
      )
      .fragment.after('map_fragment', /* glsl */`        
        if (diffuseColor.a < 0.9) {
          discard;
        }

        vec3 sunPosition = normalize(vec3(1, 3, 2));
        float sunLight = dot(sunPosition, sf_vWorldNormal) * 0.5 + 0.5;
        // sunLight = pow(sunLight, 1.5);
        // sunLight = mix(0.1, 1.0, sunLight);
        // float scale = 1.0;
        // float n = fnoise((vUv * 0.3 * scale + 20.9), 1, 0.5) * fnoise((vUv * 8.3 * scale + 1.9), 1, 0.5) * 0.5 + 0.5;
        // diffuseColor.rgb = 
        //   hsl2rgb(vec3(mix(0.2, 0.8, mod(n * 7.5, 1.0)), 1.3, 0.6))
        //   * vec3(0.75, 1.0, 1.0)
        //   * sunLight;

        diffuseColor.rgb *= vec3(sunLight);
      `)
  }

  static #now = Date.now()
  customProgramCacheKey(): string {
    return `ButterflyMaterial-${ButterflyMaterial.#now}`
  }
}

export class Butterfly extends Group {
  static defaultProps = {
    color: 'hsl(249, 27%, 56%)',
  }

  static createParts(instance: Butterfly) {
    const size = 2.4
    const geometry = new PlaneGeometry(ButterflyMaterial.shared.mapAspect, 1)
      .translate(0, 0.5, 0)
      .scale(size, size, size)
    const material = new ButterflyMaterial({ color: instance.props.color })
    const wing1 = setup(new Mesh(geometry, material), instance)
    const wing2 = setup(new Mesh(geometry, material), instance)
    wing1.rotateX(.5)
    wing2.rotateX(-.5)
    return { wing1, wing2 }
  }

  props: typeof Butterfly.defaultProps
  parts: ReturnType<typeof Butterfly.createParts>

  state = {
    time: 0,
    path: <CurvePath<Vector3> | null>null,
    pathCurrentPoint: new Vector3(),
  }

  constructor(props?: Partial<typeof Butterfly.defaultProps>) {
    super()
    this.props = { ...Butterfly.defaultProps, ...props }
    this.parts = Butterfly.createParts(this)
  }

  #update_private = {
    v1: new Vector3(),
    v2: new Vector3(),
    v3: new Vector3(),
    correction: new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), -Math.PI * 0.5),
  }
  update(deltaTime: number) {
    this.state.time += deltaTime

    const frequency = 1

    const wingOpening = easeInOut(triangle(this.state.time, { frequency }), 1.5, 1 / 4)
    const wingAngle = lerp(.2, 1.2, wingOpening)
    this.parts.wing1.rotation.x = wingAngle
    this.parts.wing2.rotation.x = -wingAngle

    const { path } = this.state
    if (path) {
      const { v1, v2, v3, correction } = this.#update_private
      const t = (this.state.time * .05) % 1

      const elevation = easeInOut(triangle(this.state.time, { frequency, phase: -.1 }), 1.5, 1 / 4)
      path.getPointAt(t, v1)
      this.state.pathCurrentPoint.copy(v1)
      v3.set(0, elevation * .5, 0)
      this.position.copy(v3.add(v1))

      path.getTangentAt(t, v2)
      this.lookAt(v2.add(this.position))
      this.quaternion.multiply(correction)
    }
  }

  assignDemoPath() {
    const curve = new CatmullRomCurve3([
      new Vector3(0, 0, 0),
      new Vector3(10, 4, -10),
      new Vector3(0, -1, -20),
      new Vector3(-10, 2, -10),
    ], true)
    this.state.path = new CurvePath<Vector3>()
    this.state.path.add(curve)
  }
}