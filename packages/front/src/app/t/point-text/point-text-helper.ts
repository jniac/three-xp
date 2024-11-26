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
    const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const symbols = `�${alphabet}0123456789 .,!?:;-+*/=%&|()[]{}<>`
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
  orientation: Orientation.Normal,
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
    dataTexture.colorSpace = 'srgb-linear'

    console.log({ dataStride, dataRequiredByteSize })

    const colors = [new Color('#ffffcc'), new Color('#ff7ef6'), new Color('blue'), new Color('yellow')]
    for (let i = 0, max = options.textCount; i < max; i++) {
      const offset = i * dataStride
      const { r, g, b } = colors[i % colors.length]
      dataTextureArray[offset + 0] = r * 255
      dataTextureArray[offset + 1] = g * 255
      dataTextureArray[offset + 2] = b * 255
      for (let j = 0; j < options.lineCount; j++) {
        // dataTextureArray[offset + DATA_INFO_BYTE_SIZE + j * 4] = options.lineLength // lines length
        // Fake data:
        dataTextureArray[offset + DATA_INFO_BYTE_SIZE + j * 4] = 255 // lines length
        // dataTextureArray[offset + DATA_INFO_BYTE_SIZE + j * 4] = options.lineLength * (i % 2 ? .5 : 1) - j// lines length

        for (let k = 0; k < options.lineLength; k++) {
          // dataTextureArray[offset + DATA_INFO_BYTE_SIZE + options.lineCount + j * 4 * options.lineLength + k] = k
        }
      }
    }

    const material = new MeshBasicMaterial({
      map: atlas.texture,
      transparent: true,
      // alphaTest: .5,
      side: DoubleSide,
    })
    material.onBeforeCompile = shader => ShaderForge.with(shader)
      .defines({
        BILLBOARD: options.orientation === Orientation.Billboard ? 1 : 0,
      })
      .uniforms({
        uLineLength: { value: options.lineLength },
        uLineCount: { value: options.lineCount },
        uAtlasLength: { value: atlas.symbols.length },
        uDataTextureSize: { value: new Vector2(DATA_TEXTURE_WIDTH, dataTextureHeight) },
        uDataHeaderByteSize: { value: dataHeaderByteSize },
        uDataRequiredByteSize: { value: dataRequiredByteSize },
        uDataTexture: { value: dataTexture },
      })
      .varying({
        'vInstanceId': 'float',
        'vColor': 'vec3',
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
        vec2 getCharOffset(float instanceId, float line, float char) {
          // return vec2(line * 82.0 + char, 0.0) / uAtlasLength;
          int p = int(uDataHeaderByteSize + line * uLineLength + char);
          int q = p / 4;
          int r = p - q * 4; // p % 4;
          vec4 charIndexes = getData4(instanceId, q);
          float x = charIndexes[r];
          x *= 255.0;
          x /= uAtlasLength;
          return vec2(x, 0.0);
        }
      `)
      .vertex.replace('project_vertex', /* glsl */`
        vec4 dataTexel = getData4(gl_InstanceID, 0);
        vColor = dataTexel.rgb;
        // vColor = vec3(255.0, 53.0, 235.0) / 255.0;

        vec4 mvPosition = vec4(transformed, 1.0);

#if defined(BILLBOARD) && BILLBOARD == 1
        // localMatrix: camera rotation + instance translation
        mat3 v = mat3(viewMatrix);
        v = inverse(v);
        mat4 localMatrix = mat4(v);
        localMatrix[3] = vec4(instanceMatrix[3].xyz, 1.0);
#else
        mat4 localMatrix = instanceMatrix;
#endif

        mvPosition = viewMatrix * modelMatrix * localMatrix * mvPosition;
        gl_Position = projectionMatrix * mvPosition;

        vInstanceId = float(gl_InstanceID);
      `)
      .fragment.replace('map_fragment', /* glsl */`
        vec2 uv = vMapUv;
        // vec2 ddx = dFdx(uv);
        // vec2 ddy = dFdy(uv);
        uv *= vec2(uLineLength, uLineCount);
        uv = fract(uv);
        // diffuseColor = vec4(uv, 1.0, 1.0);
        uv.x *= 1.0 / uAtlasLength;
        float charIndex = floor(uLineLength * vMapUv.x);
        float lineIndex = floor(uLineCount * (1.0 - vMapUv.y));

        float currentLineLength = getData4(vInstanceId, 1 + int(lineIndex)).r * 255.0;
        if (charIndex >= currentLineLength)
          discard;

        uv += getCharOffset(vInstanceId, lineIndex, charIndex);
        // float lod = log2(max(length(dFdx(vMapUv)), length(dFdy(vMapUv))));
        vec4 sampledDiffuseColor = textureLod(map, uv, 0.0);
        // Use textureGrad for better quality, when the square texture will be used
        // vec4 sampledDiffuseColor = textureGrad(map, uv, ddx, ddy);
        diffuseColor.a *= sampledDiffuseColor.r;
        diffuseColor.rgb *= vColor;
        diffuseColor.a += 0.01;
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

    // Useless (trim() above)
    // while (!lines[0]) {
    //   lines.shift()
    // }

    // while (!lines[lines.length - 1]) {
    //   lines.pop()
    // }

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
    console.log({ dataHeaderByteSize }, lineLength * lineCount)
    for (let i = 0; i < lineCount; i++) {
      dataTextureArray[offset + DATA_INFO_BYTE_SIZE + i * 4] = lines[i].length
      const lineOffset = offset + dataHeaderByteSize + i * lineLength
      const currentLineLength = lines[i].length
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

    console.log(getDataStringView(atlas, dataTextureArray, dataStride, lineCount))
    console.log(this.material.un)
  }
}
