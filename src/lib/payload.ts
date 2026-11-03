import 'server-only'
import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Config, Media } from '@/payload-types'
import type { Locale } from '@/i18n'

export const getClient = cache(() => getPayload({ config }))

type GlobalSlug = keyof Config['globals']

export const getGlobal = cache(async <S extends GlobalSlug>(slug: S, locale: Locale): Promise<Config['globals'][S]> => {
  const payload = await getClient()
  return payload.findGlobal({ slug, locale, depth: 2 }) as Promise<Config['globals'][S]>
})

export const getSettings = (locale: Locale) => getGlobal('settings', locale)

/** Returns the URL of an uploaded image (optionally a resized version). */
export const img = (m: unknown, size?: 'thumb' | 'card' | 'large'): string | undefined => {
  if (!m || typeof m !== 'object') return undefined
  const media = m as Media
  const sized = size ? media.sizes?.[size]?.url : undefined
  return sized || media.url || undefined
}

export const alt = (m: unknown, fallback = ''): string =>
  m && typeof m === 'object' ? (m as Media).alt || fallback : fallback

export const formatBytes = (n?: number | null) => {
  if (!n) return ''
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`
  return `${(n / 1024 / 1024).toFixed(1)} MB`
}
