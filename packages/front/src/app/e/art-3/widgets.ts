import { AlwaysStencilFunc, BufferGeometry, CircleGeometry, Color, ColorRepresentation, EqualStencilFunc, Group, IcosahedronGeometry, Mesh, MeshBasicMaterial, MeshBasicMaterialParameters, PlaneGeometry, ReplaceStencilOp, RingGeometry, Shape, ShapeGeometry, TorusGeometry, Vector3, Vector4 } from 'three'

import { AutoLitMaterial } from 'some-utils-three/materials/auto-lit'
import { ShaderForge } from 'some-utils-three/shader-forge'
import { setup } from 'some-utils-three/utils/tree'
import { glsl_utils } from 'some-utils-ts/glsl/utils'
import { Tick } from 'some-utils-ts/ticker'
import { BufferGeometryUtils } from 'three/examples/jsm/Addons.js'

import { SmoothBoxGeometry } from 'some-utils-three/geometries/SmoothBoxGeometry'

const Common = (() => {
  const planeGeometry = new PlaneGeometry(1, 1)
  const sphereGeometry = new IcosahedronGeometry(.5, 12)
  const circleGeometry = new CircleGeometry(.5, 96)
  return {
    planeGeometry,
    sphereGeometry,
    circleGeometry,
  }
})()

const Colors = {
  white: '#fff',
  pink: '#E67BB6',
  green: '#56AB6D',
  vividBlue: '#1B2995',
  liberty: '#565DAB',
  greyedCyan: '#588988',
  lightPink: '#FFC3FF',
  coralTree: '#A36868',
  darkPurple: '#321D37',
  lightGrey: '#dddddd',
  quasiBlack: '#160606',
}

class CustomMaterial extends MeshBasicMaterial {
  static defaultProps = {
    depthOffset: 0,
  }

  uniforms = {
    uDepthOffset: { value: 0 },
  }

  constructor(userProps: Partial<MeshBasicMaterialParameters> & Partial<typeof CustomMaterial.defaultProps>) {
    const {
      depthOffset,
      ...parameters
    } = { ...CustomMaterial.defaultProps, ...userProps }

    super(parameters)

    if (depthOffset) {
      this.uniforms.uDepthOffset.value = depthOffset
      this.onBeforeCompile = shader => ShaderForge.with(shader)
        .uniforms(this.uniforms)
        .vertex.mainAfterAll(/* glsl */ `
          gl_Position.z += -uDepthOffset;
        `)
    }
  }
}

class SphereImpostorMaterial extends MeshBasicMaterial {
  static defaultProps = {
    depthOffset: 0,
    roundPower: 1,
  }

  uniforms = {
    uDepthOffset: { value: 0 },
    uRoundPower: { value: 1 },
  }

  constructor(userProps?: Partial<MeshBasicMaterialParameters> & Partial<typeof SphereImpostorMaterial.defaultProps>) {
    const {
      depthOffset,
      roundPower,
      ...parameters
    } = { ...SphereImpostorMaterial.defaultProps, ...userProps }

    super(parameters)

    this.uniforms.uDepthOffset.value = depthOffset
    this.uniforms.uRoundPower.value = roundPower

    this.onBeforeCompile = shader => ShaderForge.with(shader)
      .uniforms(this.uniforms)
      .defines('USE_UV')
      .vertex.mainAfterAll(/* glsl */ `
          gl_Position.z += -uDepthOffset;
        `)
      .fragment.top(/* glsl */`
        float spow(float x, float p) {
          return sign(x) * pow(abs(x), p);
        }
        vec3 spow(vec3 v, float p) {
          return sign(v) * pow(abs(v), vec3(p));
        }
        float computeLight(vec3 normal, vec3 lightDirection, float rampPower) {
          float light = dot(normal, lightDirection) * 0.5 + 0.5;
          light = pow(light, rampPower);
          return light;
        }
      `)
      .fragment.after('color_fragment', /* glsl */ `
        vec3 n = vec3(vUv * 2.0 - 1.0, 0.0);
        float len = length(n);
        n.xy *= pow(len, uRoundPower);
        float z = sqrt(1.0 - n.x * n.x - n.y * n.y);
        n.z = z;
        float light = computeLight(n, normalize(vec3(0.5, 0.7, 0.3)), 1.5);
        light = pow(light, 1.0 / 1.5);
        diffuseColor.rgb *= light;
      `)
  }
}

function pick<T>(items: ArrayLike<T>, index: number) {
  return items[index % items.length]
}

class FourBlades extends Group {
  static shared = {
    geometry: new PlaneGeometry().translate(.5, .5, 0),
  }

  parts = (() => {
    const mask = setup(new Mesh(
      Common.planeGeometry,
      new MeshBasicMaterial({
        color: 'white',
        side: 2,
        stencilRef: 1,
        stencilFunc: AlwaysStencilFunc,
        stencilZPass: ReplaceStencilOp,
        stencilWrite: true,
        depthWrite: false,
        colorWrite: false,
      })
    ), {
      name: 'mask',
      parent: this,
      userData: { isMask: true },
      renderOrder: -1,
    })
    mask.onBeforeRender = (renderer, scene, camera, geometry, material, group) => {
      renderer.clearStencil()
    }

    const bladeWrapper = setup(new Group(), this)
    const blades = [
      {
        color: '#E67BB6'
      },
      {
        color: '#56AB6D'
      },
      {
        color: '#321D37'
      },
      {
        color: '#565DAB'
      },
    ].map((entry, index, entries) => {
      const blade = setup(new Mesh(
        FourBlades.shared.geometry,
        new MeshBasicMaterial({
          color: entry.color,
          side: 2,
          stencilRef: 1,
          stencilWrite: true,
          stencilFunc: EqualStencilFunc,
        })
      ), {
        parent: bladeWrapper,
        rotationZ: Math.PI * 2 * index / entries.length,
      })
      blade.updateMatrix()
      return {
        blade,
        ...entry,
      }
    })

    return {
      mask,
      bladeWrapper,
      blades,
    }
  })();

  onTick(tick: Tick) {
    this.parts.bladeWrapper.rotation.z += tick.deltaTime * .1
    for (const [index, { blade }] of this.parts.blades.entries()) {
      const u = new Vector3(1, 0, 0).applyMatrix4(blade.matrix)
      const v = new Vector3(0, -1, 0).applyMatrix4(blade.matrix)
      const alpha = tick.sin01Time({ frequency: 1 / 10 }) * .25
      blade.position
        .set(0, 0, 0)
        .addScaledVector(u, alpha)
        .addScaledVector(v, alpha)
    }
  }
}

class OpenRoundedRingMaterial extends MeshBasicMaterial {
  static defaultProps = {
    innerRadius: .3,
    outerRadius: .35,
    aperture: .25,
    depthOffset: 0,
  }

  uniforms = {
    uDepthOffset: { value: 0 },
    uParams: {
      value: new Vector4(.3, .35, 0, 0), // x: innerRadius, y: outerRadius, z: aperture, w: time
    },
  }

  get aperture() { return this.uniforms.uParams.value.z / Math.PI }
  set aperture(value) { this.uniforms.uParams.value.z = value * Math.PI }

  get innerRadius() { return this.uniforms.uParams.value.x }
  set innerRadius(value) { this.uniforms.uParams.value.x = value }

  get outerRadius() { return this.uniforms.uParams.value.y }
  set outerRadius(value) { this.uniforms.uParams.value.y = value }

  constructor(userProps?: MeshBasicMaterialParameters & Partial<typeof OpenRoundedRingMaterial.defaultProps>) {
    const {
      aperture,
      innerRadius,
      outerRadius,
      depthOffset,
      ...parameters
    } = { ...OpenRoundedRingMaterial.defaultProps, ...userProps }

    super({
      color: '#333',
      side: 2,
      alphaHash: true,
      ...parameters,
    })

    this.uniforms.uDepthOffset.value = depthOffset
    this.aperture = aperture
    this.innerRadius = innerRadius
    this.outerRadius = outerRadius

    this.onBeforeCompile = shader => ShaderForge.with(shader)
      .uniforms(this.uniforms)
      .createVarying('sf_vObjectPosition')
      .vertex.mainAfterAll(/* glsl */ `
        gl_Position.z += -uDepthOffset;
      `)
      .fragment.top(/* glsl */ `
        // Signed distance to an arc segment. The arc is defined by the sin/cos of its aperture (sc) and its radius (ra). The segment is defined by a radius (rb).
        float sdArc( in vec2 p, in vec2 sc, in float ra, float rb ) {
            // sc is the sin/cos of the arc's aperture
            p.x = abs(p.x);
            return ((sc.y*p.x>sc.x*p.y) ? length(p-sc*ra) : 
                                          abs(length(p)-ra)) - rb;
        }
      `)
      .fragment.after('color_fragment', /* glsl */ `
        float c = cos(uParams.z);
        float s = sin(uParams.z);
        float middleRadius = (uParams.x + uParams.y) * 0.5;
        float thickness = (uParams.y - uParams.x) * 0.5;
        float d = sdArc(sf_vObjectPosition.xy, vec2(s, c), middleRadius, thickness);
        diffuseColor.a = smoothstep(0.001, -0.001, d);
      `)
  }

  customProgramCacheKey(): string {
    return 'OpenRoundedtialRingMaterial'
  }
}

class Knob extends Group {
  static defaultProps = {
    backgroundColor: <ColorRepresentation>'#56AB6D',
    discColor: <ColorRepresentation>Colors.white,
    handleColor: <ColorRepresentation>'#333',
    handleTurnOffset: 0,
    handleAperture: 0.25,
  }

  static createParts = (instance: Knob) => {
    const background = setup(new Mesh(
      Common.planeGeometry,
      new MeshBasicMaterial({
        color: instance.props.backgroundColor,
      })
    ), {
      name: 'background',
      parent: instance,
    })

    const disc = setup(new Mesh(
      new CircleGeometry(.4, 96),
      new SphereImpostorMaterial({
        depthOffset: .001,
        color: instance.props.discColor,
        roundPower: 10,
      })
    ), {
      name: 'disc',
      parent: instance,
    })

    const handle = setup(new Mesh(
      new RingGeometry(.3, .35, 96),
      new OpenRoundedRingMaterial({
        depthOffset: .002,
        color: instance.props.handleColor,
        aperture: instance.props.handleAperture,
      })
    ), {
      name: 'handle',
      z: .002,
      rotationZ: instance.props.handleTurnOffset * Math.PI * 2,
      parent: instance,
    })

    return {
      background,
      disc,
      handle,
    }
  };

  props: typeof Knob.defaultProps
  parts: ReturnType<typeof Knob.createParts>

  constructor(userProps?: Partial<typeof Knob.defaultProps>) {
    super()
    this.props = { ...Knob.defaultProps, ...userProps }
    this.parts = Knob.createParts(this)
  }


  onTick(tick: Tick) {
    // this.parts.handle.material.aperture = tick.sin01Time({ frequency: 1 / 5 })
    this.parts.handle.rotation.z += tick.deltaTime * -.2
  }
}

class SplittedDisc extends Group {
  static defaultProps = {
    backgroundColors: <[ColorRepresentation, ColorRepresentation]>[
      Colors.darkPurple,
      Colors.pink,
    ],
    discColors: <[ColorRepresentation, ColorRepresentation]>[
      Colors.lightPink,
      Colors.white,
    ],
  }

  static shared = (() => {
    const halfPlaneGeometry = new PlaneGeometry(.5, 1)
    const backgroundGeometry = BufferGeometryUtils.mergeGeometries([
      halfPlaneGeometry.clone().translate(-.25, 0, 0),
      halfPlaneGeometry.clone().translate(.25, 0, 0),
    ], true)
    const halfCircleGeometry = new CircleGeometry(.4, 96, 0, Math.PI)
    const discGeometry = BufferGeometryUtils.mergeGeometries([
      halfCircleGeometry.clone().rotateZ(Math.PI / 2),
      halfCircleGeometry.clone().rotateZ(-Math.PI / 2),
    ], true)
    return {
      backgroundGeometry,
      discGeometry,
    }
  })()

  static createParts = (instance: SplittedDisc) => {
    const mask = setup(new Mesh(
      Common.planeGeometry,
      new MeshBasicMaterial({
        color: 'white',
        side: 2,
        stencilRef: 1,
        stencilFunc: AlwaysStencilFunc,
        stencilZPass: ReplaceStencilOp,
        stencilWrite: true,
        depthWrite: false,
        colorWrite: false,
      })
    ), {
      name: 'mask',
      parent: instance,
      userData: { isMask: true },
      renderOrder: -1,
    })
    mask.onBeforeRender = (renderer, scene, camera, geometry, material, group) => {
      renderer.clearStencil()
    }

    const background = setup(new Mesh(
      SplittedDisc.shared.backgroundGeometry,
      [
        new MeshBasicMaterial({
          color: instance.props.backgroundColors[0],
          side: 2,
          stencilRef: 1,
          stencilWrite: true,
          stencilFunc: EqualStencilFunc,
        }),
        new MeshBasicMaterial({
          color: instance.props.backgroundColors[1],
          side: 2,
          stencilRef: 1,
          stencilWrite: true,
          stencilFunc: EqualStencilFunc,
        }),
      ]
    ), {
      name: 'background',
      parent: instance,
    })

    const splittedDisc = setup(new Mesh(
      SplittedDisc.shared.discGeometry,
      [
        new SphereImpostorMaterial({
          color: instance.props.discColors[0],
          side: 2,
          roundPower: 10,
          stencilRef: 1,
          depthOffset: .001,
          stencilWrite: true,
          stencilFunc: EqualStencilFunc,
        }),
        new SphereImpostorMaterial({
          color: instance.props.discColors[1],
          side: 2,
          roundPower: 10,
          stencilRef: 1,
          depthOffset: .001,
          stencilWrite: true,
          stencilFunc: EqualStencilFunc,
        })
      ]
    ), {
      name: 'disc',
      parent: instance,
      // visible: false,
    })

    setup(new Mesh(
      Common.circleGeometry,
      new SphereImpostorMaterial({})
    ), {
      parent: instance,
      position: [0, 0, 1],
      visible: false,
    })

    return {
      background,
      splittedDisc,
    }
  }

  props: typeof SplittedDisc.defaultProps
  parts: ReturnType<typeof SplittedDisc.createParts>

  constructor(userProps?: Partial<typeof SplittedDisc.defaultProps>) {
    super()
    this.props = { ...SplittedDisc.defaultProps, ...userProps }
    this.parts = SplittedDisc.createParts(this)
  }
}

class CrossyDiamond extends Group {
  static defaultProps = {
    backgroundColors: <ColorRepresentation[]>[
      Colors.quasiBlack,
      Colors.darkPurple,
      Colors.quasiBlack,
      Colors.darkPurple,
    ],
    crossColor: <ColorRepresentation>Colors.pink,
  }

  static shared = (() => {
    const triangleGeometry = new BufferGeometry().setFromPoints([
      new Vector3(0, 0, 0),
      new Vector3(.5, -.5, 0),
      new Vector3(.5, .5, 0),
    ])
    const backgroundGeometry = BufferGeometryUtils.mergeGeometries([
      triangleGeometry.clone().rotateZ(Math.PI / 2 * 3),
      triangleGeometry,
      triangleGeometry.clone().rotateZ(Math.PI / 2),
      triangleGeometry.clone().rotateZ(Math.PI / 2 * 2),
    ], true)
    return {
      backgroundGeometry,
    }
  })()

  static createParts = (instance: CrossyDiamond) => {
    const background = setup(new Mesh(
      CrossyDiamond.shared.backgroundGeometry,
      [
        new MeshBasicMaterial({ side: 2, color: pick(instance.props.backgroundColors, 0) }),
        new MeshBasicMaterial({ side: 2, color: pick(instance.props.backgroundColors, 1) }),
        new MeshBasicMaterial({ side: 2, color: pick(instance.props.backgroundColors, 2) }),
        new MeshBasicMaterial({ side: 2, color: pick(instance.props.backgroundColors, 3) }),
      ]
    ), {
      name: 'background',
      parent: instance,
    })

    const shapeSettings = {
      thickness: .06,
      armLength: .25,
    }

    const crossShape = new Shape()

    const th2 = shapeSettings.thickness / 2
    const al = shapeSettings.armLength
    crossShape
      .moveTo(th2, th2)
      .lineTo(al + th2, th2)
      .absarc(al + th2, 0, th2, Math.PI / 2, -Math.PI / 2, true)
      .lineTo(th2, -th2)
      .lineTo(th2, -al - th2)
      .absarc(0, -al - th2, th2, 0, Math.PI, true)
      .lineTo(-th2, -th2)
      .lineTo(-al - th2, -th2)
      .absarc(-al - th2, 0, th2, -Math.PI / 2, Math.PI / 2, true)
      .lineTo(-th2, th2)
      .lineTo(-th2, al + th2)
      .absarc(0, al + th2, th2, Math.PI, 0, true)
      .lineTo(th2, th2)
    const crossGeometry = new ShapeGeometry(crossShape)
    setup(new Mesh(
      crossGeometry,
      new CustomMaterial({ depthOffset: .001, side: 2, color: instance.props.crossColor })
    ), {
      name: 'cross',
      parent: instance,
    })

    return {
      background,
    }
  }

  props: typeof CrossyDiamond.defaultProps
  parts: ReturnType<typeof CrossyDiamond.createParts>

  constructor(userProps?: Partial<typeof CrossyDiamond.defaultProps>) {
    super()
    this.props = { ...CrossyDiamond.defaultProps, ...userProps }
    this.parts = CrossyDiamond.createParts(this)
  }
}

class Sphery extends Group {
  static ZebraMaterial = class extends MeshBasicMaterial {
    static defaultProps = {
      color1: <ColorRepresentation>'#333',
      color2: <ColorRepresentation>'#fff',
      shadowIntensity: 1,
      luminosity: 1,
      rampPower: 1,
    }

    uniforms = {
      uColor1: { value: new Color() },
      uColor2: { value: new Color() },
      uSunPosition: { value: new Vector3(0.5, 0.7, 0.3) },
      uShadowColor: { value: new Color('#808080') },
      uRampPower: { value: 1 },
      uLuminosity: { value: 1 },
      uShadowIntensity: { value: 1 },
    }

    constructor(userProps?: MeshBasicMaterialParameters & Partial<typeof Sphery.ZebraMaterial.defaultProps>) {
      const {
        color1,
        color2,
        shadowIntensity,
        luminosity,
        rampPower,
        ...parameters
      } = { ...Sphery.ZebraMaterial.defaultProps, ...userProps }

      super(parameters)

      this.uniforms.uColor1.value.set(color1)
      this.uniforms.uColor2.value.set(color2)
      this.uniforms.uShadowIntensity.value = shadowIntensity
      this.uniforms.uLuminosity.value = luminosity
      this.uniforms.uRampPower.value = rampPower

      this.onBeforeCompile = shader => ShaderForge.with(shader)
        .uniforms(this.uniforms)
        .createVarying('sf_vObjectPosition', 'sf_vWorldNormal')
        .fragment.top(glsl_utils)
        .fragment.after('color_fragment', /* glsl */`
          vec2 p = rotate(sf_vObjectPosition.xy, -PI / 4.0);
          float stripes = 3.4;
          // float angle = atan(p.y, p.x);
          // float radius = length(p);
          // float f = smoothstep(0.01, -0.01, sin(angle * stripes + radius * 5.0));

          float f = smoothstep(0.01, -0.01, sin(p.x * 3.14159265 * stripes));
          diffuseColor.rgb = mix(uColor1, uColor2, f);


          vec3 lightDirection = normalize(uSunPosition);
          float light = dot(normalize(sf_vWorldNormal), lightDirection) * 0.5 + 0.5;
          light = pow(light, uRampPower);
          diffuseColor.rgb *= mix(mix(vec3(1.0), uShadowColor * uLuminosity, uShadowIntensity), vec3(1.0), light);
        `)
    }
  }

  static defaultProps = {
    sphereColors: <ColorRepresentation[]>[
      '#fff',
      '#588988',
    ],
    backgroundColors: <[ColorRepresentation, ColorRepresentation]>[
      '#56AB6D',
      '#588988',
    ],
  }

  static createParts = (instance: Sphery) => {
    const background = setup(new Mesh(
      Common.planeGeometry,
      new Sphery.ZebraMaterial({
        color1: pick(instance.props.backgroundColors, 0),
        color2: pick(instance.props.backgroundColors, 1),
        shadowIntensity: .5,
        side: 2,
      })
    ), {
      name: 'background',
      parent: instance,
    })

    const sphere = setup(new Mesh(
      Common.sphereGeometry.clone().scale(.75, .75, .75),
      new Sphery.ZebraMaterial({
        color1: pick(instance.props.sphereColors, 0),
        color2: pick(instance.props.sphereColors, 1),
        shadowIntensity: 1,
      }),
    ), {
      name: 'disc',
      parent: instance,
      // visible: false,
    })

    return {
      background,
      sphere,
    }
  }

  props: typeof Sphery.defaultProps
  parts: ReturnType<typeof Sphery.createParts>

  constructor(userProps?: Partial<typeof Sphery.defaultProps>) {
    super()
    this.props = { ...Sphery.defaultProps, ...userProps }
    this.parts = Sphery.createParts(this)
  }
}

class Dashy extends Group {
  static defaultProps = {
    backgroundColor: <ColorRepresentation>'#160606',
    dashColor: <ColorRepresentation>'#1B2995',
  }

  static createParts = (instance: Dashy) => {
    const background = setup(new Mesh(
      Common.planeGeometry,
      new MeshBasicMaterial({
        color: instance.props.backgroundColor,
        side: 2,
      })
    ), {
      name: 'background',
      parent: instance,
    })

    const dashGeometry = new PlaneGeometry()

    {
      const w2 = .2
      const h2 = .45
      const off = -.25
      const v = new Vector3()

      const positions = dashGeometry.attributes.position.array as Float32Array
      v.set(w2 - off, -h2, 0).toArray(positions, 0)
      v.set(-w2 - off, -h2, 0).toArray(positions, 3)
      v.set(w2 + off, h2, 0).toArray(positions, 6)
      v.set(-w2 + off, h2, 0).toArray(positions, 9)
    }

    setup(new Mesh(
      dashGeometry,
      new CustomMaterial({
        color: instance.props.dashColor,
        side: 2,
        depthOffset: .001,
      })
    ), {
      name: 'dash',
      parent: instance,
    })

    return {
      background,
    }
  }

  props: typeof Dashy.defaultProps
  parts: ReturnType<typeof Dashy.createParts>

  constructor(userProps?: Partial<typeof Dashy.defaultProps>) {
    super()
    this.props = { ...Dashy.defaultProps, ...userProps }
    this.parts = Dashy.createParts(this)
  }
}

class Torus extends Group {
  static defaultProps = {
    backgroundColor: <ColorRepresentation>Colors.vividBlue,
    torusColor: <ColorRepresentation>'#fff',
    ringColor: <ColorRepresentation>Colors.greyedCyan,
  }

  static shared = {
    torusGeometry: new TorusGeometry(.35, .1, 96, 96),
  }

  static createParts = (instance: Torus) => {
    const background = setup(new Mesh(
      Common.planeGeometry,
      new MeshBasicMaterial({
        color: instance.props.backgroundColor,
        side: 2,
      })
    ), {
      name: 'background',
      parent: instance,
    })

    const torusColor = new Color(instance.props.torusColor)
    const torus = setup(new Mesh(
      Torus.shared.torusGeometry,
      new AutoLitMaterial({
        color: torusColor,
      })
    ), {
      name: 'torus',
      parent: instance,
    })

    const innerRadius = .15
    const outerRadius = .2
    const openRing = setup(new Mesh(
      new RingGeometry(innerRadius, outerRadius, 96, 1),
      new OpenRoundedRingMaterial({
        color: instance.props.ringColor,
        innerRadius: innerRadius,
        outerRadius: outerRadius,
        aperture: .55,
        depthOffset: .001,
      })
    ), {
      name: 'openRing',
      parent: instance,
    })

    const sphere = setup(new Mesh(
      Common.sphereGeometry,
      new AutoLitMaterial({
        color: instance.props.torusColor,
      }),
    ), {
      name: 'sphere',
      parent: instance,
      scale: .2,
    })

    return {
      background,
      torus,
      openRing,
      sphere,
    }
  }

  props: typeof Torus.defaultProps
  parts: ReturnType<typeof Torus.createParts>

  constructor(userProps?: Partial<typeof Torus.defaultProps>) {
    super()
    this.props = { ...Torus.defaultProps, ...userProps }
    this.parts = Torus.createParts(this)
  }

  onTick(tick: Tick) {
    this.parts.openRing.material.aperture = .5
    this.parts.openRing.rotation.z += tick.deltaTime * .1
  }
}

class RoundedBox extends Group {
  static defaultProps = {
    backgroundColor: <ColorRepresentation>Colors.coralTree,
    boxColor: <ColorRepresentation>Colors.white,
    buttonColor: <ColorRepresentation>Colors.green,
  }

  static shared = {
    boxGeometry: new SmoothBoxGeometry(.8, .8, .4, 8, .2, 3.5),
  }

  static createParts = (instance: RoundedBox) => {
    const background = setup(new Mesh(
      Common.planeGeometry,
      new MeshBasicMaterial({
        color: instance.props.backgroundColor,
        side: 2,
      })
    ), {
      name: 'background',
      parent: instance,
    })

    const box = setup(new Mesh(
      RoundedBox.shared.boxGeometry,
      new AutoLitMaterial({
        color: instance.props.boxColor,
        side: 0,
      })
    ), {
      name: 'box',
      parent: instance,
    })

    const button = setup(new Mesh(
      Common.circleGeometry,
      new AutoLitMaterial({
        color: instance.props.buttonColor,
        side: 0,
      })
    ), {
      name: 'button',
      parent: instance,
      position: [.2, -.2, .201],
      scale: .1,
    })

    return {
      background,
      box,
      button,
    }
  }

  props: typeof RoundedBox.defaultProps
  parts: ReturnType<typeof RoundedBox.createParts>

  constructor(userProps?: Partial<typeof RoundedBox.defaultProps>) {
    super()
    this.props = { ...RoundedBox.defaultProps, ...userProps }
    this.parts = RoundedBox.createParts(this)
  }
}

export const widgets = {
  Colors,
  CrossyDiamond,
  Dashy,
  FourBlades,
  Knob,
  RoundedBox,
  Sphery,
  SplittedDisc,
  Torus,
}

