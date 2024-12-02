#!/usr/bin/env node

import { spawnSync } from 'child_process'
import { build } from 'esbuild'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

// Get the current file directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Get the input file argument
const file = process.argv[2]
if (!file) {
  console.error('Usage: node esbuild-runner.js <file.ts>')
  process.exit(1)
}

// Absolute path to the input file
const filePath = path.join(file)

try {
  // Transpile the file using esbuild
  const result = await build({
    entryPoints: [filePath],
    bundle: true,
    platform: 'node',
    target: 'esnext',
    format: 'esm',
    write: false,
  })

  // Generate a temporary file for the transpiled code
  const tempFile = path.join(__dirname, `.temp-${Date.now()}.mjs`)
  await fs.writeFile(tempFile, result.outputFiles[0].text)

  // Execute the temporary file with Node.js
  spawnSync('node', [tempFile], { stdio: 'inherit' })

  console.log('\nSuccessfully ran the TypeScript file!')

  // Cleanup the temporary file
  await fs.unlink(tempFile)
} catch (err) {
  console.error('Error while running the TypeScript file:', err)
  process.exit(1)
}