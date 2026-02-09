export class HashMap<Key, Value> {
  #internal: {
    cloneKey: (key: Key) => Key
    hashDelegate: (key: Key) => number
    equalsDelegate: (a: Key, b: Key) => boolean
    map: Map<number, Array<{ key: Key; value: Value }>>
  }

  constructor(
    hashDelegate: (key: Key) => number,
    equalsDelegate: (a: Key, b: Key) => boolean,
    cloneKey: (key: Key) => Key,
  ) {
    this.#internal = {
      hashDelegate,
      equalsDelegate,
      cloneKey,
      map: new Map(),
    }
  }

  hasKey(key: Key): boolean {
    const hash = this.#internal.hashDelegate(key)
    const bucket = this.#internal.map.get(hash)
    if (bucket) {
      for (const entry of bucket) {
        if (this.#internal.equalsDelegate(entry.key, key)) {
          return true
        }
      }
    }
    return false
  }

  get(key: Key): Value | undefined {
    const hash = this.#internal.hashDelegate(key)
    const bucket = this.#internal.map.get(hash)
    if (bucket) {
      for (const entry of bucket) {
        if (this.#internal.equalsDelegate(entry.key, key)) {
          return entry.value
        }
      }
    }
    return undefined
  }

  set(key: Key, value: Value): this {
    key = this.#internal.cloneKey(key)
    const hash = this.#internal.hashDelegate(key)
    let bucket = this.#internal.map.get(hash)
    if (!bucket) {
      bucket = []
      this.#internal.map.set(hash, bucket)
    }
    for (const entry of bucket) {
      if (this.#internal.equalsDelegate(entry.key, key)) {
        entry.value = value
        return this
      }
    }
    bucket.push({ key, value })
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
