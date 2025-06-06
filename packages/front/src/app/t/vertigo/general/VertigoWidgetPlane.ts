'use client'

import {
  BufferGeometry,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  RGBAFormat,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector4,
  WebGLRenderer,
  WebGLRenderTarget
} from 'three'

import { handlePointer } from 'some-utils-dom/handle/pointer'
import { Vertigo } from 'some-utils-three/camera/vertigo'
import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { onTick } from 'some-utils-ts/ticker'

import { VertigoWidget, VertigoWidgetPart } from './VertigoWidget'

class VertigoMaterial extends ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        uResolution: { value: new Vector4() },
        uRect: { value: new Vector4() },
        map: { value: null },
      },
      vertexShader: /* glsl */`
        uniform vec4 uResolution;
        uniform vec4 uRect;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position.xy = ((position.xy * 2.0 + 1.0) * uRect.zw + uRect.xy * 2.0) / uResolution.xy - 1.0; 
          gl_Position.z = 0.0;
          gl_Position.w = 1.0;
          // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */`
        uniform sampler2D map;
        varying vec2 vUv;
        void main() {
          gl_FragColor = texture2D(map, vUv);
        }
      `,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    })
  }
}

export class VertigoWidgetPlane extends Mesh<BufferGeometry, VertigoMaterial> {
  internal: {
    rt: WebGLRenderTarget
    scene: Scene
    camera: PerspectiveCamera
    vertigo: Vertigo
    widget: VertigoWidget
  }

  vertigoControls: VertigoControls | null = null

  constructor({ planeSize = 120 } = {}) {
    const material = new VertigoMaterial()
    const geometry = new PlaneGeometry(1, 1)
    super(geometry, material)

    const rtSize = planeSize * 2
    const rt = new WebGLRenderTarget(rtSize, rtSize, {
      format: RGBAFormat,
      colorSpace: 'srgb',
    })
    const scene = new Scene()
    const camera = new PerspectiveCamera()
    const vertigo = new Vertigo({
      perspective: 1,
      size: [2.8, 2.8],
    })

    const widget = new VertigoWidget()
    scene.add(widget)

    this.internal = { rt, scene, camera, vertigo, widget }
    this.renderOrder = 1
    this.frustumCulled = false

    material.uniforms.map.value = this.internal.rt.texture
    material.uniforms.uRect.value.set(10, 10, planeSize, planeSize)

    this.position.x = 2
  }

  *initialize(renderer: WebGLRenderer, vertigoControls: VertigoControls) {
    const { rt, scene, camera, vertigo, widget } = this.internal

    const resolution = this.material.uniforms.uResolution.value
    const rect = this.material.uniforms.uRect.value
    const bufferSize = new Vector2()

    const pointer = new Vector2(-1, -1)
    let pointerDown = false

    yield handlePointer(renderer.domElement, {
      onDown: () => {
        pointerDown = true
      },
      onUp: () => {
        pointerDown = false
      },
      onChange: info => {
        pointer.x = (info.localPosition.x - rect.x) / rect.z * 2 - 1
        pointer.y = -((info.localPosition.y) / rect.w * 2 - 1)
      },
      onTap: () => {
        switch (widget.getPressed()) {
          case VertigoWidgetPart.BOX: {
            vertigoControls.actions.togglePerspective()
            break
          }
          case VertigoWidgetPart.POSITIVE_X: {
            vertigoControls.actions.positiveXAlign()
            break
          }
          case VertigoWidgetPart.NEGATIVE_X: {
            vertigoControls.actions.negativeXAlign()
            break
          }
          case VertigoWidgetPart.POSITIVE_Y: {
            vertigoControls.actions.positiveYAlign()
            break
          }
          case VertigoWidgetPart.NEGATIVE_Y: {
            vertigoControls.actions.negativeYAlign()
            break
          }
          case VertigoWidgetPart.POSITIVE_Z: {
            vertigoControls.actions.positiveZAlign()
            break
          }
          case VertigoWidgetPart.NEGATIVE_Z: {
            vertigoControls.actions.negativeZAlign()
            break
          }
        }
      },
    })

    yield onTick('three', { order: 1 }, () => {
      renderer.getSize(bufferSize)
      resolution.set(bufferSize.x, bufferSize.y, renderer.getPixelRatio(), 0)
      rect.x = bufferSize.x - rect.z
      rect.y = bufferSize.y - rect.w

      vertigo.rotation.copy(vertigoControls.vertigo.rotation)
      vertigo.perspective = vertigoControls.vertigo.perspective
      vertigo.apply(camera, 1)

      widget.widgetUpdate(pointer, pointerDown, camera)

      if (pointer.x >= -1 && pointer.x <= 1 && pointer.y >= -1 && pointer.y <= 1) {
        if (widget.getHovered() !== null) {
          document.body.style.cursor = 'pointer'
        } else {
          document.body.style.removeProperty('cursor')
        }
      }

      renderer.setRenderTarget(rt)
      renderer.setClearColor('white', 0)
      renderer.render(scene, camera)
      renderer.setRenderTarget(null)
    })
  }
}
