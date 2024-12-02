import { PRNG } from 'some-utils-ts/random/prng'

enum Name {
  Patrick = 'Patrick',
  Helena = 'Helena',
  Joseph = 'Joseph',
  Anne = 'Anne',
  Jean = 'Jean',
  Fairouz = 'Fairouz',
  Vladimir = 'Vladimir',
}

class People {
  givesTo: People[] = []
  receivesFrom: People[] = []
  constructor(public name: Name) { }
}

const peoples = [
  new People(Name.Patrick),
  new People(Name.Helena),
  new People(Name.Joseph),
  new People(Name.Anne),
  new People(Name.Jean),
  new People(Name.Fairouz),
  new People(Name.Vladimir),
]

function giftLink(giver: Name, ...receivers: Name[]) {
  const g = peoples.find(p => p.name === giver)
  for (const receiver of receivers) {
    const r = peoples.find(p => p.name === receiver)
    if (!g || !r) throw new Error('Person not found')
    g.givesTo.push(r)
    r.receivesFrom.push(g)
  }
}

function getReceiverCandidates(giver: Name) {
  const g = peoples.find(p => p.name === giver)
  if (!g)
    throw new Error('Person not found')
  return peoples.filter(p => p !== g && p.receivesFrom.length < 2 && !g.givesTo.includes(p) && !g.receivesFrom.includes(p))
}

function randomGiftLink(giver: Name, count = 2) {
  const g = peoples.find(p => p.name === giver)
  if (!g)
    throw new Error('Person not found')

  for (let i = 0; i < count; i++) {
    const candidates = getReceiverCandidates(giver)
    if (candidates.length === 0)
      throw new Error(`Not enough candidates for ${giver}`)
    const receiver = PRNG.pick(candidates)
    if (giver === Name.Anne)
      console.log(receiver.name, candidates.map(p => p.name))
    giftLink(giver, receiver.name)
  }
}

function resetLinks() {
  for (const p of peoples) {
    p.givesTo = []
    p.receivesFrom = []
  }
}

function printLinks() {
  for (const p of peoples) {
    console.log(`${p.name}\n  > ${p.givesTo.map(p => p.name).join(', ')}\n  < ${p.receivesFrom.map(p => p.name).join(', ')}\n`)
  }
}

let tries = 0
while (true) {
  tries++
  try {
    resetLinks()

    PRNG.seed(tries * 123 + 45690456)
    console.log('randomness?', PRNG.random())

    giftLink(Name.Patrick, Name.Fairouz, Name.Anne)
    giftLink(Name.Joseph, Name.Patrick, Name.Vladimir)
    giftLink(Name.Helena, Name.Patrick, Name.Joseph)

    randomGiftLink(Name.Anne)
    randomGiftLink(Name.Jean)
    randomGiftLink(Name.Fairouz)
    randomGiftLink(Name.Vladimir)

    console.log(`Tries: ${tries}\n`)
    printLinks()
    break
  } catch (e) {
    if (tries > 100_000) {
      console.log('Too many tries')
      printLinks()
      console.log('Too many tries')
      console.log(getReceiverCandidates(Name.Vladimir))
      break
    }
  }
}

