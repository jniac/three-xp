import JoltModule from 'jolt-physics/wasm-compat'

export let Jolt: typeof JoltModule

export async function loadJolt() {
  if (!Jolt) {
    Jolt = await JoltModule()
  }
  return Jolt
}
