import { BufferGeometry, RepeatWrapping, TextureLoader } from 'three'
import { Fn, MeshPhysicalNodeMaterial, StorageBufferAttribute, attribute, float, instanceIndex, mx_noise_vec3, storage, texture, transformNormalToView, uniform, uv, vec3, vec4 } from 'three/webgpu'

import { Ticker } from 'some-utils-ts/ticker'

/**
 * Foo Baz Qux ok?
 * - Foo is the position
 */
export function applyFooBazQux(targetGeometry: BufferGeometry, targetMaterial: MeshPhysicalNodeMaterial) {
  const count = targetGeometry.attributes.position.count
  const fooAttribute = new StorageBufferAttribute(targetGeometry.attributes.position.array, 3)
  const bazAttribute = new StorageBufferAttribute(targetGeometry.attributes.position.array, 3)
  const quxAttribute = new StorageBufferAttribute(new Float32Array(count * 3), 3)
  const zooAttribute = new StorageBufferAttribute(new Float32Array(count * 3), 3)
  // @ts-ignore
  const fooStorage = storage(fooAttribute, 'vec3', count)
  const bazStorage = storage(bazAttribute, 'vec3', count)
  const quxStorage = storage(quxAttribute, 'vec3', count)
  const zooStorage = storage(zooAttribute, 'vec3', count)

  const uTime = uniform(float(0))
  uTime.onFrameUpdate(() => Ticker.get('three').time)
  const uDeltaTime = uniform(float(0))
  uDeltaTime.onFrameUpdate(() => Ticker.get('three').deltaTime)

  const uPointer = uniform(vec4(0, 0, -.5, .66)) // w is radius

  // @ts-ignore
  const fooFn = Fn(({ geometry }) => {
    geometry.setAttribute('foo', fooAttribute)
    geometry.setAttribute('baz', bazAttribute)
    geometry.setAttribute('qux', quxAttribute)

    // @ts-ignore
    const computeDelta = Fn(([p]) => {
      // noise
      const x = float(0)
      const y = float(0)
      const z = p.x.mul(10).sin().remap(-1, 1, -.01, .01)
      const z2 = p.y.mul(20).add(p.x.mul(1).sin().mul(.1)).sin().remap(-1, 1, -.02, .02)
      const n = vec3(x, y, z.add(z2)).add(mx_noise_vec3(p.mul(4).add(uTime.mul(.2))).mul(.1))

      // pointer
      const delta = p.sub(uPointer.xyz)
      const deltaLength = delta.length()
      const deltaNormalized = delta.div(deltaLength.max(.001))
      const force = deltaLength.remapClamp(0, uPointer.w, 1, 0)
      const d = deltaNormalized.mul(force)

      return n.add(d)
    })

    // @ts-ignore
    const computeUpdate = Fn(() => {
      const baz = bazStorage.element(instanceIndex)

      // Position
      const foo = fooStorage.element(instanceIndex)
      foo.assign(baz.add(computeDelta(baz)))

      // Normal
      const qux = quxStorage.element(instanceIndex)
      const d = float(.02)
      const px1 = baz.add(vec3(d, 0, 0))
      const vx1 = px1.add(computeDelta(px1))
      const px2 = baz.add(vec3(d.negate(), 0, 0))
      const vx2 = px2.add(computeDelta(px2))
      const py1 = baz.add(vec3(0, d, 0))
      const vy1 = py1.add(computeDelta(py1))
      const py2 = baz.add(vec3(0, d.negate(), 0))
      const vy2 = py2.add(computeDelta(py2))
      const vx = vx2.sub(vx1).normalize()
      const vy = vy2.sub(vy1).normalize()
      const normal = vx.cross(vy).normalize()
      qux.assign(normal)

      // @ts-ignore
    })().compute(count)
    return computeUpdate
  })

  /**
   * Normal Blend RNM
   * 
   * Note: Normal should be still packed in the range of [0, 1] for this to work.
   * 
   * Adapted from GLSL:
   * https://blog.selfshadow.com/sandbox/normals.html
   * https://www.shadertoy.com/view/4t2SzR
   * ```glsl
   * vec3 NormalBlend_RNM(vec3 n1, vec3 n2) {
   *   // Unpack (see article on why it's not just n*2-1)
   *   n1 = n1 * vec3( 2,  2, 2) + vec3(-1, -1,  0);
   *   n2 = n2 * vec3(-2, -2, 2) + vec3( 1,  1, -1);
   *   
   *   // Blend
   *   return n1 * dot(n1, n2) / n1.z - n2;
   * }
   * ```
   */
  // @ts-ignore
  const combineNormalFn = Fn(([baseNormal, detailNormal]) => {
    const n1 = baseNormal.mul(vec3(2, 2, 2)).add(vec3(-1, -1, 0))
    const n2 = detailNormal.mul(vec3(-2, -2, 2)).add(vec3(1, 1, -1))
    return n1.mul(n1.dot(n2)).div(n1.z).sub(n2)
  })

  targetMaterial.geometryNode = fooFn()
  targetMaterial.positionNode = attribute('foo')

  const normalNode = transformNormalToView(attribute('qux'))
  targetMaterial.normalNode = normalNode

  const textureLoader = new TextureLoader()
  const normalMap = textureLoader.load('https://threejs.org/examples/textures/carbon/Carbon_Normal.png')
  normalMap.wrapS = normalMap.wrapT = RepeatWrapping

  const detailNormalNode = texture(normalMap, uv().mul(12)).mul(2).sub(1)
  targetMaterial.clearcoatNormalNode = transformNormalToView(detailNormalNode)
  targetMaterial.clearcoatNormalNode = transformNormalToView(combineNormalFn(normalNode.mul(.5).add(.5), texture(normalMap, uv().mul(24))))

  // targetMaterial.clearcoatNormalNode = normalNode.mul(mx_noise_vec3(attribute('baz').mul(4).add(uTime.mul(.2))).mul(.1))
}
