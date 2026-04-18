import { useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { PassType } from 'some-utils-three/contexts/webgl'
import { AmbientLight, CameraHelper, DirectionalLight, DirectionalLightHelper, PCFShadowMap } from 'three'
import { GTAOPass } from 'three/examples/jsm/Addons.js'

export function ThreeSettings() {
  useThreeWebGL(async function* (three) {
    const aoPass = new GTAOPass(three.scene, three.camera)

    aoPass.updateGtaoMaterial({
      radius: 1,
      distanceExponent: 2,
      thickness: 2,
      scale: 1,
      samples: 32,
      distanceFallOff: 1,
      screenSpaceRadius: false,
    })

    aoPass.updatePdMaterial({
      lumaPhi: 10,
      depthPhi: 2,
      normalPhi: 3,
      radius: 4,
      radiusExponent: 2,
      rings: 4,
      samples: 32,
    })

    three.pipeline.addPass(aoPass, { type: PassType.PostProcessing })
    yield () => three.pipeline.removePass(aoPass)
  }, [])

  return null
}

export function LightSetup_A({ debug = false }) {
  useThreeWebGL(function* (three) {
    three.renderer.shadowMap.enabled = true
    three.renderer.shadowMap.type = PCFShadowMap
  }, [])

  useGroup('lights', function* (group, three) {
    const sun = new DirectionalLight(0xffffff, 1)
    sun.position.set(1, 4, 2).multiplyScalar(10)
    sun.castShadow = true
    sun.shadow.camera.top = 20
    sun.shadow.camera.bottom = -20
    sun.shadow.camera.left = -20
    sun.shadow.camera.right = 20
    sun.shadow.camera.near = 0.1
    sun.shadow.camera.far = 100
    sun.shadow.bias = -.0001
    sun.shadow.normalBias = .0001
    sun.shadow.mapSize.width = 2048 * 2
    sun.shadow.mapSize.height = 2048 * 2
    sun.shadow.radius = 0
    sun.shadow.blurSamples = 25
    group.add(sun)

    if (debug) {
      group.add(new DirectionalLightHelper(sun))

      const cameraHelper = new CameraHelper(sun.shadow.camera)
      group.add(cameraHelper)
    }

    const ambientLight = new AmbientLight(0xffffff, 0.5)
    group.add(ambientLight)
  }, [])

  return null
}
