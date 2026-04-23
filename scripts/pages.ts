#!/usr/bin/env node

// Create a JSON file with the list of pages

import chokidar from 'chokidar'
import { lstat, readdir, readFile, writeFile } from 'fs/promises'

import { glob } from 'glob'
import path from 'path'
import { generatePagesSummary } from './pages-summary'
import { tryReadYaml } from './shared'

const pageDir = path.join(path.dirname(new URL(import.meta.url).pathname), '../packages/front/src/app')

let dirty = true

async function tryReadJson(path: string) {
  try {
    const str = await readFile(path)
    return JSON.parse(str.toString())
  } catch (e) {
    return null
  }
}

async function getDirs() {
  const entries = await readdir(pageDir)
  const dirs = [] as { dir: string, metadata: any }[]
  for (const entry of entries) {
    const stat = (await lstat(path.join(pageDir, entry)))
    if (stat.isDirectory()) {
      const metadata = await tryReadJson(path.join(pageDir, entry, 'metadata.json')) ?? { title: entry }
      dirs.push({ dir: entry, metadata })
    }
  }
  return dirs
}

async function update() {
  dirty = false

  const pageEntries = await glob('**/page.tsx', {
    cwd: pageDir,
    absolute: true,
  })

  const allPages = pageEntries
    .slice(1)
    .sort((a, b) => a < b ? -1 : 1)
    .filter(page => !page.includes('/tmp/')) // Exclude temporary pages
    .map(page => {
      const osPagePath = path.relative(pageDir, page)
      const pagePath = path.posix.join(...osPagePath.split(path.sep))
      return {
        page: pagePath,
        dir: pagePath.replace(/\/page.tsx$/, ''),
        yaml: <any>null,
      }
    })

  for (const page of allPages) {
    const yamlPath = path.join(pageDir, page.dir, 'page.yaml')
    const yamlData = await tryReadYaml(yamlPath)
    if (yamlData) {
      page.yaml = yamlData
    }
  }

  const pages = allPages
    .filter(page => {
      // Exclude pages with pageIgnore: true, but include their children
      if (page.yaml?.pageIgnore)
        return false

      const parentDir = page.dir.split('/').slice(0, -1).join('/')
      if (!parentDir)
        return true // Top-level pages are always included
      const hasParent = !!allPages.find(page => page.dir === parentDir)
      return hasParent === false || parentDir.length === 1 // Include root-level pages
    })

  // Delete the yaml data from the pages before writing to JSON, since it's only used for filtering and not needed in the final output
  for (const page of pages) {
    delete page.yaml
  }

  const str = JSON.stringify(pages, null, 2)
  const filePath = path.join(pageDir, 'pages.json')
  await writeFile(filePath, str)

  for (const { dir, metadata } of await getDirs()) {
    const pageStr = generatePagesSummary(dir, metadata, pages.map(p => p.page))
    await writeFile(path.join(pageDir, dir, `/page.tsx`), pageStr)
  }
}

const watcher = chokidar.watch(pageDir, {
  persistent: true,
})

setInterval(() => {
  if (dirty) {
    update()
  }
}, 500)

watcher
  .on('add', async file => {
    if (file.endsWith('/page.tsx')) {
      dirty = true
    }
  })
  .on('change', async file => {
    if ((await getDirs()).some(d => file === path.join(pageDir, d.dir, 'page.tsx'))) {
      return
    }
    if (file.endsWith('/page.tsx')) {
      dirty = true
    }
  })

console.log(`Watching ${pageDir} for changes...`)
