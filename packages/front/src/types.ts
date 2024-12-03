import { Metadata } from 'next'
import { TemplateString } from 'next/dist/lib/metadata/types/metadata-types'

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

  slug: string
  title: string | TemplateString
  description: string
  status: Status

  constructor(metadata: XpMetadataType) {
    this.internal = metadata
    this.slug = metadata.slug
    this.title = metadata.title ?? metadata.slug
    this.description = metadata.description ?? metadata.slug
    this.status = metadata.status ?? defaultProps.status
  }
}