'use client'

import { Color, Mesh, MeshBasicMaterial, PlaneGeometry } from 'three'

import { useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { ShaderForge, vec3 } from 'some-utils-three/shader-forge'
import { setup } from 'some-utils-three/utils/tree'
import { Space } from 'some-utils-ts/experimental/layout/flex'
import { glsl_stegu_snoise } from 'some-utils-ts/glsl/stegu-snoise'
import { glsl_utils } from 'some-utils-ts/glsl/utils'
import { Rectangle } from 'some-utils-ts/math/geom/rectangle'
import { Message } from 'some-utils-ts/message'
import { Ticker } from 'some-utils-ts/ticker'

import { createTexture } from './about'
import { useAboutLayout } from './about-layout'

function spaceToSceneRect(space: Space, sceneWidth: number, sceneHeight: number, rect: Rectangle) {
  rect.copy(space.rect)
    .relativeTo(space.root.rect)
    .multiply(sceneWidth, sceneHeight)
  rect.y = sceneHeight - rect.y - rect.height
  rect.translate(-sceneWidth / 2, -sceneHeight / 2)
}

export function AboutScene() {
  const three = useThreeWebGL()!
  const aboutLayout = useAboutLayout()
  useGroup('my-scene', async function* (group) {
    three.pipeline.basicPasses.fxaa.enabled = false
    const controls = Message.send<VertigoControls>(VertigoControls).assertPayload()
    const helper = setup(new DebugHelper(), group)
    aboutLayout.changeObs.onChange({ executeImmediately: true }, () => {
      if (aboutLayout.isReady === false)
        return

      helper.clear()
      const rect = new Rectangle()
      const colors = ['#f0f', '#0ff', '#ff0'].map(c => new Color(c))
      let index = 0
      const [sx, sy] = controls.dampedVertigo.state.realSize
      for (const space of aboutLayout.root.allLeaves()) {
        spaceToSceneRect(space, sx, sy, rect)
        helper.rect(rect, { color: colors[index], diagonals: true, corners: { size: .05 } })
        index = (index + 1) % colors.length
      }
    })
    const material = new MeshBasicMaterial({ map: await createTexture(three.renderer) })
    material.onBeforeCompile = shader => ShaderForge.with(shader)
      .defines('USE_UV')
      .uniforms({
        uTime: Ticker.get('three').uTime,
      })
      .fragment.top(
        glsl_utils,
        glsl_stegu_snoise
      )
      .fragment.after('map_fragment', /* glsl */ `
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
