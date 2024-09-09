import { ShaderChunk } from 'three'

export function resolveShaderIncludes(shaderCode: string) {
  return shaderCode.replace(/#include <(.*)>/g, (match, p1) => {
    const chunk = ShaderChunk[p1 as keyof typeof ShaderChunk]
    if (!chunk) {
      throw new Error(`Shader chunk "${p1}" not found`)
    }
    return chunk
  })
}
