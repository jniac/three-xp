import { BufferAttribute, BufferGeometry, ClampToEdgeWrapping, DataTexture, FloatType, Group, NearestFilter, Points, PointsMaterial, RGBAFormat, UVMapping, Vector2 } from 'three'

import { ShaderForge } from 'some-utils-three/shader-forge'
import { glsl_easings } from 'some-utils-ts/glsl/easings'
import { PRNG } from 'some-utils-ts/random/prng'
import { Ticker } from 'some-utils-ts/ticker'

import { textureLoader } from '../textureLoader'
import { SimplifiedNurbsCurve } from './simplified-nurbs-curve'

export class ContributionsPoints extends Group {
  constructor(curves: SimplifiedNurbsCurve[], { pointsPerCurve = 80, curveSubdivisions = 256 } = {}) {
    super()

    const totalPoints = curves.length * pointsPerCurve
    const geometry = new BufferGeometry()

    const positions = new Float32Array(totalPoints * 3)
    geometry.setAttribute('position', new BufferAttribute(positions, 3))

    const random = new Float32Array(totalPoints * 4)
    PRNG.seed(987632)
    for (let i = 0; i < random.length; i++) {
      random[i] = PRNG.random()
    }
    geometry.setAttribute('random', new BufferAttribute(random, 4))

    const curvesPosition = new Float32Array(curves.length * curveSubdivisions * 4)
    const curvesTangent = new Float32Array(curves.length * curveSubdivisions * 4)

    for (let j = 0; j < curves.length; j++) {
      for (let i = 0; i < pointsPerCurve; i++) {
        const k = j * pointsPerCurve + i
        positions[k * 3] = i
        positions[k * 3 + 1] = j
        positions[k * 3 + 2] = 0
      }

      const nurbs = curves[j].nurbsCurve
      if (!nurbs) {
        throw new Error('NURBS curve not set.')
      }
      for (let i = 0; i < curveSubdivisions; i++) {
        const t = i / curveSubdivisions
        const point = nurbs.getPoint(t)
        const tangent = nurbs.getTangent(t)
        const k = j * curveSubdivisions + i

        curvesPosition[k * 4] = point.x
        curvesPosition[k * 4 + 1] = point.y
        curvesPosition[k * 4 + 2] = point.z

        curvesTangent[k * 4] = tangent.x
        curvesTangent[k * 4 + 1] = tangent.y
        curvesTangent[k * 4 + 2] = tangent.z
      }
    }

    const createMap = (data: Float32Array) => {
      const map = new DataTexture(
        data,
        curveSubdivisions,
        curves.length,
        RGBAFormat,
        FloatType,
        UVMapping,
        ClampToEdgeWrapping,
        ClampToEdgeWrapping,
        NearestFilter,
        NearestFilter)
      map.generateMipmaps = false
      map.needsUpdate = true
      return map
    }

    const positionMap = createMap(curvesPosition)
    const tangentMap = createMap(curvesTangent)

    PRNG.seed(5678492)
    const uniforms = {
      uTime: Ticker.get('three').uTime,
      uPointsPerCurve: { value: pointsPerCurve },
      uCurvesMapSize: { value: new Vector2(curveSubdivisions, curves.length) },
      uCurvesPositionMap: { value: positionMap },
      uCurvesTangentMap: { value: tangentMap },
      uColors: { value: curves.map(curve => curve.color) },
      uCurveRandom: { value: curves.map(() => PRNG.random()) },
      uMaskMaps: {
        value: [
          textureLoader.load('textures/rounded-square.png'),
          textureLoader.load('textures/rounded-plus.png'),
          textureLoader.load('textures/rounded-rhomb.png'),
        ]
      }
    }

    const material = new PointsMaterial({
      vertexColors: true,
      size: 0.5,
    })

    // https://jniac.github.io/three-xp/t/shader-xplr#points,vertexShader
    material.onBeforeCompile = shader => ShaderForge.with(shader)
      .uniforms(uniforms)
      .varying({ vRandom: 'vec4' })
      .vertex.top(glsl_easings)
      .vertex.top(/* glsl */ `
        attribute vec4 random;
      `)
      .vertex.replace('begin_vertex', /* glsl */`
        int j = gl_VertexID / int(uPointsPerCurve);
        int i = gl_VertexID - j * int(uPointsPerCurve);
        float r = uCurveRandom[j]; // Curve random value

        vColor = uColors[j] * mix(0.8, 1.2, random.x);

        float curveFraction = 0.2;
        float curveSpeed = 0.0125;
        float curveInnerSpeed = 0.05;

        float t3 = fract(position.x / uPointsPerCurve + uTime * curveInnerSpeed);
        float t0 = fract(curveFraction * t3 + r + uTime * curveSpeed);
        t0 = easeIn2(t0);

        float x = t0;
        float y = position.y / uCurvesMapSize.y;
        float xMax = uCurvesMapSize.x - 1.0; // one less because of linear interpolation (x0 -> x1)
        float xT = fract(x * xMax);
        float x0 = floor(x * xMax) / xMax;
        float x1 = floor(x * xMax + 1.0) / xMax;
        
        vec3 p0 = texture(uCurvesPositionMap, vec2(x0, y)).xyz;
        vec3 p1 = texture(uCurvesPositionMap, vec2(x1, y)).xyz;
        vec3 p = mix(p0, p1, xT);

        vec3 tangent0 = texture(uCurvesTangentMap, vec2(x0, y)).xyz;
        vec3 tangent1 = texture(uCurvesTangentMap, vec2(x1, y)).xyz;
        vec3 tangent = mix(tangent0, tangent1, xT);

        vec3 normal = normalize(cross(tangent, vec3(0.0, 1.0, 0.0)));
        vec3 binormal = normalize(cross(normal, tangent));

        float t1 = sin(random.x * PI2 + uTime * mix(0.5, 1.0, random.z));
        float t2 = sin(random.y * PI2 + uTime * mix(0.5, 1.0, random.w));
        float dispersion = mix(0.005, 0.2, easeOut8(t0));
        vec3 transformed = p 
          + normal * (random.z - 0.5) * dispersion * t1 
          + binormal * (random.w - 0.5) * dispersion * t2;
      `)
      .vertex.mainAfterAll(/* glsl */ `
        gl_PointSize *= mix(0.2, 1.0, easeInThenOut(t0, 16.0))
          * mix(0.25, 1.0, easeInThenOut(t3, 6.0))
          * mix(0.25, 1.0, random.z);

        vRandom = random;
      `)
      .fragment.mainAfterAll(/* glsl */`
        if (vRandom.x < 0.5) {
          if (texture2D(uMaskMaps[0], gl_PointCoord).r < 0.5) discard;
        } else if (vRandom.y < 0.2) {
          if (texture2D(uMaskMaps[1], gl_PointCoord).r < 0.5) discard;
        } else {
          if (texture2D(uMaskMaps[2], gl_PointCoord).r < 0.5) discard;
        }
      `)

    const points = new Points(geometry, material)
    this.add(points)
  }
}
