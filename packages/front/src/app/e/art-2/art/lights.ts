import { AmbientLight, Group, HemisphereLight, RectAreaLight } from 'three'
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js'

export class Lights extends Group {
  constructor({
    globalIntensity = 1,
    debug = false,
  } = {}) {
    super()
    this.name = 'lights'

    const sky = new HemisphereLight('#dbebf0', '#645d61', globalIntensity)
    this.add(sky)

    const sun = new RectAreaLight('#e8e6d3', 1.3 * globalIntensity)
    sun.position.set(10, 10, 10)
    sun.width = 40
    sun.height = 40
    sun.lookAt(0, 0, 0)
    this.add(sun)

    if (debug) {
      this.add(new RectAreaLightHelper(sun))
    }

    const ambient = new AmbientLight('#f2f0dd', .8 * globalIntensity)
    this.add(ambient)
  }
}