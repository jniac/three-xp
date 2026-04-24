import { useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { PassType } from 'some-utils-three/contexts/webgl'
import { lerpColors } from 'some-utils-three/utils/color'
import { CameraHelper, DirectionalLight, DirectionalLightHelper, HemisphereLight, PCFShadowMap, WebGLRenderer, WebGLRenderTarget } from 'three'
import { GTAOPass } from 'three/examples/jsm/Addons.js'

class MyGTAOPass extends GTAOPass {
  /**
   * Render override to ensure that the GTAO pass only renders objects in layer 0.
   */
  render(renderer: WebGLRenderer, writeBuffer: WebGLRenderTarget, readBuffer: WebGLRenderTarget, deltaTime: number, maskActive: boolean): void {
    const previousLayer = this.camera.layers.mask
    this.camera.layers.set(0)
    super.render(renderer, writeBuffer, readBuffer, deltaTime, maskActive)
    this.camera.layers.mask = previousLayer
  }
}

export function ThreeSettings() {
  useThreeWebGL(async function* (three) {
    const aoPass = new MyGTAOPass(three.scene, three.camera)

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

    const sunWithoutShadows = sun.clone()
    sunWithoutShadows.castShadow = false
    sunWithoutShadows.intensity *= .1
    group.add(sunWithoutShadows)

    if (debug) {
      group.add(new DirectionalLightHelper(sun))

      const cameraHelper = new CameraHelper(sun.shadow.camera)
      group.add(cameraHelper)
    }

    const sky = new HemisphereLight(
      lerpColors(0xb1e1ff, '#fff', .8).clone(),
      lerpColors(0xb97a20, '#ccc', .8).clone(),
      .5)
    group.add(sky)
  }, [])

  return null
}
