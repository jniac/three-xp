import { ColorRepresentation, Vector2 } from 'three'

import { makeColor } from 'some-utils-three/utils/make'
import { ceilPowerOfTwo, toff } from 'some-utils-ts/math/basic'

import { DATA_INFO_BYTE_SIZE } from './constants-and-enums'

export type SetTextOption = Partial<{
  /**
   * Whether to trim the text before setting it.
   */
  trim: boolean
  /**
   * Sugar for `textColor`
   */
  color: ColorRepresentation
  /**
   * The color of the text.
   */
  textColor: ColorRepresentation
  /**
   * The opacity of the text.
   * @default 1
   */
  textOpacity: number
  backgroundColor: ColorRepresentation
  backgroundOpacity: number
}>

export class TextData {
  readonly textCount: number
  readonly lineCount: number
  readonly lineLength: number

  readonly headerByteSize: number
  readonly strideByteSize: number
  readonly textureSize: Vector2
  readonly array: Uint8Array

  constructor(textCount: number, lineCount: number, lineLength: number) {
    const header = DATA_INFO_BYTE_SIZE + lineCount * 4
    const stride = header + Math.ceil((lineCount * lineLength) / 4) * 4
    const bytes = header + textCount * stride
    const pixels = Math.ceil(bytes / 4)
    const width = Math.sqrt(ceilPowerOfTwo(pixels))
    const height = Math.ceil(pixels / width)

    this.textCount = textCount
    this.lineCount = lineCount
    this.lineLength = lineLength

    this.headerByteSize = header
    this.strideByteSize = stride
    this.textureSize = new Vector2(width, height)
    this.array = new Uint8Array(width * height * 4)
  }

  setTextAt(index: number, text: string, symbols: string, options: SetTextOption = {}) {
    const {
      trim = false, color = '#ffffff', textColor = color, textOpacity = 1, backgroundColor = textColor, backgroundOpacity = 0,
    } = options

    const { lineCount, lineLength, array: dataTextureArray, strideByteSize: dataStride, headerByteSize: dataHeaderByteSize } = this

    let lines = (trim ? text.trim() : text).split('\n')

    if (lines.length > lineCount) {
      console.warn(`TextHelper: Text has more lines than ${lineCount}, truncating.`)
      lines = lines.slice(0, lineCount)
    }

    lines = lines.map(line => {
      if (trim)
        line = line.trim()

      // Check if line is too long
      if (line.length > lineLength) {
        console.warn(`TextHelper: Line length is greater than ${lineLength} characters, clamping.`)
        return line.slice(0, lineLength)
      }

      return line
    })

    {
      const offset = index * dataStride
      dataTextureArray[offset + 0] = lines.length
    }

    {
      const { r, g, b } = makeColor(textColor)
      const offset = index * dataStride + 4 * 1
      dataTextureArray[offset + 0] = r * 255
      dataTextureArray[offset + 1] = g * 255
      dataTextureArray[offset + 2] = b * 255
      dataTextureArray[offset + 3] = toff(textOpacity)
    }

    {
      const { r, g, b } = makeColor(backgroundColor)
      const offset = index * dataStride + 4 * 2
      dataTextureArray[offset + 0] = r * 255
      dataTextureArray[offset + 1] = g * 255
      dataTextureArray[offset + 2] = b * 255
      dataTextureArray[offset + 3] = toff(backgroundOpacity)
    }

    const offset = index * dataStride
    const currentLineCount = lines.length
    for (let i = 0; i < lineCount; i++) {
      let currentLineLength = 0
      if (i < currentLineCount) {
        dataTextureArray[offset + DATA_INFO_BYTE_SIZE + i * 4] = lines[i].length
        currentLineLength = lines[i].length
      }
      const lineOffset = offset + dataHeaderByteSize + i * lineLength
      for (let j = 0; j < lineLength; j++) {
        const k = lineOffset + j
        if (i >= currentLineCount || j >= currentLineLength) {
          dataTextureArray[k] = 0
        } else {
          const charIndex = symbols.indexOf(lines[i].charAt(j))
          // let charIndex = 1 + j * (1 + i)
          dataTextureArray[k] = charIndex === -1 ? 0 : charIndex
        }
      }
    }
  }
}
