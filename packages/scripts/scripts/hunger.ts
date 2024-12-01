import fs from 'fs/promises'

import { Uint8ArrayReader, Uint8ArrayWriter, ZipReader, ZipWriter } from '@zip.js/zip.js'
import { TextHelper } from 'some-utils-three/helpers/text-helper'

const symbols = TextHelper.Atlas.getDefaultSymbols()
const data = new TextHelper.Data(symbols, 100_000, 1, 30)

async function loadHunger() {
  const hunger = await fs.readFile('../front/public/assets/misc/knut-hamsun-hunger.txt', 'utf-8')
  const index = hunger.indexOf('Erster Abschnitt')
  const str = hunger.slice(index)

  let wordMax = ''
  const words = str
    .split(/\s+/)
    .map(word => {
      // @ts-ignore
      word = word.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, '')
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

const hunger = await loadHunger()

console.log(`hunger: ${hunger.words.length} words, max: ${hunger.wordMax}`)

for (const [index, word] of hunger.words.entries()) {
  data.setTextAt(index, word)
}

const destination = '../front/public/assets/misc/knut-hamsun-hunger.bin.zip'

async function zip(data: Uint8Array) {
  const writer = new Uint8ArrayWriter()
  const zipWriter = new ZipWriter(writer)
  await zipWriter.add('knut-hamsun-hunger.bin', new Uint8ArrayReader(data))
  return await zipWriter.close()
}

async function unzip(zippedData: Uint8Array) {
  const reader = new ZipReader(new Uint8ArrayReader(zippedData))
  const entries = await reader.getEntries()
  const extractedData = await entries[0].getData(new Uint8ArrayWriter())
  await reader.close()
  return extractedData
}

await fs.writeFile(destination, await zip(data.encode()))

console.log('zip done')
console.log(data.getTextAt(300))

const zipped = await fs.readFile(destination)
const data2 = TextHelper.Data.decode(await unzip(new Uint8Array(zipped)))
console.log(data2.getTextAt(300))

// explicit exit to avoid hanging process (why?) 
process.exit(0)
