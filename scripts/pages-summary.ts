
const template = `
import { Metadata } from 'next'

import { SummaryPage } from '@/components/summary'

$IMPORTS

const pages = {
$PAGES
}

export const metadata: Metadata = {
  title: '$TITLE',
}

export default function ExperimentsPage() {
  return (
    <SummaryPage
      className='ExperimentsPage'
      path='$PATH'
      metadata={metadata}
      pages={pages}
    />
  )
}
`

export function generatePagesSummary(dir: string, metadata: { title: string }, pages: string[]) {
  const entries = pages
    .filter(page => page.startsWith(`${dir}/`) && page !== `${dir}/page.tsx`)
    .map(page => {
      const localPage = page
        .replace(new RegExp(`^${dir}/`, 'g'), '')
        .replace('/page.tsx', '')

      const name = localPage
        .split(/\W+/)
        .map((word, i) => i === 0 ? word : word[0].toUpperCase() + word.slice(1))
        .join('')

      const pathStr = `./${localPage}/page`

      const importStr = `import * as ${name} from '${pathStr}'`

      return {
        name,
        localPage,
        pathStr,
        importStr,
      }
    })

  const imports = entries.map(entry => entry.importStr).join('\n')
  const pageNames = entries.map(entry => `  '${entry.localPage}': ${entry.name},`).join('\n')

  return template
    .replace('$IMPORTS', imports)
    .replace('$PAGES', pageNames)
    .replace('$TITLE', metadata.title)
    .replace('$PATH', dir)
}