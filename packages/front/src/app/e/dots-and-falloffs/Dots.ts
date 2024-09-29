import { Color, ColorRepresentation, DoubleSide, InstancedMesh, Matrix4, MeshBasicMaterial, PlaneGeometry, Uniform, Vector2, Vector4 } from 'three'

import { Vector2Declaration, fromVector2Declaration } from 'some-utils-three/declaration'
import { CircleFalloff, ManhattanBox2Falloff } from 'some-utils-three/falloffs'
import { ShaderForge } from 'some-utils-three/shader-forge'
import { makeMatrix4 } from 'some-utils-three/utils/make'
import { addTo } from 'some-utils-three/utils/tree'
import { glsl_web_colors } from 'some-utils-ts/glsl/colors/web_colors'
import { glsl_easings } from 'some-utils-ts/glsl/easings'
import { glsl_utils } from 'some-utils-ts/glsl/utils'
import { loop2 } from 'some-utils-ts/iteration/loop'
import { lerp } from 'some-utils-ts/math/basic'
import { Tick } from 'some-utils-ts/ticker'

function vec3(color: ColorRepresentation) {
  const { r, g, b } = new Color(color)
  return `vec3(${r.toFixed(3)}, ${g.toFixed(3)}, ${b.toFixed(3)})`
}

const defaultProps = {
  grid: <Vector2Declaration>[16, 16]
}

const geometry = new PlaneGeometry(1, 1, 1, 1)

const material = new MeshBasicMaterial({
  side: DoubleSide,
  transparent: true,
})

const uniforms = {
  uRadiusScalar: new Uniform(0.9),
  uCircleMat: new Uniform(new Matrix4().identity()),
  uCircleProps: new Uniform(new Vector4(1, 2, 0, 0)),
  uBox0Mat: new Uniform(new Matrix4().identity()),
  uBox0Props: new Uniform(new Vector4(1, 1, 0, 0)),
}

material.onBeforeCompile = shader => ShaderForge.with(shader)
  .defines({
    USE_UV: '',
  })
  .uniforms(uniforms)
  .varying({
    vCenter: 'vec3',
    vWorldPosition2: 'vec3',
  })
  .vertex.mainAfterAll(/* glsl */`
    vWorldPosition2 = (modelMatrix * instanceMatrix * vec4(transformed, 1.0)).xyz;
    vCenter = (modelMatrix * instanceMatrix[3]).xyz;
  `)
  .fragment.top(
    glsl_utils,
    glsl_web_colors,
    glsl_easings,
  )
  .fragment.top(
    CircleFalloff.glsl,
    ManhattanBox2Falloff.glsl,
  )
  .fragment.after('color_fragment', /* glsl */`
    CircleFalloff circle = CircleFalloff(uCircleMat, uCircleProps.x, uCircleProps.y);
    ManhattanBox2Falloff box = ManhattanBox2Falloff(uBox0Mat, uBox0Props.x, uBox0Props.y, uBox0Props.z);
    float d = 0.0;
    d += clamp01(falloff(box, vWorldPosition2));
    d += clamp01(falloff(circle, vWorldPosition2));
    diffuseColor.rgb = mix(${vec3('#c2e1ff')}, ${vec3('#d80773')}, easeInOut3(clamp01(d)));
  `)
  .fragment.after('alphamap_fragment', /* glsl */`
    float scalar = 1.0 / uRadiusScalar / mix(1.0, 0.25, easeInOut3(clamp01(d)));
    float alpha = smoothstep(1.0, 0.99, length(vUv - 0.5) * scalar / 0.5);

    if (alpha < 0.01) discard;

    diffuseColor.a *= alpha;
  `)


export class Dots extends InstancedMesh {
  props: typeof defaultProps

  internal = {
    grid: new Vector2(),
  }

  falloffsAreVisible = true
  falloffs = {
    circle: addTo(new CircleFalloff(), this, { position: [-3, -2, 0] }),
    box0: addTo(new ManhattanBox2Falloff({}), this, { position: [3, 2, 0] }),
  }

  constructor(props?: Partial<typeof defaultProps>) {
    const { x, y } = fromVector2Declaration(props?.grid ?? defaultProps.grid)
    const count = x * y
    super(geometry, material, count)

    this.props = { ...defaultProps, ...props }

    for (const it of loop2(x, y)) {
      this.setMatrixAt(it.i, makeMatrix4({
        x: it.x - x / 2,
        y: it.y - y / 2,
      }))
    }
  }

  onTick(tick: Tick) {
    for (const falloff of Object.values(this.falloffs)) {
      falloff.visible = this.falloffsAreVisible
    }

    const { box0, circle } = this.falloffs

    circle.falloff = lerp(.1, 4, tick.sin01Time({ frequency: .15 }))
    circle.radius = lerp(1, 5, tick.sin01Time({ frequency: .1, phase: .5 }))
    circle.setupUniforms(
      uniforms.uCircleMat,
      uniforms.uCircleProps,
    )


    box0.rotation.z += .1 * tick.deltaTime
    box0.set({
      width: 8,
      falloff: lerp(.5, 6, tick.sin01Time({ frequency: .15 })),
    })
    box0.setupUniforms(
      uniforms.uBox0Mat,
      uniforms.uBox0Props,
    )
  }
}
