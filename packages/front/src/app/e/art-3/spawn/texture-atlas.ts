import * as THREE from 'three'

type AtlasSource =
  | HTMLImageElement
  | HTMLCanvasElement
  | ImageBitmap
  | OffscreenCanvas

class TextureAtlasResult {
  constructor(
    public texture: THREE.Texture,
    public canvas: HTMLCanvasElement,
    public gridSize: number,
    public atlasSize: number,
    public tileSize: number,
    public paddingSize: number,
    public cellSize: number,
    public count: number,
  ) { }

  getTileUVRect(index: number): { u0: number; v0: number; u1: number; v1: number } {
    if (index < 0 || index >= this.count) {
      throw new Error(`getTileUVRect: index ${index} is out of bounds (count=${this.count}).`)
    }

    const gx = index % this.gridSize
    const gy = Math.floor(index / this.gridSize)

    const x = this.paddingSize + gx * (this.tileSize + this.paddingSize)
    const y = this.paddingSize + gy * (this.tileSize + this.paddingSize)

    const u0 = x / this.atlasSize
    const v0 = y / this.atlasSize
    const u1 = (x + this.tileSize) / this.atlasSize
    const v1 = (y + this.tileSize) / this.atlasSize

    return { u0, v0, u1, v1 }
  }

  setTextureForTile(index: number, texture = this.texture): void {
    const { u0, v0, u1, v1 } = this.getTileUVRect(index)
    texture.repeat.set(u1 - u0, v1 - v0)
    texture.offset.set(u0, v0)
    texture.needsUpdate = true
  }

  cloneTextureForTile(index: number): THREE.Texture {
    const texture = this.texture.clone()
    this.setTextureForTile(index, texture)
    return texture
  }
}

function nextPowerOfTwo(n: number): number {
  if (n <= 1) return 1
  return 2 ** Math.ceil(Math.log2(n))
}

function getSourceSize(source: AtlasSource): { width: number; height: number } {
  if (source instanceof HTMLImageElement) {
    return {
      width: source.naturalWidth || source.width,
      height: source.naturalHeight || source.height,
    }
  }

  return {
    width: source.width,
    height: source.height,
  }
}

/**
 * Dessine une image dans une tile et extrude ses bords dans le padding.
 */
function drawTileWithExtrudedPadding(
  ctx: CanvasRenderingContext2D,
  source: AtlasSource,
  dx: number,
  dy: number,
  tileSize: number,
  padding: number,
): void {
  const dw = tileSize
  const dh = tileSize

  // Centre
  ctx.drawImage(source, dx, dy, dw, dh)

  if (padding <= 0) return

  const { width: sw, height: sh } = getSourceSize(source)

  // Bords
  // top
  ctx.drawImage(source, 0, 0, sw, 1, dx, dy - padding, dw, padding)
  // bottom
  ctx.drawImage(source, 0, sh - 1, sw, 1, dx, dy + dh, dw, padding)
  // left
  ctx.drawImage(source, 0, 0, 1, sh, dx - padding, dy, padding, dh)
  // right
  ctx.drawImage(source, sw - 1, 0, 1, sh, dx + dw, dy, padding, dh)

  // Coins
  // top-left
  ctx.drawImage(source, 0, 0, 1, 1, dx - padding, dy - padding, padding, padding)
  // top-right
  ctx.drawImage(source, sw - 1, 0, 1, 1, dx + dw, dy - padding, padding, padding)
  // bottom-left
  ctx.drawImage(source, 0, sh - 1, 1, 1, dx - padding, dy + dh, padding, padding)
  // bottom-right
  ctx.drawImage(source, sw - 1, sh - 1, 1, 1, dx + dw, dy + dh, padding, padding)
}

/**
 * Génère une texture atlas à partir d'images carrées.
 *
 * - max 256 sources
 * - grille carrée nextPowerOfTwo
 * - padding extrudé adapté au nombre de mipmaps anticipé
 * - erreur si atlas > 8192
 */
function createTextureAtlas(
  sources: readonly AtlasSource[],
  tileSize: number,
): TextureAtlasResult {
  if (sources.length === 0) {
    throw new Error('createTextureAtlas: at least one source is required.')
  }

  if (sources.length > 256) {
    throw new Error(`createTextureAtlas: maximum 256 sources supported, got ${sources.length}.`)
  }

  if (!Number.isInteger(tileSize) || tileSize <= 0) {
    throw new Error(`createTextureAtlas: tileSize must be a positive integer, got ${tileSize}.`)
  }

  const anticipatedMipCount = Math.floor(Math.log2(tileSize)) + 1
  if (!Number.isInteger(anticipatedMipCount) || anticipatedMipCount < 0) {
    throw new Error(
      `createTextureAtlas: anticipatedMipCount must be an integer >= 0, got ${anticipatedMipCount}.`,
    )
  }

  for (let i = 0; i < sources.length; i++) {
    const { width, height } = getSourceSize(sources[i])
    if (width <= 0 || height <= 0) {
      throw new Error(`createTextureAtlas: source ${i} has invalid size ${width}x${height}.`)
    }
    if (width !== height) {
      throw new Error(`createTextureAtlas: source ${i} is not square (${width}x${height}).`)
    }
  }

  const minGridSize = Math.ceil(Math.sqrt(sources.length))
  const gridSize = nextPowerOfTwo(minGridSize)

  // Padding pour préserver les mipmaps :
  // chaque niveau de mip "mange" potentiellement 1 pixel de voisinage.
  // On protège N niveaux avec 2^(N-1) pixels de marge.
  const paddingSize =
    anticipatedMipCount <= 0 ? 0 : 2 ** Math.max(0, anticipatedMipCount - 1)

  const cellSize = tileSize + 2 * paddingSize
  const atlasSize = gridSize * tileSize + paddingSize * (gridSize + 1)

  if (atlasSize > 8192) {
    throw new Error(
      `createTextureAtlas: atlas size ${atlasSize} exceeds 8192. ` +
      `(gridSize=${gridSize}, tileSize=${tileSize}, padding=${paddingSize})`,
    )
  }

  const canvas = document.createElement('canvas')
  canvas.width = atlasSize
  canvas.height = atlasSize

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('createTextureAtlas: could not acquire 2D canvas context.')
  }

  ctx.clearRect(0, 0, atlasSize, atlasSize)
  ctx.imageSmoothingEnabled = true

  for (let i = 0; i < sources.length; i++) {
    const gx = i % gridSize
    const gy = Math.floor(i / gridSize)

    const x = paddingSize + gx * (tileSize + paddingSize)
    const y = paddingSize + gy * (tileSize + paddingSize)

    drawTileWithExtrudedPadding(ctx, sources[i], x, y, tileSize, paddingSize)
  }

  const texture = new THREE.Texture(canvas)
  texture.needsUpdate = true
  texture.generateMipmaps = true
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.wrapS = THREE.ClampToEdgeWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  texture.colorSpace = THREE.SRGBColorSpace

  return new TextureAtlasResult(
    texture,
    canvas,
    gridSize,
    atlasSize,
    tileSize,
    paddingSize,
    cellSize,
    sources.length
  )
}

/**
 * Create a texture atlas from a single source image containing a grid of tiles.
 *
 * The source image must be square and its dimensions must be divisible by the grid size.
 * The resulting atlas will have the same tile size as the source tiles, with extruded padding.
 */
export function createTextureAtlasFromGrid(
  source: AtlasSource,
  gridSize: number,
): TextureAtlasResult {
  if (gridSize <= 0) {
    throw new Error(`createTextureAtlasFromGrid: gridSize must be a positive integer, got ${gridSize}.`)
  }

  const { width, height } = getSourceSize(source)
  if (width <= 0 || height <= 0) {
    throw new Error(`createTextureAtlasFromGrid: source has invalid size ${width}x${height}.`)
  }
  if (width !== height) {
    throw new Error(`createTextureAtlasFromGrid: source is not square (${width}x${height}).`)
  }

  const tileSize = Math.floor(width / gridSize)
  const sources = Array.from({ length: gridSize * gridSize }).map((_, i) => {
    const gx = i % gridSize
    const gy = Math.floor(i / gridSize)

    const canvas = document.createElement('canvas')
    canvas.width = tileSize
    canvas.height = tileSize

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('createTextureAtlasFromGrid: could not acquire 2D canvas context.')
    }

    ctx.drawImage(
      source,
      gx * tileSize,
      gy * tileSize,
      tileSize,
      tileSize,
      0,
      0,
      tileSize,
      tileSize,
    )

    return canvas
  })

  return createTextureAtlas(sources, tileSize)
}

export {
  createTextureAtlas,
  type AtlasSource,
  type TextureAtlasResult
}

