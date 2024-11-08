import { AmbientLight, BufferGeometry, Color, DirectionalLight, Group, IcosahedronGeometry, Line, LineBasicMaterial, Points, PointsMaterial, RingGeometry, TextureLoader, Vector4 } from 'three'
import { NURBSCurve } from 'three/examples/jsm/curves/NURBSCurve.js'

import { SimpleGridHelper } from 'some-utils-three/helpers/grid'
import { ShaderForge } from 'some-utils-three/shader-forge'
import { setup } from 'some-utils-three/utils/tree'
import { glsl_stegu_snoise } from 'some-utils-ts/glsl/stegu-snoise'
import { glsl_utils } from 'some-utils-ts/glsl/utils'

import { Earth } from './earth/earth'
import { Sky } from './sky'

export const textureLoader = new TextureLoader()

class NurbsDemo extends Group {
  constructor() {
    super()

    // Define control points for the NURBS curve (XYZ and weight)
    const controlPoints = [
      new Vector4(-10, 0, 0, 1),  // (x, y, z, weight)
      new Vector4(-5, 5, 0, 1),
      new Vector4(0, 0, 0, 1),
      new Vector4(5, -5, 0, 1),
      new Vector4(10, 0, 0, 1)
    ]

    // Define the degree of the curve (3 is a common choice)
    const degree = 3

    // Define a uniform knot vector
    const numControlPoints = controlPoints.length
    const knotVector = []
    for (let i = 0; i <= degree; i++) knotVector.push(0)  // Add degree+1 zeros at the start
    for (let i = 1; i <= numControlPoints - degree; i++) knotVector.push(i)  // Uniform spacing
    for (let i = 0; i <= degree; i++) knotVector.push(numControlPoints - degree)  // Add degree+1 max values at the end

    // NOTE: Added to ChatGPT code:
    // Remove the last knot value to match the number of control points
    knotVector.pop()

    // Create the NURBS curve
    const nurbsCurve = new NURBSCurve(degree, knotVector, controlPoints)

    // Create the geometry for the curve
    const curveGeometry = new BufferGeometry().setFromPoints(nurbsCurve.getPoints(100))  // Sample 100 points along the curve

    // Create a line to visualize the curve
    const curveMaterial = new LineBasicMaterial({ color: 0xff0000 })
    const nurbsLine = new Line(curveGeometry, curveMaterial)
    this.add(nurbsLine)
  }
}

class Contributions extends Group {
  constructor() {
    super()

    const map1 = textureLoader.load('/assets/textures/rounded-square.png')
    const map2 = textureLoader.load('/assets/textures/rounded-plus.png')
    const map3 = textureLoader.load('/assets/textures/rounded-rhomb.png')

    const uniforms = {
      uColors: {
        value: [
          new Color('#3bc3aa'),
          new Color('#50e962'),
          new Color('#0000ff'),
        ]
      },
      uMaps: {
        value: [map1, map2, map3],
      }
    }

    const material = new PointsMaterial({
      vertexColors: true,
      size: .03,
      map: map1,
      alphaTest: .5,
    })

    material.onBeforeCompile = shader => ShaderForge.with(shader)
      .uniforms(uniforms)
      .varying({
        vWorldPosition2: 'vec3',
      })
      .vertex.top(
        glsl_stegu_snoise,
      )
      .vertex.mainAfterAll(/* glsl */`
        int i = int((snoise(position * 40.0) * 0.5 + 0.5) * 3.0);
        vColor = uColors[i];
        // vColor = vec3(1.0);
        float n = snoise(position) + snoise(position * 10.0);
        n = clamp(n, 0.0, 1.0);
        gl_PointSize *= n;

        vWorldPosition2 = (modelMatrix * vec4(position, 1.0)).xyz;
      `)
      .fragment.top(
        glsl_utils,
      )
      .fragment.after('color_fragment' as any, /* glsl */ `
        vec2 p = gl_PointCoord.xy;
        float i = hash(vWorldPosition2) * 3.0;
        if (i < 1.0) {
          diffuseColor.a = texture2D(uMaps[0], p).r;
        } else if (i < 2.0) {
          diffuseColor.a = texture2D(uMaps[1], p).r;
        } else {
          diffuseColor.a = texture2D(uMaps[2], p).r;
        }
      `)

    const sphere = new IcosahedronGeometry(1.01, 48)
    const ring = new RingGeometry(1.5, 2.5, 512, 64)
    setup(new Points(sphere, material), { parent: this })
    setup(new Points(ring, material), { parent: this, rotationX: '90deg', })
  }
}

class Lights extends Group {
  parts = {
    ambient: setup(new AmbientLight(0xffffff, 1.5), this),
    directional: setup(new DirectionalLight(0xffffff, 1.5), this),
  }
}

export class Poc1Scene extends Group {
  parts = {
    sky: setup(new Sky(), this),
    earth: setup(new Earth(), this),
    lights: setup(new Lights(), this),
    grid: setup(new SimpleGridHelper({ size: [20, 20] }), { parent: this, visible: false }),
    // contributions: setup(new Contributions(), this),
    // nurbsDemo: setup(new NurbsDemo(), this),
  }

  constructor() {
    super()
    console.log('Poc1Scene!')
  }
}
