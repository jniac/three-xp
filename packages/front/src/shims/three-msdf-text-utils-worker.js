self.addEventListener('message', () => {
  throw new Error(
    'three-msdf-text-utils: dynamic MSDF generation requires an explicit workerUrl',
  )
})
