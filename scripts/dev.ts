import './pages'

import concurrently from 'concurrently'

const commands = [
  { command: 'pnpm --filter front dev', name: '0 nxt' },
]

// Run the commands concurrently
concurrently(commands, {
  prefix: 'name',
  killOthers: ['failure'], // Kill all processes if one fails
  restartTries: 3,
})
