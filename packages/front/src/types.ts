import { Metadata } from 'next'

type XpMetadataType = Metadata & {
  slug: string
}

export class XpMetadata implements XpMetadataType {
  internal: XpMetadataType

  get slug() { return this.internal.slug }
  get title() { return this.internal.title ?? this.internal.slug }
  get description() { return this.internal.description ?? this.internal.slug }

  constructor(metadata: XpMetadataType) {
    this.internal = metadata
  }
}