import { DataTexture, LinearFilter, LinearMipMapLinearFilter, Texture } from 'three'

import { Promisified, promisify } from 'some-utils-ts/misc/promisify'

function svgToTexture(svg: any, width = 512, height = 512, backgroundColor = 'transparent'): Promisified<Texture> {
  const blob = new Blob([svg], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)

  const img = new Image()
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  const sourceTexture = new DataTexture(new Uint8Array(4 * 4 * 4), 4, 4)
  sourceTexture.generateMipmaps = true
  sourceTexture.minFilter = LinearMipMapLinearFilter
  sourceTexture.magFilter = LinearFilter
  const texture = promisify(sourceTexture)

  img.onload = () => {
    if (backgroundColor === 'transparent') {
      ctx.clearRect(0, 0, width, height)
    } else {
      ctx.fillStyle = backgroundColor
      ctx.fillRect(0, 0, width, height)
    }
    ctx.transform(1, 0, 0, -1, 0, height) // flip Y
    ctx.drawImage(img, 0, 0, width, height)
    URL.revokeObjectURL(url)
    texture.image = {
      data: ctx.getImageData(0, 0, width, height).data,
      width,
      height,
    }
    texture.needsUpdate = true
    texture.resolve()
  }
  img.onerror = (e) => {
    texture.reject(e)
  }
  img.src = url

  return texture
}

/**
 * Process the svg document to create a texture with only the "fill" parts.
 */
export function getFillTexture(svg: SVGSVGElement, size: number) {
  svg = svg.cloneNode(true) as SVGSVGElement
  for (const element of svg.querySelectorAll('line')) {
    element.remove()
  }
  for (const element of svg.querySelectorAll('#text *')) {
    element.setAttribute('stroke', 'none')
    element.setAttribute('fill', '#f00')
  }
  for (const element of svg.querySelectorAll('#baseline, #toggle')) {
    element.remove()
  }
  return svgToTexture(svg.outerHTML, size, size)
}

/**
 *
 */
export function getStrokeTexture(svg: SVGSVGElement, size: number) {
  svg = svg.cloneNode(true) as SVGSVGElement
  const strokeWidth = .5
  for (const element of svg.querySelectorAll('line, path, rect')) {
    element.setAttribute('stroke', '#fff')
    element.setAttribute('fill', 'none')
    element.setAttribute('stroke-width', strokeWidth.toString())
  }
  for (const element of svg.querySelectorAll('#baseline')) {
    element.setAttribute('stroke-width', (strokeWidth * 1.2).toString())
  }
  return svgToTexture(svg.outerHTML, size, size, 'black')
}
