import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { PerspectiveCamera, Scene, WebGPURenderer } from 'three/tsl'

import { handleAnyUserInteraction } from 'some-utils-dom/handle/any-user-interaction'
import { Ticker } from 'some-utils-ts/ticker'

export type Three = ReturnType<typeof createThree>

export function createThree({
  width = window.innerWidth,
  height = window.innerHeight,
  pixelRatio = window.devicePixelRatio,
}) {
  const ticker = Ticker.get('ThreeTicker')
  const renderer = new WebGPURenderer({
    antialias: true,
    trackTimestamp: true,
  })
  renderer.setPixelRatio(pixelRatio)
  renderer.setSize(width, height)

  const camera = new PerspectiveCamera(50, width / height, 0.1, 100)
  camera.position.z = 5

  const orbitControls = new OrbitControls(camera, renderer.domElement)

  const scene = new Scene()

  async function render() {
    renderer.renderAsync(scene, camera)
  }

  function* init(element: HTMLDivElement) {
    yield ticker.onTick(tick => {
      render()
    })

    yield handleAnyUserInteraction(
      ticker.requestActivation)

    element.appendChild(renderer.domElement)

    yield () => {
      orbitControls.dispose()
      // renderer.dispose()
      renderer.domElement.remove()
    }
  }

  const three = {
    renderer,
    camera,
    scene,
    ticker,
    init,
  }

  return three
}
