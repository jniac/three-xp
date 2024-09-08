import {
  BufferGeometry,
  Color,
  ColorRepresentation,
  DepthTexture,
  DoubleSide,
  Group,
  Material,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  TorusKnotGeometry,
  UnsignedShortType,
  WebGLRenderer,
  WebGLRenderTarget
} from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js'

import { handleAnyUserInteraction } from 'some-utils-dom/handle/anyUserInteraction'
import { handleSize } from 'some-utils-dom/handle/size'
import { useLayoutEffects } from 'some-utils-react/hooks/effects'
import { glsl_web_colors } from 'some-utils-ts/glsl/colors/web_colors'
import { glsl_easings } from 'some-utils-ts/glsl/easings'
import { Message } from 'some-utils-ts/message'
import { Ticker } from 'some-utils-ts/ticker'

export function create({
  width = window.innerWidth,
  height = window.innerHeight,
  pixelRatio = window.devicePixelRatio,
}) {

  const renderer = new WebGLRenderer({
    antialias: true,
  })

  renderer.setSize(width, height)
  renderer.setPixelRatio(pixelRatio)

  const camera = new PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.position.z = 4.7
  camera.near = camera.position.z - 2.4
  camera.far = camera.position.z + 1
  camera.updateProjectionMatrix()

  const scene = new Scene()

  const knotWrapper = new Group()
  scene.add(knotWrapper)

  const knotGeometry1 = new TorusKnotGeometry(2, 1.02, 1024, 512)
  const knotGeometry2 = new TorusKnotGeometry(2, .9, 1024, 512)
  knotGeometry2.computeBoundingSphere()
  knotGeometry2.computeBoundingBox()

  const knot = new Mesh(
    knotGeometry1,
    new MeshBasicMaterial({
      color: 0xffff00,
      side: DoubleSide,
    }))
  knotWrapper.add(knot)

  const knot2 = new Mesh(
    new TorusKnotGeometry(2, .25, 1024, 512),
    new MeshBasicMaterial({
      color: 0xff00ff,
      side: DoubleSide,
    }))
  knot.add(knot2)

  const knot3 = new Mesh(
    new TorusKnotGeometry(2, .35, 1024, 512),
    new MeshBasicMaterial({
      color: 0xff00ff,
      side: DoubleSide,
    }))
  knot.add(knot3)

  const artParts = {
    camera,
    knotWrapper,
    knot,
    knotGeometry1,
    knotGeometry2,
  }

  // 1. Create G-buffers and depth texture
  const gBuffer = new WebGLRenderTarget(width * pixelRatio, height * pixelRatio, {
    depthBuffer: true,
    depthTexture: new DepthTexture(width * pixelRatio, height * pixelRatio, UnsignedShortType),
  })

  function vec3(color: ColorRepresentation) {
    const { r, g, b } = new Color(color)
    return `vec3(${r.toFixed(3)}, ${g.toFixed(3)}, ${b.toFixed(3)})`
  }

  // 3. Use the depth texture in a shader pass
  const depthMaterial = new ShaderMaterial({
    uniforms: {
      depthTexture: { value: gBuffer.depthTexture },
      cameraNear: { value: camera.near },
      cameraFar: { value: camera.far }
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
  
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      ${glsl_web_colors}
      ${glsl_easings}
  
      vec3[] COLORS = vec3[](
        aliceblue,
        ${vec3('#471864')},
        aqua,
        aquamarine,
        ${vec3('#c8d50d')}
      );
      int COLORS_COUNT = 5;
  
      uniform sampler2D depthTexture;
      uniform float cameraNear;
      uniform float cameraFar;
      varying vec2 vUv;
  
      float lines(float x) {
        // Inside your fragment shader
        float lineWidth = 0.03; // Adjust line width to what you need
        float edgeSmoothness = 0.01; // Controls the smooth transition around the line edge
  
        // Get the position in the UV space (assuming you're using UV coordinates)
  
  
        // Calculate the fract values to simulate lines
        float linePattern = 1.0 - fract(x * 20.0); // 10.0 determines the spacing of the lines
  
        // Use smoothstep to soften the edge of the line
        float line = smoothstep(lineWidth - edgeSmoothness, lineWidth + edgeSmoothness, linePattern);
  
        return line;
      }
  
      vec3 removeGamma(vec3 color) {
        return pow(color, vec3(2.2));  // Linearize color
      }
  
      vec3 applyGamma(vec3 color) {
        return pow(color, vec3(1.0 / 2.2));  // Apply gamma
      }
  
      float linearizeDepth(float depth) {
        float z = depth * 2.0 - 1.0; // Back to NDC
        return (2.0 * cameraNear * cameraFar) / (cameraFar + cameraNear - z * (cameraFar - cameraNear));
      }
  
      void main() {
        float depth = texture2D(depthTexture, vUv).r;
        float linearDepth = linearizeDepth(depth);
        // gl_FragColor = vec4(vec3(linearDepth), 1.0);
        // gl_FragColor = vec4(vec3(depth), 1.0);
        // gl_FragColor = vec4(vUv, 1.0, 1.0);
  
        float x = 1.0 - depth;
        x *= float(COLORS_COUNT);
        float f = 1.0 - fract(x);
        int i = int(floor(x));
        vec3 color1 = COLORS[i];
        vec3 color2 = COLORS[(i + COLORS_COUNT - 1) % COLORS_COUNT];
  
        vec3 color = mix(color1, color2, easeInout4(f));
        // color *= mix(0.8, 1.1, f * f * f);
  
        color = 1.0 - color;
  
        gl_FragColor.a = 1.0;
        gl_FragColor.rgb = color;
        // gl_FragColor.rgb *= lines(depth);
      }
    `
  })

  // 4. Render the depth pass or use it for further processing
  const quadGeometry = new PlaneGeometry(2, 2)
  const quad = new Mesh<BufferGeometry, Material>(quadGeometry, depthMaterial)
  const quadCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)

  // quad.material = new MeshBasicMaterial({ map: gBuffer.depthTexture })

  const composer = new EffectComposer(renderer)

  const quadRenderPass = new RenderPass(quad as unknown as Scene, quadCamera)
  composer.addPass(quadRenderPass)

  const aaPass = new ShaderPass(FXAAShader)
  aaPass.material.uniforms['resolution'].value.set(1 / width, 1 / height)
  composer.addPass(aaPass)

  const outputPass = new OutputPass()
  composer.addPass(outputPass)

  function resize(width: number, height: number, pixelRatio = window.devicePixelRatio) {
    renderer.setSize(width, height)
    renderer.setPixelRatio(pixelRatio)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    gBuffer.setSize(width * pixelRatio, height * pixelRatio)
    composer.setSize(width, height)
    composer.setPixelRatio(pixelRatio)
    aaPass.material.uniforms['resolution'].value.set(1 / width, 1 / height)
  }

  function render() {
    renderer.setRenderTarget(gBuffer)
    renderer.render(scene, camera)
    renderer.setRenderTarget(null) // Render to the screen

    // renderer.render(quad, quadCamera)
    composer.render()
  }

  const ticker = Ticker.current()
  ticker.set({ activeDuration: 60 })
  ticker.onTick(tick => {
    // knot.rotation.x += .1 * tick.deltaTime
    // knot.rotation.y += .1 * tick.deltaTime
    // camera.position.z = 1.7

    render()
  })

  function destroy() {
    renderer.dispose()
    renderer.domElement.remove()
    gBuffer.dispose()
    composer.dispose()
    ticker.destroy()
  }

  function* init() {
    yield handleAnyUserInteraction(ticker.requestActivation)
    yield destroy
    yield Message.on('REQUIRE:ART_PARTS', message => {
      message.payloadAssign(artParts)
    })
  }

  return {
    renderer,
    scene,
    camera,
    artParts,
    resize,
    init,
    destroy,
  }
}

export type GlArtParts = ReturnType<typeof create>['artParts']



export function ArtGl() {
  const { ref } = useLayoutEffects<HTMLDivElement>(function* (div) {
    const width = div.clientWidth
    const height = div.clientHeight
    const art = create({ width, height })
    yield* art.init()
    div.appendChild(art.renderer.domElement)
    yield handleSize(div, {
      onSize: info => {
        art.resize(info.size.x, info.size.y)
      },
    })
    yield () => art.renderer.domElement.remove()
  }, [])

  return (
    <div
      ref={ref}
      className='absolute inset-0'
    />
  )
}
