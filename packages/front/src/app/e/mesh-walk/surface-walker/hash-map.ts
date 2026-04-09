

export class HashMap<Key, Value> {
  #internal: {
    clone: (key: Key) => Key
    hash: (key: Key) => number
    equals: (a: Key, b: Key) => boolean
    map: Map<number, Array<{ key: Key; value: Value }>>
    size: number
  }

  get size() {
    return this.#internal.size
  }

  constructor(parameters: {
    hash: (key: Key) => number,
    equals: (a: Key, b: Key) => boolean,
    clone: (key: Key) => Key,
  }) {
    const { hash, equals, clone } = parameters
    if (!hash || !equals || !clone) {
      throw new Error('HashMap requires hash, equals, and clone functions')
    }
    this.#internal = {
      hash,
      equals,
      clone,
      map: new Map(),
      size: 0,
    }
  }

  hasKey(key: Key): boolean {
    const hash = this.#internal.hash(key)
    const bucket = this.#internal.map.get(hash)
    if (bucket) {
      for (const entry of bucket) {
        if (this.#internal.equals(entry.key, key)) {
          return true
        }
      }
    }
    return false
  }

  get(key: Key): Value | undefined {
    const hash = this.#internal.hash(key)
    const bucket = this.#internal.map.get(hash)
    if (bucket) {
      for (const entry of bucket) {
        if (this.#internal.equals(entry.key, key)) {
          return entry.value
        }
      }
    }
    return undefined
  }

  set(key: Key, value: Value): this {
    key = this.#internal.clone(key)
    const hash = this.#internal.hash(key)
    let bucket = this.#internal.map.get(hash)

    if (!bucket) {
      bucket = []
      this.#internal.map.set(hash, bucket)
    }

    // Check if the key already exists in the bucket
    for (const entry of bucket) {
      if (this.#internal.equals(entry.key, key)) {
        entry.value = value
        return this
      }
    }

    // If the key does not exist, add a new entry to the bucket
    bucket.push({ key, value })
    this.#internal.size++

    return this
  }

  *keys() {
    for (const bucket of this.#internal.map.values()) {
      for (const entry of bucket) {
        yield entry.key
      }
    }
  }

  *entries() {
    for (const bucket of this.#internal.map.values()) {
      for (const entry of bucket) {
        yield [entry.key, entry.value] as [Key, Value]
      }
    }
  }
}

export class HashMapArray<Key, Value> extends HashMap<Key, Value[]> {
  add(key: Key, value: Value): this {
    let array = this.get(key)
    if (!array) {
      array = []
      this.set(key, array)
    }
    array.push(value)
    return this
  }
}
