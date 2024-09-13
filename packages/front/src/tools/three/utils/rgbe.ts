import { EquirectangularReflectionMapping, Texture } from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

const rgbeLoader = new RGBELoader()
export function loadRgbe(url: string) {
  return new Promise<Texture>(resolve => {
    rgbeLoader.load(url, texture => {
      // Assuming the texture is an equirectangular HDR image:
      texture.mapping = EquirectangularReflectionMapping
      resolve(texture)
    })
  })
}
