import { CanvasTexture, Vector2 } from 'three'

function getDefaultSymbols() {
  const unknown = '�'
  const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const diacritics = 'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ'
  const numbers = '0123456789'
  const punctuation = ' .,!?¿:;-+*/=%&|()[]{}<>$\'’"'
  return [...new Set([unknown, ...alphabet, ...diacritics, ...numbers, ...punctuation])].join('')
}

export class TextHelperAtlas {
  texture: CanvasTexture
  symbols: string

  constructor() {
    const symbols = getDefaultSymbols()
    const charSize = new Vector2(16, 24)
    const pixelRatio = 3
    const fullCharSize = charSize.clone().multiplyScalar(pixelRatio)
    const canvas = document.createElement('canvas')
    const width = fullCharSize.x * symbols.length
    const height = fullCharSize.y
    const charRatio = .8
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')!
    ctx.font = `${fullCharSize.y * charRatio}px monospace`
    ctx.textBaseline = 'top'
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, width, height)
    ctx.fillStyle = 'white'
    for (let i = 0; i < symbols.length; i++) {
      const x = (i + .12) * fullCharSize.x
      const y = fullCharSize.y * (1 - charRatio)
      ctx.fillText(symbols[i], x, y)
    }
    this.symbols = symbols
    this.texture = new CanvasTexture(canvas)
  }
}
