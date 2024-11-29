import { config } from '@/config'

export async function fetchHunger() {
  const response = await fetch(config.assets('misc/knut-hamsun-hunger.txt'))
  const hunger = await response.text()

  const index = hunger.indexOf('Erster Abschnitt')
  const str = hunger.slice(index)

  let wordMax = ''
  const words = str
    .split(/\s+/)
    .map(word => {
      // @ts-ignore
      word = word.replace(/[^\p{L}]+/gu, '')
      if (word.length > wordMax.length)
        wordMax = word
      return word
    })
    .filter(word => word.length > 0)

  return {
    words,
    wordMax,
  }
}
