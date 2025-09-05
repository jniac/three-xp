import { Matrix4, Quaternion, Vector3 } from 'three'

interface TransformWithShear {
  position: Vector3
  rotation: Quaternion
  scale: Vector3
  shear: {
    xy: number // shear in XY plane
    xz: number // shear in XZ plane  
    yz: number // shear in YZ plane
  }
}

/**
 * Decompose a Matrix4 into position, rotation, scale, and shear components
 * Using QR decomposition approach
 */
export function decomposeMatrixWithShear(matrix: Matrix4): TransformWithShear {
  const m = matrix.elements

  // Extract translation
  const position = new Vector3(m[12], m[13], m[14])

  // Extract 3x3 upper-left submatrix
  const M = new Matrix4().set(
    m[0], m[4], m[8], 0,
    m[1], m[5], m[9], 0,
    m[2], m[6], m[10], 0,
    0, 0, 0, 1
  )

  // Get column vectors
  const c0 = new Vector3(m[0], m[1], m[2])
  const c1 = new Vector3(m[4], m[5], m[6])
  const c2 = new Vector3(m[8], m[9], m[10])

  // Check for reflection
  const det = c0.dot(new Vector3().crossVectors(c1, c2))
  const sign = det < 0 ? -1 : 1

  // QR decomposition using Gram-Schmidt
  // Q will be orthonormal, R will be upper triangular

  // First column
  const scaleX = c0.length()
  const q0 = c0.clone().divideScalar(scaleX)

  // Second column  
  const r01 = q0.dot(c1)  // This is shear XY
  const q1_unnorm = c1.clone().addScaledVector(q0, -r01)
  const scaleY = q1_unnorm.length()
  const q1 = q1_unnorm.divideScalar(scaleY)

  // Third column
  const r02 = q0.dot(c2)  // This is shear XZ
  const r12 = q1.dot(c2)  // This is shear YZ  
  const q2_unnorm = c2.clone().addScaledVector(q0, -r02).addScaledVector(q1, -r12)
  const scaleZ = q2_unnorm.length()
  const q2 = q2_unnorm.divideScalar(scaleZ)

  // Handle reflection by negating first column
  if (sign < 0) {
    q0.negate()
  }

  // Build rotation matrix from orthonormal columns
  const rotMatrix = new Matrix4().makeBasis(q0, q1, q2)
  const rotation = new Quaternion().setFromRotationMatrix(rotMatrix)

  // Scale with reflection
  const scale = new Vector3(sign * scaleX, scaleY, scaleZ)

  return {
    position,
    rotation,
    scale,
    shear: {
      xy: r01,
      xz: r02,
      yz: r12,
    }
  }
}

/**
 * Compose a Matrix4 with the transform components
 * Order: T * R * H * S where H is shear matrix
 */
export function composeMatrixWithShear(
  params: TransformWithShear,
  out = new Matrix4(),
): Matrix4 {
  const { position, rotation, scale, shear } = params

  // Build composite transformation matrix manually
  // Final matrix = T * R * H * S

  // 1. Scale matrix S
  const S = new Matrix4().makeScale(scale.x, scale.y, scale.z)

  // 2. Shear matrix H (upper triangular)
  const H = new Matrix4().set(
    1, shear.xy, shear.xz, 0,
    // 0, 1, shear.yz, 0, // From original claude.ai code
    0, 1, shear.yz / 2, 0, // <--- My modification to fix shear YZ
    0, 0, 1, 0,
    0, 0, 0, 1
  )

  // 3. Rotation matrix R
  const R = new Matrix4().makeRotationFromQuaternion(rotation)

  // 4. Translation matrix T
  const T = new Matrix4().makeTranslation(position.x, position.y, position.z)

  // Combine: result = T * R * H * S
  // Build from right to left: ((S * H) * R) * T
  out.copy(S)
  out.multiply(R)
  out.multiply(H)
  out.premultiply(T)

  return out
}

// Helper function to create a shear transform
export function createShearTransform(
  position: Vector3 = new Vector3(),
  rotation: Quaternion = new Quaternion(),
  scale: Vector3 = new Vector3(1, 1, 1),
  shearXY: number = 0,
  shearXZ: number = 0,
  shearYZ: number = 0
): TransformWithShear {
  return {
    position: position.clone(),
    rotation: rotation.clone(),
    scale: scale.clone(),
    shear: {
      xy: shearXY,
      xz: shearXZ,
      yz: shearYZ
    }
  }
}

// Helper function to check if decomposition/composition round-trip works
export function testRoundTrip(originalMatrix: Matrix4, tolerance: number = 1e-12): boolean {
  const decomposed = decomposeMatrixWithShear(originalMatrix)
  const recomposed = composeMatrixWithShear(decomposed)

  // Compare matrices element by element
  for (let i = 0; i < 16; i++) {
    const diff = Math.abs(originalMatrix.elements[i] - recomposed.elements[i])
    if (diff > tolerance) {
      return false
    }
  }
  return true
}

// Debug helper
export function debugDecomposition(matrix: Matrix4): void {
  console.log('=== Debug Decomposition ===')
  console.log('Original matrix elements:', matrix.elements)

  const decomposed = decomposeMatrixWithShear(matrix)
  console.log('Position:', decomposed.position)
  console.log('Rotation (quaternion):', decomposed.rotation)
  console.log('Scale:', decomposed.scale)
  console.log('Shear:', decomposed.shear)

  const recomposed = composeMatrixWithShear(decomposed)
  console.log('Recomposed elements:', recomposed.elements)

  console.log('Element differences:')
  for (let i = 0; i < 16; i++) {
    const diff = Math.abs(matrix.elements[i] - recomposed.elements[i])
    if (diff > 1e-12) {
      console.log(`  [${i}]: ${diff}`)
    }
  }

  console.log('Round-trip success:', testRoundTrip(matrix))
}

export type { TransformWithShear }
