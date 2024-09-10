import { AmbientLight, Group, HemisphereLight, RectAreaLight } from 'three'
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js'

export function createLights({
  debug = false,
} = {}) {
  const group = new Group()
  group.name = 'lights'

  const sky = new HemisphereLight('#dbebf0', '#645d61', 1)
  group.add(sky)

  const sun = new RectAreaLight('#e8e6d3', 1.1)
  sun.position.set(3, 3, 3)
  sun.width = 16
  sun.height = 16
  sun.lookAt(0, 0, 0)
  group.add(sun)

  if (debug) {
    group.add(new RectAreaLightHelper(sun))
  }

  const ambient = new AmbientLight('#f2f0dd', .8)
  group.add(ambient)

  return group
}