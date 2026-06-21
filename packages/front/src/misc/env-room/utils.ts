import { WebGLRenderer } from 'three'

export function getRenderTargetFloatSupport(renderer: WebGLRenderer) {
  const gl = renderer.getContext()
  const isWebGL2 = renderer.capabilities.isWebGL2

  const floatTexture = isWebGL2 || !!gl.getExtension('OES_texture_float')

  const halfFloatTexture = isWebGL2 || !!gl.getExtension('OES_texture_half_float')

  const floatRenderable = isWebGL2
    ? !!gl.getExtension('EXT_color_buffer_float')
    : !!gl.getExtension('WEBGL_color_buffer_float')

  const halfFloatRenderable = isWebGL2
    ? !!gl.getExtension('EXT_color_buffer_float')
    : !!gl.getExtension('EXT_color_buffer_half_float')

  return {
    floatTexture,
    halfFloatTexture,
    floatRenderTarget: floatTexture && floatRenderable,
    halfFloatRenderTarget: halfFloatTexture && halfFloatRenderable,
  }
}
