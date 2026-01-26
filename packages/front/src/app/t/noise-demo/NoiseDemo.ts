import { Group, Mesh, PlaneGeometry, ShaderMaterial, TorusKnotGeometry } from 'three'

import { handlePointer } from 'some-utils-dom/handle/pointer'
import { fromVector3Declaration } from 'some-utils-three/declaration'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { setup } from 'some-utils-three/utils/tree'
import { Vector3Declaration } from 'some-utils-ts/declaration'
import { glsl_easings } from 'some-utils-ts/glsl/easings'
import { glsl_stegu_psrdnoise } from 'some-utils-ts/glsl/stegu-psrdnoise'
import { glsl_stegu_snoise } from 'some-utils-ts/glsl/stegu-snoise'
import { Tick } from 'some-utils-ts/ticker'

export class NoiseDemo extends Group {
  debugHelper = setup(new DebugHelper({ texts: { lineCount: 3 } }).onTop(), this)

  uTime = { value: 0 }
  uTime2 = { value: 0 }

  pointerState = {
    down: false,
    shift: false,
  }

  constructor() {
    super()

    this.#plane()
    this.#knot1()
    this.#knot2()
    this.#tilableNoise2D()

    setup(this, {
      position: [0, 4, 0],
    })
  }

  *onInitialize() {
    yield handlePointer(document.body, {
      onDown: info => {
        this.pointerState.down = true
        this.pointerState.shift = (info.event as any).shiftKey
      },
      onUp: () => {
        this.pointerState.down = false
      },
    })
  }

  onTick(tick: Tick) {
    const { down, shift } = this.pointerState
    this.uTime.value += tick.deltaTime * (down ? (shift ? 0.1 : 10) : 1)
    this.uTime2.value += tick.deltaTime * (down ? 0 : 1)
  }

  #text(position: Vector3Declaration, text: string) {
    const { x, y, z } = fromVector3Declaration(position)
    this.debugHelper.text([x, y, z + .5], text, { size: .25, textColor: 'white', backgroundColor: 'black' })
  }

  #plane() {
    const material = new ShaderMaterial({
      uniforms: {
        uTime: this.uTime,
        uTime2: this.uTime2,
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        ${glsl_stegu_snoise}
        varying vec2 vUv;
        uniform float uTime, uTime2;
        void main() {
          vec3 p = vec3(vUv * 10.0, uTime * 0.1) * 0.5;
          vec3 warp = vec3(
            fnoise(p * 0.1, 2, 0.5), 
            fnoise(p * 0.1 + 100.0, 2, 0.5), 
            fnoise(p * 0.1 - 230.1, 2, 0.5));
          p += warp * 5.2;
          p *= 0.5;
          float noise = fnoise(p, 4, 0.5);
          vec3 color = 
            mod(uTime2 * 0.5, 2.0) < 1.0
              ? vec3(0.5 + 0.5 * noise)
              : vec3(mod((0.5 + 0.5 * noise) * 5.0, 1.0));
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    })

    const position = [0, 0, 0] as const

    setup(new Mesh(new PlaneGeometry(2, 2), material), {
      parent: this,
      position,
    })

    this.#text(position, 'warp in noise3D')
  }

  #knot1() {
    const material = new ShaderMaterial({
      uniforms: {
        uTime: this.uTime,
        uTime2: this.uTime2,
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        varying vec3 vWorldPosition;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        }
      `,
      fragmentShader: /* glsl */ `
        ${glsl_stegu_snoise}
        ${glsl_easings}

        varying vec2 vUv;
        varying vec3 vWorldPosition;
        uniform float uTime, uTime2;

        float remap1101(in float x) {
          return (x + 1.0) * 0.5;
        }

        float noiseA() {
          vec4 p = vec4(vWorldPosition * 0.5, uTime * 0.1);
          return easeInOut(remap1101(fnoise(p, 8, 0.5)), 4.0, 0.666);
        }

        float noiseB() {
          vec4 p = vec4(vWorldPosition * 0.5 + 100.0, uTime * 0.01);
          return mod(remap1101(fnoise(p, 8, 0.5)) * 10.0, 1.0);
        }

        void main() {
          float noise = mod(uTime2 * 0.5, 2.0) < 1.0
            ? noiseA()
            : noiseB();
          vec3 color = vec3(noise);
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    })

    const position = [0, 2, 0] as const

    setup(new Mesh(new TorusKnotGeometry(.5, .3, 256, 64), material), {
      parent: this,
      position,
    })

    this.#text(position, 'noise4D')
  }

  #knot2() {
    const material = new ShaderMaterial({
      uniforms: {
        uTime: this.uTime,
        uTime2: this.uTime2,
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        varying vec3 vWorldPosition;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        }
      `,
      fragmentShader: /* glsl */ `
        ${glsl_stegu_snoise}
        ${glsl_easings}

        varying vec2 vUv;
        varying vec3 vWorldPosition;
        uniform float uTime, uTime2;

        float remap1101(in float x) {
          return (x + 1.0) * 0.5;
        }

        float noiseA() {
          vec4 p = vec4(vWorldPosition * 0.5, uTime * 0.1);
          return easeInOut(remap1101(fnoiseFast4D(p, 8, 0.5)), 4.0, 0.666);
        }

        float noiseB() {
          vec4 p = vec4(vWorldPosition * 0.5 + 100.0, uTime * 0.01);
          return mod(remap1101(fnoiseFast4D(p, 8, 0.5)) * 10.0, 1.0);
        }

        void main() {
          float noise = mod(uTime2 * 0.5, 2.0) < 1.0
            ? noiseA()
            : noiseB();
          vec3 color = vec3(noise);
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    })

    const position = [2, 0, 0] as const

    setup(new Mesh(new TorusKnotGeometry(.5, .3, 256, 64), material), {
      parent: this,
      position,
    })

    this.#text(position, 'snoiseFast4D\n(hash. 4D into noise2D)\ntoo much patterning...')
  }

  #tilableNoise2D() {
    const material = new ShaderMaterial({
      uniforms: {
        uTime: this.uTime,
        uTime2: this.uTime2,
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        varying vec3 vWorldPosition;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        }
      `,
      fragmentShader: /* glsl */ `
        ${glsl_stegu_snoise}
        ${glsl_stegu_psrdnoise}
        ${glsl_easings}

        varying vec2 vUv;
        varying vec3 vWorldPosition;
        uniform float uTime, uTime2;

        float remap1101(in float x) {
          return (x + 1.0) * 0.5;
        }

        void main() {
          float period = 3.0;
          // float noise = fbm_psrdnoise(vWorldPosition.xyz * period * 2.0, vec3(period), 4, 0.5);
          float noise = fbm_psrdnoise(vec3(vUv, 0.0) * period * 3.0, vec3(period), 4, 0.5);
          vec3 color = vec3(pow(remap1101(noise), 1.0));
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    })

    const position = [-2, 2, 0] as const

    setup(new Mesh(new PlaneGeometry(2, 2), material), {
      parent: this,
      position,
    })

    this.#text(position, 'tilable noise2D\n(using 4D noise)')
  }
}
