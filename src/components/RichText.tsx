import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import React from 'react'

export function RichText({ data, className = 'prose' }: { data?: unknown; className?: string }) {
  if (!data || typeof data !== 'object') return null
  return <LexicalRichText className={className} data={data as SerializedEditorState} />
}
