import { ShaderForge } from 'some-utils-three/shader-forge'
import { CanvasTexture, InstancedMesh, MeshBasicMaterial, PlaneGeometry, Vector2 } from 'three'

const defaultOptions = {
  textCount: 1000,
  lineLength: 24,
  lineCount: 2,
  charSize: new Vector2(.2, .3),
}

export class TextHelperAtlas {
  texture: CanvasTexture
  symbols: string
  constructor() {
    const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const symbols = alphabet + '.,!?:;-+*/=%&|()[]{}<>'
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

export class TextHelper extends InstancedMesh {
  static readonly defaultOptions = defaultOptions
  readonly options: typeof defaultOptions
  constructor(userOptions?: Partial<typeof defaultOptions>) {
    const atlas = new TextHelperAtlas()
    const options = { ...defaultOptions, ...userOptions }
    const width = options.lineLength * options.charSize.x
    const height = options.lineCount * options.charSize.y
    const geometry = new PlaneGeometry(width, height)
    const material = new MeshBasicMaterial({
      map: atlas.texture,
      transparent: true,
    })
    material.onBeforeCompile = shader => ShaderForge.with(shader)
      .defines({
        // BILLBOARD: ''
      })
      .uniforms({
        uLineLength: { value: options.lineLength },
        uLineCount: { value: options.lineCount },
        uAtlasLength: { value: atlas.symbols.length },
      })
      .vertex.replace('project_vertex', /* glsl */`
        vec4 mvPosition = vec4(transformed, 1.0);
        mvPosition = instanceMatrix * mvPosition;

#if defined(BILLBOARD)
        mat3 v = mat3(viewMatrix);
        v = inverse(v);
        mat4 m = mat4(v);
        m[3] = vec4(viewMatrix[3].xyz, 1.0);
#else
        mat4 m = modelMatrix;
#endif

        mvPosition = viewMatrix * m * mvPosition;
        gl_Position = projectionMatrix * mvPosition;  
      `)
      .fragment.replace('map_fragment', /* glsl */`
        vec2 uv = vMapUv;
        uv *= vec2(uLineLength, uLineCount);
        uv = fract(uv);
        // diffuseColor = vec4(uv, 1.0, 1.0);
        uv.x *= 1.0 / uAtlasLength;
        // float char = 1.0;
        float char = floor(uLineLength * vMapUv.x);
        uv.x += char / uAtlasLength;
        vec4 sampledDiffuseColor = textureLod(map, uv, 0.0);
        diffuseColor *= sampledDiffuseColor.r;
      `)
    super(geometry, material, options.textCount)
    this.options = options
  }
}
