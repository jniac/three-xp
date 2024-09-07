import { BoxGeometry, DirectionalLight, EquirectangularReflectionMapping, HemisphereLight, Mesh, MeshPhysicalMaterial, PlaneGeometry, Scene, TorusKnotGeometry } from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

import { Ticker } from '@/some-utilz/ticker'

export function createScene(ticker: Ticker) {
  const scene = new Scene()

  const useLights = true
  if (useLights) {
    const sun = new DirectionalLight(0xffffff, 1)
    sun.position.set(0, 3, 1)
    scene.add(sun)

    const sky = new HemisphereLight('#afdbf5', '#845244', 1)
    scene.add(sky)
  }

  new RGBELoader()
    .setPath('https://threejs.org/examples/textures/equirectangular/')
    .loadAsync('pedestrian_overpass_1k.hdr')
    .then(texture => {
      texture.mapping = EquirectangularReflectionMapping
      scene.environmentIntensity = .1
      scene.environment = texture
      scene.backgroundBlurriness = 0.5
      scene.background = texture
    })

  const knot = new Mesh(
    new TorusKnotGeometry(2, 1, 512, 64),
    new MeshPhysicalMaterial())
  scene.add(knot)

  const box1 = new Mesh(
    new BoxGeometry(10, 1, 3),
    new MeshPhysicalMaterial())
  scene.add(box1)

  const box2 = new Mesh(
    new BoxGeometry(1, 10, 3),
    new MeshPhysicalMaterial())
  box2.position.set(5, 0, 0)
  scene.add(box2)

  const glass = new Mesh(
    new PlaneGeometry(10, 10),
    new MeshPhysicalMaterial({
      color: '#d1ddff',
      transmission: 1,
      roughness: 0,
      dispersion: .1,
      ior: 2.5,
    }))
  glass.layers.set(1)
  scene.add(glass)

  ticker.onTick(tick => {
    knot.rotation.x += .5 * tick.deltaTime
    knot.rotation.y += .5 * tick.deltaTime
  })

  return scene
}
