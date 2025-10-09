import { BufferGeometry, CapsuleGeometry, HalfFloatType, InstancedMesh, Mesh, MeshBasicMaterial, OrthographicCamera, PlaneGeometry, RedFormat, Scene, Vector3, WebGLRenderTarget } from 'three'

import { useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { ShaderForge, vec3 } from 'some-utils-three/shader-forge'
import { makeMatrix4 } from 'some-utils-three/utils/make'
import { setup } from 'some-utils-three/utils/tree'
import { glsl_ramp } from 'some-utils-ts/glsl/ramp'
import { glsl_utils } from 'some-utils-ts/glsl/utils'
import { RandomUtils } from 'some-utils-ts/random/random-utils'
import { Ticker } from 'some-utils-ts/ticker'
import { BufferGeometryUtils } from 'three/examples/jsm/Addons.js'

class PatternScene extends Scene {
  constructor() {
    super()

    const itemCount = 300
    const size = 10

    this.position.set(0, 0, -size)

    RandomUtils.setRandom('parkmiller', 67890)

    const geometries = <BufferGeometry[]>[]
    for (let i = 0; i < itemCount; i++) {
      const scale = RandomUtils.float(.5, 2) * 1.5
      // const geometry = new BoxGeometry()
      const geometry = new CapsuleGeometry(.25, 1, 8, 24)
        .scale(scale, scale, scale)
        .rotateX(RandomUtils.random() * Math.PI)
        .rotateY(RandomUtils.random() * Math.PI)
        .rotateZ(RandomUtils.random() * Math.PI)
        .translate(
          (RandomUtils.random() - 0.5) * size,
          (RandomUtils.random() - 0.5) * size,
          (RandomUtils.random() ** 4 - 0.5) * size,
        )
      geometries.push(geometry)
    }

    const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries)
    const geometry3x3Sources = [
      mergedGeometry,
      mergedGeometry.clone().translate(size, 0, 0),
      mergedGeometry.clone().translate(size, size, 0),
      mergedGeometry.clone().translate(0, size, 0),
      mergedGeometry.clone().translate(-size, size, 0),
      mergedGeometry.clone().translate(-size, 0, 0),
      mergedGeometry.clone().translate(-size, -size, 0),
      mergedGeometry.clone().translate(0, -size, 0),
      mergedGeometry.clone().translate(size, -size, 0),
    ]
    const geometry3x3 = BufferGeometryUtils.mergeGeometries(geometry3x3Sources)

    mergedGeometry.computeBoundingBox()

    mergedGeometry.dispose()
    for (const source of geometry3x3Sources)
      source.dispose()

    const material = new MeshBasicMaterial()
    const uniforms = {
      uSize: { value: mergedGeometry.boundingBox!.getSize(new Vector3()) },
      uTime: Ticker.get('three').uTime,
    }
    material.onBeforeCompile = shader => ShaderForge.with(shader)
      .uniforms(uniforms)
      .createVarying('sf_vObjectPosition')
      .fragment.top(glsl_utils)
      .fragment.after('map_fragment', /* glsl */`
        float d = 0.5 + sf_vObjectPosition.z / uSize.z;
        diffuseColor.rgb = vec3(d);
        // diffuseColor.rgb = mod(uTime * 0.3, 1.0) > d ? ${vec3('#fc0')} : ${vec3('#0cf')};
      `)

    const instanceCount = 1
    const mesh = setup(new InstancedMesh(geometry3x3, material, instanceCount), this)
    RandomUtils.seed(56789)
    for (let i = 0; i < instanceCount; i++) {
      const rotationZ = i === 0 ? 0 : RandomUtils.float(Math.PI * 2)
      mesh.setMatrixAt(i, makeMatrix4({
        z: -size * i,
        rotationZ,
      }))
    }

    // setup(new DebugHelper(), this)
    //   .box({ size })
  }
}

export function MyScene() {
  useThreeWebGL(function* (three) {
    three.pipeline.basicPasses.fxaa.enabled = false

    const scene = new PatternScene()
    const size = 2048
    const rt = new WebGLRenderTarget(size, size, {
      type: HalfFloatType,
      format: RedFormat,
      generateMipmaps: true,
    })

    const orthoCamera = new OrthographicCamera(-5, 5, 5, -5, 0, 20)
    three.renderer.setRenderTarget(rt)
    three.renderer.render(scene, orthoCamera)
    three.renderer.setRenderTarget(null)

    const material2 = new MeshBasicMaterial({
      map: rt.texture,
    })
    const uniforms = {
      uTime: Ticker.get('three').uTime,
    }
    material2.onBeforeCompile = shader => ShaderForge.with(shader)
      .defines('USE_UV')
      .uniforms(uniforms)
      .fragment.top(glsl_ramp)
      .fragment.replace('map_fragment', /* glsl */`
        vec2 uv = vUv;
        uv.y += uTime * 0.05;
        uv = mod(uv, 1.0);
        vec4 texelColor = texture2D(map, uv);
        // texelColor.rgb = pow(texelColor.rgb, vec3(1.0 / 2.2));
        float alpha = clamp(mod(texelColor.r + uTime * 0.1, 1.0) * 2.0, 0.0, 1.0);
        alpha = cos(alpha * 3.14159 * 2.0) * 0.5 + 0.5;
        alpha = smoothstep(0.2, 0.8, alpha);
        diffuseColor.rgb = mix(${vec3('#6f00ffff')}, ${vec3('#f1ffaaff')}, alpha);

        Vec3Ramp r = ramp(alpha, ${vec3('#6f00ffff')}, ${vec3('#08091dff')}, ${vec3('#00fffaff')}, ${vec3('#ffe4ffff')});
        diffuseColor.rgb = mix(r.a, r.b, r.t);
      `)

    const mesh1 = setup(new Mesh(new PlaneGeometry(), new MeshBasicMaterial({ map: rt.texture })), {
      parent: three.scene,
      x: -5,
      scale: 10,
    })

    const mesh2 = setup(new Mesh(new PlaneGeometry(), material2), {
      parent: three.scene,
      x: 5,
      scale: 10,
    })

    yield () => {
      rt.dispose()
      mesh1.removeFromParent()
      mesh2.removeFromParent()
    }
  })

  useGroup('my-scene', function* (group,) {
  }, [])

  return null
}
