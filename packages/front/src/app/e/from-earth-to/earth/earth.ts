import { BackSide, BufferGeometry, Color, ColorRepresentation, DoubleSide, FrontSide, Group, IcosahedronGeometry, InstancedMesh, Matrix4, Mesh, MeshBasicMaterial, PlaneGeometry, Ray, Sphere, Vector3 } from 'three'

import { LineHelper } from 'some-utils-three/helpers/line'
import { ShaderForge } from 'some-utils-three/shader-forge'
import { setup } from 'some-utils-three/utils/tree'
import { glsl_easings } from 'some-utils-ts/glsl/easings'
import { glsl_utils } from 'some-utils-ts/glsl/utils'
import { lerp } from 'some-utils-ts/math/basic'
import { PRNG } from 'some-utils-ts/random/prng'
import { Tick, Ticker } from 'some-utils-ts/ticker'
import { Vector3Like } from 'some-utils-ts/types'

import spots from './spots.json'

import { textureLoader } from '../textureLoader'
import { bindUserData, fromSpherical } from '../utils'
import { AnimatedCurve } from './animated-curve'
import { ContributionsPoints } from './contribution-points'
import { SimplifiedNurbsCurve } from './simplified-nurbs-curve'

const colors = [
  '#3366ff',
  '#009a27',
  '#00943b',
  '#2512cf',
  '#bb1d81',
  '#67cd6c',
  '#fed801',
  '#ff1f02',
]

class MiniSpots extends Group {
  static shared = {
    geometry: new IcosahedronGeometry(0.005, 12),
    material: new MeshBasicMaterial(),
    matrix: new Matrix4().makeScale(0, 0, 0),
    color: new Color('white'),
  }

  instancedMesh: InstancedMesh<BufferGeometry, MeshBasicMaterial>
  index = 0
  constructor({ sizeBase = 400 } = {}) {
    super()

    const { geometry, material, matrix, color } = MiniSpots.shared
    this.instancedMesh = new InstancedMesh(geometry, material, sizeBase)
    this.add(this.instancedMesh)

    matrix.makeScale(0, 0, 0)
    color.set('white')
    for (let i = 0; i < sizeBase; i++) {
      this.instancedMesh.setMatrixAt(i, matrix)
      this.instancedMesh.setColorAt(i, color)
    }
  }
  addSpot({ x, y, z }: Vector3Like, colorArg: ColorRepresentation) {
    const { matrix, color } = MiniSpots.shared
    this.instancedMesh.setMatrixAt(this.index, matrix.makeTranslation(x, y, z))
    this.instancedMesh.setColorAt(this.index, color.set(colorArg))
    this.index++
  }
}

export class Earth extends Group {
  static sphericalCoordinates = {
    paris: { theta: 0.9426432714835036, phi: 1.7045171372513754 },
  }

  uniforms = {
    uTime: Ticker.get('three').uTime,
    uSpherize: { value: 1 },
    uSunPosition: { value: new Vector3(0.5, 0.7, 0.3) },
    uSide: { value: 0 },
  }

  userData = bindUserData({}, {
    spherize: {
      bind: [this.uniforms.uSpherize, 'value'],
      meta: 'Slider(0, 1)',
    },
  })

  parts = {
    miniSpots: new MiniSpots(),
    back: <Mesh>null!,
    front: <Mesh>null!,
  }

  constructor() {
    super()

    const texture = textureLoader.load('images/blank-world-map-alt.png')

    const { uniforms } = this

    const material = new MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: DoubleSide,
      depthWrite: false,
    })
    material.onBeforeCompile = shader => ShaderForge.with(shader)
      .uniforms(uniforms)
      .varying({
        vWorldNormal: 'vec3',
        vWorldPosition2: 'vec3',
      })
      .vertex.replace('begin_vertex', /* glsl */ `
        float tx = position.x;
        float ty = position.y;

        vec3 transformed;
        vec3 normal;
        if (uSpherize < 0.001) {
          transformed = vec3(tx * 2.0, ty, 0.0) * PI;
          normal = vec3(0.0, 0.0, 1.0);
        } else {
          float r = 1.0 / uSpherize;
          float phi = tx * PI * 2.0 * uSpherize - PI * 0.5;
          float theta = ty * PI * uSpherize;
          float x = cos(theta) * cos(phi);
          float z = cos(theta) * -sin(phi);
          float y = sin(theta);
          transformed = vec3(x, y, z - 1.0) * r + vec3(0.0, 0.0, uSpherize);
          normal = vec3(x, y, z);
        }
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        vWorldPosition2 = (modelMatrix * vec4(transformed, 1.0)).xyz;
      `)
      .vertex.mainAfterAll(/* glsl */ `
      `)
      .fragment.top(
        glsl_utils,
        glsl_easings
      )
      .fragment.mainBeforeAll(/* glsl */ `
        vec3 lightDirection = normalize(uSunPosition);
        float light = dot(vWorldNormal, lightDirection) * 0.5 + 0.5;
        light = pow(light, 2.0);

        vec3 viewDir = normalize(cameraPosition - vWorldPosition2);
        float cosTheta = dot(normalize(vWorldNormal * uSide), viewDir);
        float fresnelBias = 0.1;
        float fresnelPower = 3.0;
        float fresnel = fresnelBias + (1.0 - fresnelBias) * pow(1.0 - cosTheta, fresnelPower);
      `)
      .fragment.replace('map_fragment', /* glsl */ `
        #ifdef USE_MAP
          vec2 uv = vMapUv;
          float r = uv.y * 2.0;
          if (r > 1.0) r = 2.0 - r;
          r = 1.0 - r;          

          float a = 0.0;
          a += pow(r, 2.4) * 0.205;
          a += pow(r, 10.0) * 0.03;
          float x = uv.x;
          
          float padding = 0.005;
          uv.x = mix(padding + a, 1.0 - padding - a, x);
          // uv.x = 1.0 - uv.x;
          vec4 sampledDiffuseColor = texture2D(map, uv);

          diffuseColor.rgb *= vec3(mix(0.75, 1.0, light));
          float alpha = (sampledDiffuseColor.r + sampledDiffuseColor.g + sampledDiffuseColor.b) > 0.1 ? 1.0 : 0.0;
          diffuseColor.a *= alpha + fresnel * 1.2;
          // diffuseColor.rgb = vec3(fresnel);
          // diffuseColor.rgb = vWorldNormal;
          // diffuseColor.a = 1.0;
        #endif
      `)

    const geometry = new PlaneGeometry(1, 1, 256, 128)

    setup(this, {
      name: 'earth',
      // scaleScalar: 3,
      // rotationY: '-90deg',
    })

    const back = setup(new Mesh(geometry, material), { parent: this, name: 'back' })
    back.onBeforeRender = () => {
      uniforms.uSide.value = -1
      material.color.set('#cdcdcd')
      material.side = BackSide
      material.needsUpdate = true
    }
    this.parts.back = back

    const front = setup(new Mesh(geometry, material), { parent: this, name: 'front' })
    front.onBeforeRender = () => {
      uniforms.uSide.value = 1
      material.color.set('#ffffff')
      material.side = FrontSide
      material.needsUpdate = true
    }
    this.parts.front = front

    setup(new Mesh(new PlaneGeometry(), material), { parent: this, y: -1.5, scaleX: 3, visible: false })

    const lines = setup(new LineHelper(), { parent: this })
    lines
      .circle({ radius: 1.04 })
      .draw()

    PRNG.seed(123)
    const curves = [
      ...spots.map(spot => this.addSphericalSpot({
        ...spot,
        color: PRNG.pick(colors)
      })),
      ...spots.filter(() => PRNG.chance(.8)).map(spot => {
        let { phi, theta } = spot
        phi += 0.04 * PRNG.around()
        theta += 0.04 * PRNG.around()
        return this.addSphericalSpot({
          phi, theta,
          color: PRNG.pick(colors)
        })
      }),
    ]
    // this.add(...curves)

    this.add(...curves.map(curve => new AnimatedCurve(curve.points, { color: curve.color })))

    const contributionsPoints = new ContributionsPoints(curves)
    this.add(contributionsPoints)

    this.add(this.parts.miniSpots)
  }

  onTick(tick: Tick) {
  }

  earthRaycast(worldRay: Ray) {
    const localRay = worldRay.clone().applyMatrix4(this.matrixWorld.clone().invert())
    const p = localRay.intersectSphere(new Sphere(new Vector3(), 1), new Vector3())
    return p?.applyMatrix4(this.matrixWorld) ?? null
  }

  sphericalSpots: { phi: number, theta: number }[] = []
  addSphericalSpot({ phi, theta, color = 'white' }: { phi: number, theta: number, color?: ColorRepresentation }) {
    this.parts.miniSpots.addSpot(
      fromSpherical({ phi, theta, radius: 1 }),
      color
    )

    const curve = new SimplifiedNurbsCurve()
    curve.degree = 8
    curve.color.set(color)
    const controlPoints = [fromSpherical({ phi, theta, radius: 1 })]
    let theta2 = theta
    let phi2 = phi
    for (let i = 0; i < 12; i++) {
      const radius = lerp(2, 5, i / 12)
      controlPoints.push(fromSpherical({ theta: theta2, phi: phi2, radius }))
      theta2 = lerp(theta2, 0, .5)
      phi2 += -.65
    }
    curve.setControlPoints(controlPoints)

    return curve
  }
}
