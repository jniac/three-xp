
import { XpMetadata } from '@/types'

import { Demo } from './demo'

import styles from './styles.module.css'

export const metadata = new XpMetadata({
  title: 'two-env-demo',
  slug: 'two-env-demo',
  description: `
    # Demo of two environments map blending
  `,
})

export default function Exp1() {
  return (
    <div className={`TwoEnvDemo page ${styles.TwoEnvDemo}`}>
      <Demo />
    </div>
  )
}