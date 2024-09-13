import { vec3 } from 'some-utils-ts/glsl/conversion'

import { glsl_stegu_snoise } from 'some-utils-ts/glsl/stegu-snoise'
import { BackSide, BoxGeometry, IcosahedronGeometry, Mesh, MeshBasicMaterial, ShaderChunk, ShaderMaterial } from 'three'
import { colors } from '../colors'

const vertexShader = /* glsl */ `
  varying vec3 vWorldNormal;
  varying vec3 vPosition;

  vec3 rotate(mat4 m, vec3 v) {
    return vec3(
      dot(v, vec3(m[0][0], m[1][0], m[2][0])),  // X component
      dot(v, vec3(m[0][1], m[1][1], m[2][1])),  // Y component
      dot(v, vec3(m[0][2], m[1][2], m[2][2]))   // Z component
    );
  }

  void main() {
    vPosition = position;
    vWorldNormal = normalize(rotate(modelMatrix, position));

    // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    // Ignore the position, we only need the normal:
    gl_Position = projectionMatrix * vec4(rotate(modelViewMatrix, position), 1.0);
  }
`

const fragmentShader =  /* glsl */ `
  ${ShaderChunk.cube_uv_reflection_fragment}
  ${glsl_stegu_snoise}

  varying vec3 vPosition;
  varying vec3 vWorldNormal;

  struct Plane {
    vec3 origin;
    vec3 normal;
  };

  float signedDistanceToPlane(Plane plane, vec3 p) {
    return dot(plane.normal, p - plane.origin);
  }

  vec3 checker3(vec3 position, float scale, float edgeWidth, vec3 color1, vec3 color2) {
    // Scale the position to control the size of the checker cubes
    vec3 scaledPos = position / scale;

    // Get the integer part (checker grid location)
    vec3 checkerPos = floor(scaledPos);

    // Get the fractional part (inside each cube)
    vec3 fractPos = fract(scaledPos);

    // Calculate the checkerboard pattern (even/odd cubes)
    float checkerSum = mod(checkerPos.x + checkerPos.y + checkerPos.z, 2.0);

    // Smooth transition using smoothstep on the fractional position
    float edgeX = smoothstep(0.0, edgeWidth, fractPos.x);
    float edgeY = smoothstep(0.0, edgeWidth, fractPos.y);
    float edgeZ = smoothstep(0.0, edgeWidth, fractPos.z);

    // Combine the edges to create a smooth transition
    float blend = edgeX * edgeY * edgeZ;
    blend = smoothstep(0.0, edgeWidth, min(min(fractPos.x, fractPos.y), fractPos.z));
    
    // Interpolate between black and white with the smoothstep value
    vec3 baseColor = checkerSum == 0.0 ? color1 : color2;
    vec3 oppositeColor = checkerSum == 0.0 ? color2 : color1;

    // Use the smooth transition to blend between colors
    return mix(baseColor, oppositeColor, blend);
  }

  float sphereGrid(vec3 position, float scale, float edgeWidth) {
    // Scale the position to control the size of the checker cubes
    vec3 scaledPos = position / scale;

    // Get the integer part (checker grid location)
    vec3 checkerPos = floor(scaledPos);

    // Get the fractional part (inside each cube)
    vec3 fractPos = fract(scaledPos);

    vec3 p = fractPos - 0.5;
    float alpha = 1.0 - length(p) * 2.0;

    return smoothstep(0.0, edgeWidth, alpha - 0.1);    
  }

  void main() {
    vec3 p = vWorldNormal * 0.33;
    float n1 = snoise(p * 6.0 * 0.2 + 0.2);
    float n2 = snoise(p * 20.0 + 10.1);
    float n3 = snoise(p * 40.0 + 10.1);
    float n4 = snoise(p * 1400.0 + 13.1);
    float n = n1 * 0.5;
    n += pow(fract((n1 + n2 * 0.015 + n3 * 0.01 + n4 * 0.005) * 85.0), 4.0) * 0.5;
    n += pow(fract((n1 + n2 * 0.015) * 85.0), 4.0) * 0.25;
    n += n4 * 0.2;
    n += 0.8;
    n = pow(n, 0.3);
    float alpha = n;

    gl_FragColor.rgb = mix(${vec3(colors.black)}, ${vec3(colors.red)}, alpha);
    gl_FragColor.a = 1.0;

    // float x = sphereGrid(vPosition, 1.0, 0.01);
    // gl_FragColor.rgb = mix(${vec3(colors.black)}, ${vec3(colors.red)}, x);
    // gl_FragColor.rgb = checker3(vPosition, 1.0, 0.1, ${vec3(colors.black)}, ${vec3(colors.red)});
  }
`

export class ASky extends Mesh {
  constructor({
    debug = false,
  } = {}) {
    const material = new ShaderMaterial({
      depthWrite: false,
      side: BackSide,
      vertexShader,
      fragmentShader,
      uniforms: {},
    })

    const size = 11
    const useSphere = true
    const geometry = useSphere
      ? new IcosahedronGeometry(size / 2, 12)
      : new BoxGeometry(size, size, size)
    super(geometry, material)

    if (debug) {
      this.material = new MeshBasicMaterial({
        depthWrite: false,
        color: 'white',
        wireframe: true,
      })
    }

    this.onBeforeRender = (renderer, scene, camera, geometry, material, group) => {
      this.position.copy(camera.position)
    }

    this.renderOrder = -1
    this.frustumCulled = false
    this.name = 'a-sky'
  }
}
