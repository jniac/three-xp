export function floatBufferToBase64(input: number[] | Float32Array) {
  const len = input.length
  const buffer = new ArrayBuffer(len * 4)
  const view = new DataView(buffer)
  for (let i = 0; i < len; i++) {
    view.setFloat32(i * 4, input[i], true)
  }
  const uint8Array = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < uint8Array.length; i++) {
    binary += String.fromCharCode(uint8Array[i])
  }
  return window.btoa(binary)
}

export function base64ToFloatBuffer(base64: string): Float32Array {
  const binary = window.atob(base64)
  const len = binary.length
  const buffer = new ArrayBuffer(len)
  const uint8Array = new Uint8Array(buffer)
  for (let i = 0; i < len; i++) {
    uint8Array[i] = binary.charCodeAt(i)
  }
  const floatArray = new Float32Array(buffer)
  return floatArray
}
