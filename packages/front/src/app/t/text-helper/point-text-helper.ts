import { CanvasTexture, Color, ColorRepresentation, DataTexture, DoubleSide, InstancedMesh, MeshBasicMaterial, PlaneGeometry, RGBAFormat, UnsignedByteType, Vector2 } from 'three'

import { TransformDeclaration } from 'some-utils-three/declaration'
import { ShaderForge } from 'some-utils-three/shader-forge'
import { makeColor, makeMatrix4 } from 'some-utils-three/utils/make'

function getDataStringView(atlas: TextHelperAtlas, dataTextureArray: Uint8Array, dataStride: number, lineCount: number, start = 0, length = 3) {
  const packed = Array.from({ length: dataTextureArray.length / 4 }, (_, i) => {
    const offset = i * 4
    const r = dataTextureArray[offset + 0]
    const g = dataTextureArray[offset + 1]
    const b = dataTextureArray[offset + 2]
    const a = dataTextureArray[offset + 3]
    return [r, g, b, a]
  }).slice(start * dataStride / 4, length * dataStride / 4)

  const withHeader = [] as string[]
  withHeader.push(`\nData texture array (${dataTextureArray.length} bytes):`)
  withHeader.push(`\ndataStride: ${dataStride} (${dataStride / 4} x 4 bytes)`)

  for (let i = 0; i < packed.length; i++) {
    const line = i % (dataStride / 4)
    if (line === 0) {
      withHeader.push(`\npack #${i / (dataStride / 4)}`)
      withHeader.push(`info:`)
    }
    if (line === 1) {
      withHeader.push(`lines (${lineCount}):`)
    }
    if (line === 1 + lineCount) {
      withHeader.push(`chars:`)
    }
    const [r, g, b, a] = packed[i]
    let str = `${i.toString().padEnd(3)} - ${(i * 4).toString().padEnd(4)}:   ${r.toString().padStart(3)}, ${g.toString().padStart(3)}, ${b.toString().padStart(3)}, ${a.toString().padStart(3)}`
    if (line >= 1 + lineCount) {
      str += `     ${atlas.symbols[r]}${atlas.symbols[g]}${atlas.symbols[b]}${atlas.symbols[a]}`
    }
    withHeader.push('  ' + str)
  }

  return withHeader.join('\n')
}

const DATA_TEXTURE_WIDTH = 1024
/**
 * Byte size of the info:
 * - Color (3 bytes)
 * - Lines count (1 byte)
 * 
 * Should be a multiple of 4.
 */
const DATA_INFO_BYTE_SIZE = 4

export class TextHelperAtlas {
  texture: CanvasTexture
  symbols: string

  constructor() {
    const unknown = '�'
    const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const diacritics = 'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ'
    const numbers = '0123456789'
    const punctuation = ' .,!?¿:;-+*/=%&|()[]{}<>$\'’"'
    const symbols = [...new Set([unknown, ...alphabet, ...diacritics, ...numbers, ...punctuation])].join('')
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
      ctx.fillText(symbols[i], i * fullCharSize.x, fullCharSize.y * (1 - charRatio))
    }
    this.symbols = symbols
    this.texture = new CanvasTexture(canvas)
  }
}

enum Orientation {
  Normal,
  Billboard,
}

const defaultOptions = {
  textCount: 1000,
  lineLength: 24,
  lineCount: 2,
  charSize: new Vector2(.2, .3),
  textSize: 1,
  orientation: Orientation.Billboard,
}

type SetTextOption = TransformDeclaration & Partial<{
  color: ColorRepresentation
}>

export class TextHelper extends InstancedMesh {
  static readonly defaultOptions = defaultOptions
  static readonly Orientation = Orientation

  readonly options: typeof defaultOptions
  readonly derived: {
    planeSize: Vector2
    dataHeaderByteSize: number
    dataStride: number
  }
  readonly atlas: TextHelperAtlas
  readonly internal: {
    dataTextureArray: Uint8Array
    dataTexture: DataTexture
  }

  constructor(userOptions?: Partial<typeof defaultOptions>) {
    const atlas = new TextHelperAtlas()
    const options = { ...defaultOptions, ...userOptions }
    const planeSize = new Vector2(
      options.textSize * options.lineLength * options.charSize.x,
      options.textSize * options.lineCount * options.charSize.y)
    const geometry = new PlaneGeometry(planeSize.width, planeSize.height)

    const dataHeaderByteSize = DATA_INFO_BYTE_SIZE + options.lineCount * 4
    const dataStride = dataHeaderByteSize + Math.ceil((options.lineCount * options.lineLength) / 4) * 4
    const dataRequiredByteSize = options.textCount * dataStride
    const dataTextureHeight = Math.ceil(dataRequiredByteSize / DATA_TEXTURE_WIDTH)
    const dataTextureArray = new Uint8Array(DATA_TEXTURE_WIDTH * dataTextureHeight * 4)
    const dataTexture = new DataTexture(dataTextureArray, DATA_TEXTURE_WIDTH, dataTextureHeight, RGBAFormat, UnsignedByteType)
    dataTexture.needsUpdate = true

    const colors = [new Color('#ffffcc'), new Color('#ff7ef6'), new Color('blue'), new Color('yellow')]
    for (let i = 0, max = options.textCount; i < max; i++) {
      const offset = i * dataStride
      const { r, g, b } = colors[i % colors.length]
      dataTextureArray[offset + 0] = r * 255
      dataTextureArray[offset + 1] = g * 255
      dataTextureArray[offset + 2] = b * 255
      for (let j = 0; j < options.lineCount; j++) {
        dataTextureArray[offset + DATA_INFO_BYTE_SIZE + j * 4] = options.lineLength // lines length
      }
    }

    const material = new MeshBasicMaterial({
      map: atlas.texture,
      transparent: true,
      alphaTest: .5,
      side: DoubleSide,
    })
    material.onBeforeCompile = shader => ShaderForge.with(shader)
      .defines({
        BILLBOARD: options.orientation === Orientation.Billboard ? 1 : 0,
      })
      .uniforms({
        uOrientation: { value: options.orientation },
        uPlaneSize: { value: planeSize },
        uCharSize: { value: options.charSize },
        uLineLength: { value: options.lineLength },
        uLineCount: { value: options.lineCount },
        uAtlasLength: { value: atlas.symbols.length },
        uDataTextureSize: { value: new Vector2(DATA_TEXTURE_WIDTH, dataTextureHeight) },
        uDataHeaderByteSize: { value: dataHeaderByteSize },
        uDataRequiredByteSize: { value: dataRequiredByteSize },
        uDataTexture: { value: dataTexture },
        uBoxBorderWidth: { value: 0 }, // debug border
      })
      .varying({
        'vInstanceId': 'float',
        'vColor': 'vec3',
        'vCurrentLineCount': 'float',
      })
      .top(/* glsl */`
        vec4 getData4(int instanceId, int offset) {
          int index = instanceId * ${dataStride} / 4 + offset;
          int dataY = index / ${DATA_TEXTURE_WIDTH};
          int dataX = index - dataY * ${DATA_TEXTURE_WIDTH};
          return texelFetch(uDataTexture, ivec2(dataX, dataY), 0);
        }
        vec4 getData4(float instanceId, int offset) {
          return getData4(int(instanceId), offset);
        }
          
        vec2 getCharOffset(float instanceId, float charIndex) {
          int p = int(uDataHeaderByteSize + charIndex);
          int q = p / 4;
          int r = p - q * 4; // p % 4;
          vec4 charIndexes = getData4(instanceId, q);
          float x = charIndexes[r];
          x *= 255.0;
          x /= uAtlasLength;
          return vec2(x, 0.0);
        }
        vec2 getCharOffset(float instanceId, float line, float char) {
          // return vec2(line * 82.0 + char, 0.0) / uAtlasLength;
          return getCharOffset(instanceId, line * uLineLength + char);
        }
      `)
      .vertex.replace('project_vertex', /* glsl */`
        vec4 dataTexel = getData4(gl_InstanceID, 0);
        vColor = dataTexel.rgb;
        vCurrentLineCount = dataTexel.a * 255.0;

        vec4 mvPosition = vec4(transformed, 1.0);

        mat4 localMatrix = instanceMatrix;

        if (uOrientation == 1.0) {
          mat3 v = mat3(viewMatrix);
          v = inverse(v);
          localMatrix = mat4(v);
          localMatrix[3] = vec4(instanceMatrix[3].xyz, 1.0);
        }

        mvPosition = viewMatrix * modelMatrix * localMatrix * mvPosition;
        gl_Position = projectionMatrix * mvPosition;

        vInstanceId = float(gl_InstanceID);
      `)
      .fragment.top(/* glsl */`
        float sdBox(in vec2 p, in vec2 b) {
          vec2 d = abs(p) - b;
          return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
        }

        vec4 getCharColor() {
          vec2 uv = vMapUv * vec2(uLineLength, uLineCount);

          uv.y += (uLineCount - vCurrentLineCount) * 0.5;
          float lineIndex = floor((uLineCount - uv.y));

          if (lineIndex < 0.0 || lineIndex >= vCurrentLineCount)
            discard;

          float currentLineLength = getData4(vInstanceId, 1 + int(lineIndex)).r * 255.0;
          // vec2 ddx = dFdx(uv);
          // vec2 ddy = dFdy(uv);
          uv.x += (uLineLength - currentLineLength) * -0.5;
          float charIndex = floor(uv.x);

          if (charIndex < 0.0 || charIndex >= currentLineLength)
            discard;

          uv = fract(uv);
          // diffuseColor = vec4(uv, 1.0, 1.0);
          uv.x /= uAtlasLength;

          uv += getCharOffset(vInstanceId, lineIndex, charIndex);
          // float lod = log2(max(length(dFdx(vMapUv)), length(dFdy(vMapUv))));
          vec4 sampledDiffuseColor = textureLod(map, uv, 0.0);
          // Use textureGrad for better quality, when the square texture will be used
          // vec4 sampledDiffuseColor = textureGrad(map, uv, ddx, ddy);
          
          vec3 color = vColor;
          float alpha = sampledDiffuseColor.r;
          return vec4(color, alpha);
        }

        vec4 getCharColorWithBorder() {
          if (uBoxBorderWidth > 0.0) {
            vec2 p = (vMapUv - 0.5) * uPlaneSize;
            float d = sdBox(p, uPlaneSize * 0.5) + uBoxBorderWidth;
            if (d > 0.0) {
              return vec4(vColor, 1.0);
            }
          }
          return getCharColor();
        }
      `)
      .fragment.replace('map_fragment', /* glsl */`
        diffuseColor = getCharColorWithBorder();
      `)
    super(geometry, material, options.textCount)

    this.options = options
    this.atlas = atlas
    this.derived = {
      planeSize,
      dataHeaderByteSize,
      dataStride,
    }
    this.internal = {
      dataTextureArray,
      dataTexture,
    }
  }

  setTextAt(index: number, text: string, options: SetTextOption = {}) {
    const { lineCount, lineLength } = this.options

    let lines = text.trim().split('\n')

    if (lines.length > lineCount) {
      console.warn(`TextHelper: Text has more lines than ${lineCount}, truncating.`)
      lines = lines.slice(0, lineCount)
    }

    lines = lines.map(line => {
      line = line.trim()

      // Check if line is too long
      if (line.length > lineLength) {
        console.warn(`TextHelper: Line length is greater than ${lineLength} characters, clamping.`)
        return line.slice(0, lineLength)
      }

      return line
    })

    const { atlas } = this
    const { dataTextureArray, dataTexture } = this.internal
    const { dataStride, dataHeaderByteSize } = this.derived
    const offset = index * dataStride
    dataTexture.needsUpdate = true

    const { r, g, b } = makeColor(options.color ?? '#ffffff')
    dataTextureArray[offset + 0] = r * 255
    dataTextureArray[offset + 1] = g * 255
    dataTextureArray[offset + 2] = b * 255
    dataTextureArray[offset + 3] = lines.length

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
          const charIndex = atlas.symbols.indexOf(lines[i].charAt(j))
          // let charIndex = 1 + j * (1 + i)
          dataTextureArray[k] = charIndex === -1 ? 0 : charIndex
        }
      }
    }

    this.setMatrixAt(index, makeMatrix4(options))
  }

  getDataStringView(start = 0, length = 3) {
    return getDataStringView(this.atlas, this.internal.dataTextureArray, this.derived.dataStride, this.options.lineCount, start, length)
  }
}
