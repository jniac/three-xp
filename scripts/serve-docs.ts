import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const port = 3000

const docsPath = path.join(__dirname, '../docs')

app.use('/three-xp', express.static(docsPath))

// app.get('/three-xp/*', (req, res) => {
//   res.sendFile(path.join(docsPath, 'index.html'))
// })

app.listen(port, () => {
  console.log(`Local preview: http://localhost:${port}/three-xp/`)
})
