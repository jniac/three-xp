#!/usr/bin/env node

import { mkdir, writeFile } from 'fs/promises'
import path from 'path'

const appDir = path.join(path.dirname(new URL(import.meta.url).pathname), '../packages/front/src/app')
const destinations = ['t', 'e', 'm', 'l'] as const

type Destination = typeof destinations[number]

type Options = {
  force: boolean
  status: string
}

function usage() {
  console.log(`Usage:
  tsx scripts/create-three-provider-page.ts <destination>/<page-path> [--status wip] [--force]
  tsx scripts/create-three-provider-page.ts <destination> <page-path> [--status wip] [--force]

Destinations: ${destinations.join(', ')}

Examples:
  tsx scripts/create-three-provider-page.ts e/glass-2
  tsx scripts/create-three-provider-page.ts t voxel/world-3 --status done`)
}

function parseArgs(argv: string[]) {
  const options: Options = {
    force: false,
    status: 'wip',
  }
  const positional: string[] = []

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--help' || arg === '-h') {
      usage()
      process.exit(0)
    }

    if (arg === '--force' || arg === '-f') {
      options.force = true
      continue
    }

    if (arg === '--status') {
      const status = argv[index + 1]
      if (!status) {
        throw new Error('Missing value after --status.')
      }
      options.status = status
      index += 1
      continue
    }

    positional.push(arg)
  }

  if (positional.length === 1) {
    const segments = normalizeSegments(positional[0])
    const [destination, ...pageSegments] = segments
    if (!destination) {
      throw new Error('Missing destination.')
    }
    return {
      destination: parseDestination(destination),
      pageSegments: parsePageSegments(pageSegments),
      options,
    }
  }

  if (positional.length === 2) {
    return {
      destination: parseDestination(positional[0]),
      pageSegments: parsePageSegments(normalizeSegments(positional[1])),
      options,
    }
  }

  throw new Error('Expected either <destination>/<page-path> or <destination> <page-path>.')
}

function normalizeSegments(value: string) {
  return value.split('/').filter(Boolean)
}

function parseDestination(value: string): Destination {
  if (destinations.includes(value as Destination)) {
    return value as Destination
  }
  throw new Error(`Invalid destination "${value}". Expected one of: ${destinations.join(', ')}.`)
}

function parsePageSegments(segments: string[]) {
  if (segments.length === 0) {
    throw new Error('Missing page path.')
  }

  for (const segment of segments) {
    if (segment === '.' || segment === '..' || !/^[a-z0-9][a-z0-9_+-]*$/i.test(segment)) {
      throw new Error(`Invalid path segment "${segment}". Use letters, numbers, "_", "+", or "-".`)
    }
  }

  return segments
}

function parseStatus(status: string) {
  if (!/^[a-z0-9_-]+$/i.test(status)) {
    throw new Error('Invalid status. Use letters, numbers, "_", or "-".')
  }
  return status
}

function createPageTsx(slug: string, status: string) {
  return `import { XpMetadata } from '@/types'

import Page from './page.client'

export const metadata = new XpMetadata({
  slug: '${slug}',
  status: '${status}',
})

export default Page
`
}

function createPageClientTsx() {
  return `'use client'

import { ThreeProvider, useGroup, useThreeWebGL } from 'some-utils-misc/three-provider'
import { DebugHelper } from 'some-utils-three/helpers/debug'
import { setup } from 'some-utils-three/utils/tree'

export function MyScene() {
  const three = useThreeWebGL()
  useGroup('my-scene', function* (group) {
    setup(new DebugHelper().regularGrid(), group)

  }, [])
  return null
}

export default function PageClient() {
  return (
    <ThreeProvider
      vertigoControls={{
        size: 10,
      }}
    >
      <MyScene />
    </ThreeProvider>
  )
}
`
}

async function main() {
  const { destination, pageSegments, options } = parseArgs(process.argv.slice(2))
  const slug = pageSegments.join('/')
  const status = parseStatus(options.status)
  const pageDir = path.join(appDir, destination, ...pageSegments)
  const relativePageDir = path.relative(process.cwd(), pageDir)

  await mkdir(pageDir, { recursive: true })

  await writeFile(path.join(pageDir, 'page.tsx'), createPageTsx(slug, status), {
    flag: options.force ? 'w' : 'wx',
  })
  await writeFile(path.join(pageDir, 'page.client.tsx'), createPageClientTsx(), {
    flag: options.force ? 'w' : 'wx',
  })

  console.log(`Created ${relativePageDir}`)
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error)
  console.error('')
  usage()
  process.exit(1)
})
