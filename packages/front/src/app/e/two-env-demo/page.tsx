
import { ExpMetadata } from '@/types'

import { Demo } from './demo'

import styles from './styles.module.css'

export const metadata: ExpMetadata = {
  title: 'two-env-demo',
  slug: 'two-env-demo',
  description: `
    # Graphic Art 2
  `,
}

export default function Exp1() {
  return (
    <div className={`TwoEnvDemo page ${styles.TwoEnvDemo}`}>
      <Demo />
    </div>
  )
}