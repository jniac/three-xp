import { ExpMetadata } from '../types'
import { Art } from './art'

import styles from './style.module.css'

export const metadata: ExpMetadata = {
  title: 'art-1',
  slug: 'art-1',
  description: 'Art Experiment 1',
}

export default function Exp1() {
  return (
    <div className='page'>
      <div className={styles.Artboard}>
        <Art />
      </div>
    </div>
  )
}