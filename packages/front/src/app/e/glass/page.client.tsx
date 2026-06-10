'use client'
import { DirectionalLight, EquirectangularReflectionMapping, Group, HemisphereLight, Mesh, MeshPhysicalMaterial, TorusKnotGeometry } from 'three'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'

import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { anyLoader } from 'some-utils-three/loaders/any-loader'
import { MyGTAOPass } from 'some-utils-three/postprocessing/MyGTAOPass'
import { setup } from 'some-utils-three/utils/tree'

import { config } from '@/config'

import { Cyclo } from './Cyclo'
import { Editor } from './editor-ui'

const gltfLoader = new GLTFLoader()

class LightSetup extends Group {
  static defaultProps = {
    intensity: 1,
  }

  static createParts(instance: LightSetup) {
    const { intensity } = instance.props
    return {
      directional: setup(new DirectionalLight('white', intensity * 0.75), instance),
      hemisphere: setup(new HemisphereLight('#f7f5e6', '#222124', intensity * 0.75), instance),
    }
  }

  props: typeof LightSetup.defaultProps

  parts: ReturnType<typeof LightSetup.createParts>

  constructor(props?: Partial<typeof LightSetup.defaultProps>) {
    super()
    this.props = { ...LightSetup.defaultProps, ...props }
    this.parts = LightSetup.createParts(this)
  }
}

export function MyScene() {
  const three = useThreeWebGL(function* (three) {
    const gtao = new MyGTAOPass(three.scene, three.camera)
    yield three.pipeline.addPass(gtao)
  }, [])

  useGroup('my-scene', async function* (group) {
    setup(new DebugHelper().regularGrid(), group)

    setup(new LightSetup({ intensity: 1 }), group)

    const cyclo = setup(new Cyclo(), group)
    Object.assign(window, { cyclo })

    // Some mesh for refraction testing
    setup(new Mesh(new TorusKnotGeometry(1, .4, 128, 32), new MeshPhysicalMaterial({})), {
      name: 'TorusKnot',
      position: [0, 1, -3],
      parent: group,
    })

    const texture = await anyLoader.loadTexture(`${config.assets()}env/kloofendal_43d_clear_puresky_4k.hdr`)
    texture.mapping = EquirectangularReflectionMapping
    three.scene.environment = texture
    three.scene.environmentIntensity = .3
    three.scene.background = texture

    const gltf = await gltfLoader.loadAsync(`${config.assets()}meshes/verre.gltf`)
    setup(gltf.scene, {
      parent: group,
      z: .1,
    })
    gltf.scene.traverse(child => {
      if (child instanceof Mesh) {
        // child.material = new AutoLitMaterial()
        let geometry = child.geometry
        // geometry = geometry.computeVertexNormals()
        // geometry = BufferGeometryUtils.mergeVertices(geometry, 1e-4)
        // geometry = BufferGeometryUtils.toCreasedNormals(geometry, 45 * Math.PI / 180)
        child.geometry = geometry
        child.material = new MeshPhysicalMaterial({
          transmission: 1,
          roughness: .25,
          metalness: .1,
          ior: 2,
          dispersion: 5,
          iridescence: .4,
          iridescenceIOR: 1.3,
          thickness: 4.2,
        })
      }
    })
  }, [])
  return null
}


export default function PageClient() {
  return (
    <ThreeProvider
      fxaa
      vertigoControls={{
        size: 3,
        focus: [0, .75, 0],
      }}
    >
      <Editor />
      <MyScene />
    </ThreeProvider>
  )
}