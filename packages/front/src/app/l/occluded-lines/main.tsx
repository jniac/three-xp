'use client'

import { BufferGeometry, Color, IcosahedronGeometry, Material, Mesh, PlaneGeometry, ShaderMaterial, Vector3 } from 'three'

import { ThreeAndEditorProvider, useEditor, useThree } from 'some-three-editor/editor-provider'
import { VertigoControls } from 'some-utils-three/camera/vertigo/controls'
import { LineHelper } from 'some-utils-three/helpers/line'
import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { setup } from 'some-utils-three/utils/tree'
import { onTick } from 'some-utils-ts/ticker'

class LineA extends Mesh<BufferGeometry, AutoLitMaterial> {
  constructor() {
    super(new PlaneGeometry(4, .2), new AutoLitMaterial({ color: '#ff9900' }))
  }
}

class LineB extends Mesh<BufferGeometry, Material> {
  constructor() {
    const vertexShader = /* glsl */ `
      varying vec3 vWorldNormal;
      
      void main() {
        vWorldNormal = mat3(modelMatrix) * normal;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        gl_Position.z += -0.01;
      }
    `
    const fragmentShader = /* glsl */ `
      varying vec3 vWorldNormal;
      varying vec3 vColor;
      
      uniform vec3 uSunPosition;
      uniform vec3 uColor;
      uniform float uLuminosity;
      
      void main() {
        vec3 lightDirection = normalize(uSunPosition);
        float light = dot(vWorldNormal, lightDirection) * 0.5 + 0.5;
        light = pow(light, 2.0);
        light = mix(uLuminosity, 1.0, light);
        gl_FragColor = vec4(uColor * light, 1.0);
      }
    `
    const material = new ShaderMaterial({
      uniforms: {
        uColor: { value: new Color('#ff9900') },
        uSunPosition: { value: new Vector3(0.5, 0.7, 0.3) },
        uLuminosity: { value: .5 },
      },
      vertexShader,
      fragmentShader,
    })
    super(new PlaneGeometry(4, .2), material)
  }
}

function Scene() {
  useEditor(function* (editor) {
    editor.useOrbitControls = false
    const vertigoControls = new VertigoControls({
      size: [8, 8],
    })
    vertigoControls.start(editor.three.renderer.domElement)
    yield onTick('three', tick => {
      vertigoControls.update(editor.three.camera, editor.three.aspect)
    })
  })

  useThree(function* (three) {
    three.scene.background = new Color('#6699cc')
    setup(
      new Mesh(
        new IcosahedronGeometry(1, 4),
        new AutoLitMaterial({ color: 'red' }),
      ), three.scene)

    setup(new LineHelper(), three.scene)
      .box({ size: 2 })
      .draw()
      .showOccludedLines()

    setup(new LineA(), { parent: three.scene, position: [0, .5, 0] })
    setup(new LineB(), { parent: three.scene, position: [0, -.5, 0] })

    yield () => three.scene.clear()
  }, [])

  return null
}

export function Main() {
  return (
    <ThreeAndEditorProvider>
      <Scene />
    </ThreeAndEditorProvider>
  )
}
