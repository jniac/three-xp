
function factorial(n: number): number {
  let result = 1
  for (let i = 2; i <= n; i++) result *= i
  return result
}

function nthPermutationArray<T extends Int32Array | number[]>(
  n: number,
  index: number,
  out?: T
): T {
  // if (n > 20)
  //   throw new Error(`nthPermutationArray only supports n up to 20, as larger values would exceed JavaScript's number precision for factorials.`)

  out ??= new Int32Array(n) as T

  const elements = Array.from({ length: n }, (_, i) => i)

  // Step 1: factoradic
  const factoradic: number[] = new Array(n)
  for (let i = 1; i <= n; i++) {
    factoradic[n - i] = index % i
    index = Math.floor(index / i)
  }

  // Step 2: build permutation
  for (let i = 0; i < n; i++) {
    const idx = factoradic[i]
    out[i] = elements[idx]
    elements.splice(idx, 1)
  }

  return out
}



const FACTORIALS_NUM = [
  1, 1, 2, 6, 24, 120, 720, 5040,
  40320, 362880, 3628800, 39916800, 479001600
]

const FACTORIALS_BIG: bigint[] = Array.from(
  { length: 32 },
  (_, i) => BigInt(FACTORIALS_NUM[i] ?? [...Array(i)].reduce((acc, _, j) => acc * BigInt(j + 1), 1n))
)


function kthSetBit(mask: number, k: number): number {
  let m = mask
  for (let i = 0; i <= k; i++) {
    const lsb = m & (-m)
    if (i === k)
      return 31 - Math.clz32(lsb)
    m ^= lsb
  }
  return -1
}

function bigIntLog2(n: bigint): number {
  let result = 0
  let v = n
  while (v > 1n) { v >>= 1n; result++ }
  return result
}

function kthSetBitBig(mask: bigint, k: number): number {
  let m = mask
  for (let i = 0; i <= k; i++) {
    const lsb = m & (-m)
    if (i === k)
      return bigIntLog2(lsb)
    m ^= lsb
  }
  return -1
}

/**
 * Return the permutation of [0, 1, ..., n-1] at a given index in [0, n!-1].
 * 
 * Notes:
 * - n must be between 0 and 12, as larger values would exceed JavaScript's number precision for factorials.
 * - This is a more efficient implementation than the naive one, as it avoids splicing arrays and uses bitwise operations to track available elements.
 * - The output array can be provided for reuse, and will be filled with the result.
 */
function nthPermutationNum<T extends Int32Array | number[]>(
  n: number,
  n_index: number,
  out?: T
): T {
  if (n < 0 || n > FACTORIALS_NUM.length)
    throw new Error(`n must be between 0 and ${FACTORIALS_NUM.length}`)

  out ??= new Int32Array(n) as T

  let mask = (1 << n) - 1
  let remainder = n_index

  for (let i = n - 1; i >= 0; i--) {
    const fact = FACTORIALS_NUM[i]
    const lehmerDigit = (remainder / fact) | 0
    remainder %= fact

    const chosen = kthSetBit(mask, lehmerDigit)
    out[n - 1 - i] = chosen
    mask ^= (1 << chosen)
  }

  return out
}

function nthPermutationBig<T extends Int32Array | number[]>(
  n: number,
  n_index: bigint,
  out?: T
): T {
  out ??= new Int32Array(n) as T

  let mask = (1n << BigInt(n)) - 1n
  let remainder = n_index

  for (let i = n - 1; i >= 0; i--) {
    const fact = FACTORIALS_BIG[i]
    const lehmerDigit = Number(remainder / fact)
    remainder %= fact

    const chosen = kthSetBitBig(mask, lehmerDigit)
    out[n - 1 - i] = chosen
    mask ^= (1n << BigInt(chosen))
  }

  return out
}

function nthPermutation<T extends Int32Array | number[]>(n: number, n_index: number, out?: T): T {
  return n < 12
    ? nthPermutationNum(n, n_index, out)
    : nthPermutationBig(n, BigInt(n_index), out)
}

/**
 * Return the permutation of [0, 1, ..., n-1] at a given normalized index t in [0, 1).
 * The total number of permutations is n!, so the index is scaled accordingly.
 * 
 * This is a convenient way to sample permutations without needing to know the
 * total count (eg: for getting a random permutation).
 */
function permutationAt<T extends Int32Array | number[]>(
  n: number,
  t: number,
  out?: T
): T {
  if (n <= 12) {
    const n_index = Math.min(Math.floor(t * FACTORIALS_NUM[n]), FACTORIALS_NUM[n] - 1)
    return nthPermutationNum(n, n_index, out)
  }

  else if (n <= 20) {
    const n_index = Math.min(Math.floor(t * Number(FACTORIALS_BIG[n])), Number(FACTORIALS_BIG[n] - 1n))
    return nthPermutationArray(n, n_index, out)
  }

  else {
    const total = FACTORIALS_BIG[n]
    const precision = BigInt(1e9)
    if (t >= 1)
      return nthPermutationBig(n, total - 1n, out)
    let n_index = total / precision
    n_index *= BigInt(Math.floor(t * 1e9))
    n_index = n_index > total - 1n ? total - 1n : n_index
    return nthPermutationBig(n, n_index, out)
  }
}

export {
  factorial,
  nthPermutation,
  nthPermutationArray,
  permutationAt
}

