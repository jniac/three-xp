// troika-three-text.d.ts

declare module 'troika-three-text' {
  import {
    ColorRepresentation,
    Material,
    Mesh
  } from 'three'

  export type AnchorX =
    | number
    | `${number}%`
    | 'left'
    | 'center'
    | 'right'

  export type AnchorY =
    | number
    | `${number}%`
    | 'top'
    | 'top-baseline'
    | 'middle'
    | 'bottom-baseline'
    | 'bottom'

  export class Text extends Mesh {
    constructor()

    // Content
    text: string
    font?: string

    // Layout
    fontSize: number
    maxWidth: number
    lineHeight: number | 'normal'
    letterSpacing: number
    whiteSpace: 'normal' | 'nowrap'
    overflowWrap: 'normal' | 'break-word'
    textAlign: 'left' | 'center' | 'right' | 'justify'
    anchorX: AnchorX
    anchorY: AnchorY

    // Rendering
    color: ColorRepresentation
    outlineWidth: number | string
    outlineColor: ColorRepresentation
    outlineOpacity: number

    strokeWidth: number | string
    strokeColor: ColorRepresentation
    strokeOpacity: number

    fillOpacity: number

    curveRadius: number

    clipRect: [number, number, number, number] | null

    depthOffset: number

    sdfGlyphSize: number
    gpuAccelerateSDF: boolean

    material: Material

    sync(callback?: () => void): void
    dispose(): void
  }

  export function preloadFont(
    font: string | null,
    characters?: string,
    callback?: () => void
  ): void
}