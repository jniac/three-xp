'use client'

import { Color, Mesh, MeshBasicMaterial, PlaneGeometry, Vector2 } from 'three'

import { useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { ShaderForge, vec3 } from 'some-utils-three/shader-forge'
import { setup } from 'some-utils-three/utils/tree'
import { glsl_stegu_snoise } from 'some-utils-ts/glsl/stegu-snoise'
import { glsl_utils } from 'some-utils-ts/glsl/utils'
import { Rectangle } from 'some-utils-ts/math/geom/rectangle'
import { Message } from 'some-utils-ts/message'
import { Ticker } from 'some-utils-ts/ticker'

import { fromVector2Declaration } from 'some-utils-three/declaration'
import { Vector2Declaration } from 'some-utils-ts/declaration'
import { Space } from 'some-utils-ts/experimental/layout/flex'
import { glsl_ramp } from 'some-utils-ts/glsl/ramp'
import { glsl_uv_size } from 'some-utils-ts/glsl/uv-size'
import { FilmPass } from 'three/examples/jsm/Addons.js'
import { useAboutLayout } from './about-layout'
import { createSdfTexture } from './about-texture'
import { Plant } from './plant'

class LayoutDebugHelper extends DebugHelper {
  #inner = { rect: new Rectangle() }
  drawLayout(root: Space, sceneSize: Vector2Declaration): this {
    this.clear()
    const { rect } = this.#inner
    const colors = ['#f0f', '#0ff', '#ff0'].map(c => new Color(c))
    let index = 0
    const [sx, sy] = fromVector2Declaration(sceneSize)
    for (const space of root.allLeaves()) {
      space
        .getUvRect({ out: rect, flipY: true })
        .transform(-sx / 2, -sy / 2, sx, sy)
      this.rect(rect, { color: colors[index], diagonals: true, corners: { size: .05 } })
      index = (index + 1) % colors.length
    }
    return this
  }
}

export function AboutScene() {
  const three = useThreeWebGL()!
  const aboutLayout = useAboutLayout()
  useGroup('my-scene', async function* (group) {
    three.pipeline.basicPasses.fxaa.enabled = false
    three.pipeline.basicPasses.output

    const grainPass = new FilmPass(.5, false)
    three.pipeline.composer.addPass(grainPass)
    yield () => three.pipeline.composer.removePass(grainPass)

    const uniforms = {
      uAboutMap: { value: await createSdfTexture(three.renderer) },
      uPlaneSize: { value: new Vector2() },
      uTime: Ticker.get('three').uTime,
    }

    const material = new MeshBasicMaterial({
      transparent: true,
    })

    material.onBeforeCompile = shader => ShaderForge.with(shader)
      .defines('USE_UV')
      .uniforms(uniforms)
      .fragment.top(
        glsl_utils,
        glsl_stegu_snoise,
        glsl_uv_size,
        glsl_ramp,
      )
      .fragment.top(/* glsl */ `
        float siiiin(float x) {
          return sin(x * 3.14159265);
        }
      `)
      .fragment.after('map_fragment', /* glsl */ `
        float timeScale = 0.05;
        vec2 uv = applyUvSize(vUv, uPlaneSize.x / uPlaneSize.y, 1.0);
        float d = texture(uAboutMap, uv).r;
        float n = fnoise(vec3(uv * 0.25 * vec2(1.0, 8.0), uTime * timeScale), 3);
        float n2 = fnoise(vec3(uv * 0.25 * vec2(1.0, 8.0), (uTime + 1.3) * timeScale), 3);
        // n = spow(n, 2.0);
        d += n * 0.75;
        // d += -0.5 * (sin(uTime) * 0.5 + 0.5);
        d = smoothstep(0.0, 0.05, d);
        // diffuseColor.rgb = mix(${vec3('#979687')}, ${vec3('#220793')}, d);
        // diffuseColor.rgb = ${vec3('#979687')};
        // diffuseColor.rgb = ${vec3('#220793')};

        n2 = n2 * 0.8 + 0.5;

        // diffuseColor.rgb = mix(${vec3('#0993efff')}, ${vec3('#220793')}, mix(n2, siiiin(n2 * 5.0), 0.15));
        float t = mix(n2, siiiin(n2 * 5.0), 0.15);
        Vec3Ramp r = ramp(t, ${vec3('#0993efff')}, ${vec3('#2556d2ff')}, ${vec3('#220793')});
        diffuseColor.rgb = mix(r.a, r.b, r.t);

        // gamma correction
        diffuseColor.rgb = pow(diffuseColor.rgb, vec3(2.2));
        diffuseColor.a *= oneMinus(d);
      `)

    const plane = setup(new Mesh(new PlaneGeometry(), material), group)

    const controls = Message.send<VertigoControls>(VertigoControls).assertPayload()
    const helper = setup(new LayoutDebugHelper(), group)
    helper.visible = false

    const plant1 = setup(new Plant(), group)
      .setPositionOnScene(size => {
        plant1.position.set(-size.x * .16, -size.y * .48, .75)
        plant1.rotation.set(0, .25, 0)
      })

    yield aboutLayout.changeObs.onChange({ executeImmediately: true }, tick => {
      if (aboutLayout.isReady === false)
        return

      if (helper.visible)
        helper.drawLayout(aboutLayout.root, controls.dampedVertigo.state.realSize)

      const [sx, sy] = controls.dampedVertigo.state.realSize
      const rect = aboutLayout.left.getUvRect({ flipY: true }).transform(-sx / 2, -sy / 2, sx, sy)
      plane.position.set(rect.centerX, rect.centerY, 0)
      plane.scale.set(rect.width, rect.height, 1)
      uniforms.uPlaneSize.value.set(rect.width, rect.height)

      plant1.positionOnScene?.(controls.dampedVertigo.state.realSize)
    })
  }, [])

  return null
}
