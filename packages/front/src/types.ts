import { Metadata } from 'next'

const statusOptions = [
  'wip',
  'done',
] as const

type Status = typeof statusOptions[number]

const defaultProps = {
  status: <Status>'wip',
}

type XpMetadataType =
  & Metadata
  & Partial<typeof defaultProps>
  & {
    slug: string
  }

export class XpMetadata implements XpMetadataType {
  internal: XpMetadataType

  get slug() { return this.internal.slug }
  get title() { return this.internal.title ?? this.internal.slug }
  get description() { return this.internal.description ?? this.internal.slug }
  get status() { return this.internal.status ?? defaultProps.status }

  constructor(metadata: XpMetadataType) {
    this.internal = metadata
  }
}