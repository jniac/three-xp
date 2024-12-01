import { Uint8ArrayReader, Uint8ArrayWriter, ZipReader } from '@zip.js/zip.js'

import { TextHelper } from 'some-utils-three/helpers/text-helper'

import { config } from '@/config'

async function unzip(zippedData: Uint8Array) {
  const reader = new ZipReader(new Uint8ArrayReader(zippedData))
  const entries = await reader.getEntries()
  const extractedData = await entries[0].getData!(new Uint8ArrayWriter())
  await reader.close()
  return extractedData
}

export async function fetchHunger() {
  const response = await fetch(config.assets('misc/knut-hamsun-hunger.bin.zip'))
  const buffer = await response.arrayBuffer()
  const bytes = await unzip(new Uint8Array(buffer))
  return TextHelper.Data.decode(bytes)
}
