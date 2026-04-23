import { readFile } from 'fs/promises'
import yaml from 'js-yaml'

export async function tryReadYaml(path: string) {
  try {
    const str = await readFile(path)
    const data = yaml.load(str.toString())
    if (data && typeof data === 'object') {
      return data
    }
    return null
  } catch (e) {
    return null
  }
}
