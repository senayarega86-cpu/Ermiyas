'use client'
import { useRowLabel } from '@payloadcms/ui'
import React from 'react'

/** Shows "Slide 1 · <title>" on each collapsed slide in the admin. */
export const SlideLabel = () => {
  const { data, rowNumber } = useRowLabel<{ title?: string; highlight?: string }>()
  const text = [data?.title, data?.highlight].filter(Boolean).join(' ')
  return <span>Slide {(rowNumber ?? 0) + 1}{text ? ` · ${text}` : ''}</span>
}
