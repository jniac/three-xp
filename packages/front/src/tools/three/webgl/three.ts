import { PerspectiveCamera, Scene, Vector2, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

import { handleAnyUserInteraction } from 'some-utils-dom/handle/anyUserInteraction'
import { handleSize } from 'some-utils-dom/handle/size'
import { Ticker } from 'some-utils-ts/ticker'

export type Three = ReturnType<typeof createThree>

export function createThree({
  width = window.innerWidth,
  height = window.innerHeight,
  pixelRatio = window.devicePixelRatio,
}) {
  const ticker = Ticker.get('ThreeTicker')
  const size = new Vector2(width, height)
  const fullSize = new Vector2(width, height).multiplyScalar(pixelRatio)
  const renderer = new WebGLRenderer({
    antialias: true,
    alpha: true,
  })
  renderer.setPixelRatio(pixelRatio)
  renderer.setSize(width, height)

  const camera = new PerspectiveCamera(50, width / height, 0.1, 100)
  camera.position.z = 5

  const orbitControls = new OrbitControls(camera, renderer.domElement)
  orbitControls.enableDamping = true

  const scene = new Scene()

  async function render() {
    renderer.render(scene, camera)
  }

  function resize(newWidth: number, newHeight: number, newPixelRatio: number = devicePixelRatio) {
    width = newWidth
    height = newHeight
    pixelRatio = newPixelRatio
    size.set(width, height)
    fullSize.set(width, height).multiplyScalar(pixelRatio)
    renderer.setSize(width, height)
    renderer.setPixelRatio(pixelRatio)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
  }

  function* init(element: HTMLDivElement) {
    yield ticker.onTick(tick => {
      orbitControls.update()
      render()
    })

    yield handleSize(element, {
      onSize: ({ size: { x, y } }) => {
        resize(x, y)
      },
    })

    yield handleAnyUserInteraction(
      ticker.requestActivation)

    element.appendChild(renderer.domElement)

    yield () => {
      orbitControls.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }

  const three = {
    renderer,
    size,
    fullSize,
    get pixelRatio() { return pixelRatio },
    get aspect() { return width / height },
    camera,
    orbitControls,
    scene,
    ticker,
    init,
  }

  return three
}
