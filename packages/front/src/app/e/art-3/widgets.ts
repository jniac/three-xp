import { AlwaysStencilFunc, CircleGeometry, ColorRepresentation, EqualStencilFunc, Group, Mesh, MeshBasicMaterial, MeshBasicMaterialParameters, PlaneGeometry, ReplaceStencilOp, RingGeometry, Vector3, Vector4 } from 'three'

import { ShaderForge } from 'some-utils-three/shader-forge'
import { setup } from 'some-utils-three/utils/tree'
import { Tick } from 'some-utils-ts/ticker'

const Common = {
  planeGeometry: new PlaneGeometry(1, 1),
}

export class Blades extends Group {
  static shared = {
    geometry: new PlaneGeometry().translate(.5, .5, 0),
  }

  parts = (() => {
    const mask = setup(new Mesh(
      Common.planeGeometry,
      new MeshBasicMaterial({
        color: 'white',
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
        Blades.shared.geometry,
        new MeshBasicMaterial({
          color: entry.color,
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

export class Knob extends Group {
  static RingMaterial = class extends MeshBasicMaterial {
    static defaultProps = {
      aperture: .25,
    }

    uniforms = {
      uParams: {
        value: new Vector4(.3, .35, 0, 0), // x: innerRadius, y: outerRadius, z: aperture, w: time
      },
    }

    get aperture() { return this.uniforms.uParams.value.z / Math.PI }
    set aperture(value) { this.uniforms.uParams.value.z = value * Math.PI }

    constructor(userProps?: MeshBasicMaterialParameters & Partial<typeof Knob.RingMaterial.defaultProps>) {
      const { aperture, ...parameters } = { ...Knob.RingMaterial.defaultProps, ...userProps }

      super({
        color: '#333',
        side: 2,
        alphaHash: true,
        ...parameters,
      })

      this.aperture = aperture

      this.onBeforeCompile = shader => ShaderForge.with(shader)
        .uniforms(this.uniforms)
        .createVarying('sf_vObjectPosition')
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
      return 'KnobRingMaterial'
    }
  }

  static defaultProps = {
    backgroundColor: <ColorRepresentation>'#56AB6D',
    discColor: <ColorRepresentation>'#D9D9D9',
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
      new MeshBasicMaterial({
        color: instance.props.discColor,
      })
    ), {
      name: 'disc',
      z: .001,
      parent: instance,
    })

    const handle = setup(new Mesh(
      new RingGeometry(.3, .35, 96),
      new Knob.RingMaterial({
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
