import { ColorRepresentation, DataTexture, DoubleSide, InstancedMesh, MeshBasicMaterial, PlaneGeometry, RGBAFormat, UnsignedByteType, Vector2 } from 'three'

import { TransformDeclaration } from 'some-utils-three/declaration'
import { ShaderForge } from 'some-utils-three/shader-forge'
import { makeColor, makeMatrix4 } from 'some-utils-three/utils/make'
import { toff } from 'some-utils-ts/math/basic'

import { TextHelperAtlas } from './atlas'
import { DATA_INFO_BYTE_SIZE, DATA_TEXTURE_WIDTH, Orientation } from './constants-and-enums'
import { getDataStringView } from './utils'

const defaultOptions = {
  textCount: 1000,
  lineLength: 24,
  lineCount: 2,
  charSize: new Vector2(.2, .3),
  textSize: 1,
  orientation: Orientation.Billboard,
}

type SetTextOption = TransformDeclaration & Partial<{
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

let nextId = 0
export class TextHelper extends InstancedMesh {
  static readonly defaultOptions = defaultOptions
  static readonly Orientation = Orientation

  readonly textHelperId = nextId++
  readonly options: typeof defaultOptions
  readonly derived: {
    planeSize: Vector2
    dataTextureSize: Vector2
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
    const dataTextureSize = new Vector2(DATA_TEXTURE_WIDTH, dataTextureHeight)
    const dataTexture = new DataTexture(dataTextureArray, dataTextureSize.width, dataTextureSize.height, RGBAFormat, UnsignedByteType)
    dataTexture.needsUpdate = true

    const material = new MeshBasicMaterial({
      map: atlas.texture,
      transparent: true,
      alphaTest: .5,
      side: DoubleSide,
      depthTest: false,
      depthWrite: false,
    })
    material.onBeforeCompile = shader => ShaderForge.with(shader)
      .shaderName(`TextHelper-${Math.random()}`)
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
        'vTextColor': 'vec4',
        'vBackgroundColor': 'vec4',
        'vCurrentLineCount': 'float',
      })
      .top(/* glsl */`
        vec4 getData4(int instanceId, int offset) {
          int index = instanceId * ${dataStride / 4} + offset;
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
        vec4 infoTexel = getData4(gl_InstanceID, 0);
        vCurrentLineCount = infoTexel.r * 255.0;

        vTextColor = getData4(gl_InstanceID, 1);
        vBackgroundColor = getData4(gl_InstanceID, 2);

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

          float currentLineLength = getData4(vInstanceId, 3 + int(lineIndex)).r * 255.0;
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
          vec4 charColor = textureLod(map, uv, 0.0);
          // Use textureGrad for better quality, when the square texture will be used
          // vec4 sampledDiffuseColor = textureGrad(map, uv, ddx, ddy);
          float char = charColor.r;
          
          return vec4(
            mix(vBackgroundColor.rgb, vTextColor.rgb, charColor.r),
            mix(vBackgroundColor.a, vTextColor.a, charColor.r));
        }

        vec4 getCharColorWithBorder() {
          if (uBoxBorderWidth > 0.0) {
            vec2 p = (vMapUv - 0.5) * uPlaneSize;
            float d = sdBox(p, uPlaneSize * 0.5) + uBoxBorderWidth;
            if (d > 0.0) {
              return vTextColor;
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
      dataTextureSize,
      dataHeaderByteSize,
      dataStride,
    }
    this.internal = {
      dataTextureArray,
      dataTexture,
    }

    console.log(`TextHelper ${this.textHelperId} created.`)
  }

  setTextAt(index: number, text: string, options: SetTextOption = {}) {
    console.log(`TextHelper ${this.textHelperId} setTextAt ${index}:`, text)
    const {
      trim = false,
      color = '#ffffff',
      textColor = color,
      textOpacity = 1,
      backgroundColor = textColor,
      backgroundOpacity = 0,
      ...transform
    } = options

    const { lineCount, lineLength } = this.options

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

    const { atlas } = this
    const { dataTextureArray, dataTexture } = this.internal
    const { dataStride, dataHeaderByteSize } = this.derived
    dataTexture.needsUpdate = true
    // this.material.needsUpdate = true

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
          const charIndex = atlas.symbols.indexOf(lines[i].charAt(j))
          // let charIndex = 1 + j * (1 + i)
          dataTextureArray[k] = charIndex === -1 ? 0 : charIndex
        }
      }
    }

    this.setMatrixAt(index, makeMatrix4(transform))
  }

  getDataStringView(start = 0, length = 3) {
    return getDataStringView(
      this.atlas,
      this.internal.dataTextureArray,
      this.derived.dataStride,
      this.options.lineCount,
      this.options.lineLength,
      start,
      length,
    )
  }
}
