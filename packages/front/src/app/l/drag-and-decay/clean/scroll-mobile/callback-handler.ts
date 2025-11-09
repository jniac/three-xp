type CallbackType = string | number | Symbol
type Callback<TArgs extends any[] = any[]> = (...args: [type: CallbackType, ...TArgs]) => (void | 'unsubscribe')

export class CallbackHandler<TArgs extends any[] = any[]> {
  map = new Map<CallbackType, Set<Callback<TArgs>>>()

  add(type: CallbackType, callback: Callback<TArgs>): { destroy: () => void, unsubscribe: () => void } {
    if (!this.map.has(type))
      this.map.set(type, new Set())
    const set = this.map.get(type)!
    set.add(callback)
    const unsubscribe = () => this.unsubscribe(type, callback)
    return {
      unsubscribe,
      destroy: unsubscribe,
    }
  }

  addOnce(type: CallbackType, callback: Callback<TArgs>): { unsubscribe: () => void } {
    const wrapper: Callback<TArgs> = (...args) => {
      callback(...args)
      return 'unsubscribe' as const
    }
    return this.add(type, wrapper)
  }

  dispatch(type: CallbackType, ...args: TArgs): this {
    const wildcardSet = this.map.get('*')

    if (wildcardSet) {
      for (const callback of wildcardSet) {
        const result = callback(type, ...args)
        if (result === 'unsubscribe')
          wildcardSet.delete(callback)
      }
      if (wildcardSet.size === 0)
        this.map.delete('*')
    }

    const set = this.map.get(type)
    if (set) {
      for (const callback of set) {
        const result = callback(type, ...args)
        if (result === 'unsubscribe')
          set.delete(callback)
      }
      if (set.size === 0)
        this.map.delete(type)
    }

    return this
  }

  unsubscribe(type: CallbackType, callback: Callback<TArgs>): boolean {
    const set = this.map.get(type)
    if (!set)
      return false
    const result = set.delete(callback)
    if (set.size === 0)
      this.map.delete(type)
    return result
  }
}
