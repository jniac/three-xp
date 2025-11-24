import { format, parse } from 'fast-csv'
import fs from 'fs'
import unidecode from 'unidecode'

const inputPath = './Lexique383.tsv'
const outputPath = './lexique_reduit.tsv'

const alphabet = 'abcdefghijklmnopqrstuvwxyz'
const alphabetFrequency = new Map(alphabet.split('').map(letter => [letter, 0]))

const output = fs.createWriteStream(outputPath)

const stream = fs.createReadStream(inputPath)

const parser = parse({ headers: true, delimiter: '\t' })
  .transform((row) => {
    const ortho = row.ortho
    const cgram = row.cgram
    const lemme = row.lemme
    const alpha26 = unidecode(ortho.toLowerCase())
    for (const char of alpha26) {
      if (alphabetFrequency.has(char)) {
        alphabetFrequency.set(char, alphabetFrequency.get(char) + 1)
      }
    }
    return { ortho, cgram, lemme, alpha26 }
  })
  .on('error', error => console.error(error))

function computeLetterProbabilities() {
  const sum = Array.from(alphabetFrequency.values()).reduce((a, b) => a + b, 0)
  for (const [letter, frequency] of alphabetFrequency.entries()) {
    alphabetFrequency.set(letter, frequency / sum)
  }

  fs.writeFile(
    'letter-probabilities.yaml',
    Array.from(alphabetFrequency.entries())
      .map(([letter, p]) => `${letter}: ${(p * 1000).toFixed(1)}‰`)
      .join('\n'), (err) => {
        if (err) {
          console.error('Erreur lors de l\'écriture du fichier de fréquence des lettres:', err)
        } else {
          console.log('Fichier de fréquence des lettres généré avec succès.')
        }
      })


  fs.writeFile(
    'letter-probabilities.txt',
    Array.from(alphabetFrequency.values()).join(', '),
    (err) => {
      if (err) {
        console.error('Erreur lors de l\'écriture du fichier de fréquence des lettres:', err)
      } else {
        console.log('Fichier de fréquence des lettres généré avec succès.')
      }
    })
}


stream.pipe(parser).pipe(format({ headers: true, delimiter: '\t' })).pipe(output)
  .on('finish', () => {
    console.log(`✅ Fichier généré : ${outputPath}`)
    computeLetterProbabilities()
  })

