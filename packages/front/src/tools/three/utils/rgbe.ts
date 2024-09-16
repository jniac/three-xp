import { Texture } from 'three'
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

const rgbeLoader = new RGBELoader()
export function loadRgbe(url: string) {
  return new Promise<Texture>(resolve => {
    rgbeLoader.load(url, texture => {
      resolve(texture)
    })
  })
}

const exrLoader = new EXRLoader()
export function loadExr(url: string) {
  return new Promise<Texture>(resolve => {
    exrLoader.load(url, texture => {
      resolve(texture)
    })
  })
}

export function loadTexture(url: string) {
  const ext = url.split('.').pop()
  switch (ext) {
    case 'hdr':
      return loadRgbe(url)
    case 'exr':
      return loadExr(url)
    default:
      return Promise.reject(`Unsupported texture format: ${ext}`)
  }
}