import { AmbientLight, Group, HemisphereLight, RectAreaLight } from 'three'
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js'

export class Lights extends Group {
  constructor({
    debug = false,
  } = {}) {
    super()
    this.name = 'lights'

    const sky = new HemisphereLight('#dbebf0', '#645d61', 1)
    this.add(sky)

    const sun = new RectAreaLight('#e8e6d3', 1.1)
    sun.position.set(3, 3, 3)
    sun.width = 16
    sun.height = 16
    sun.lookAt(0, 0, 0)
    this.add(sun)

    if (debug) {
      this.add(new RectAreaLightHelper(sun))
    }

    const ambient = new AmbientLight('#f2f0dd', .8)
    this.add(ambient)
  }
}