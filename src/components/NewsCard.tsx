import Link from 'next/link'
import React from 'react'
import type { News } from '@/payload-types'
import type { Locale } from '@/i18n'
import { formatDate, getDictionary, href } from '@/i18n'
import { alt, img } from '@/lib/payload'
import { NEWS_CATEGORIES } from '@/collections/News'
import { Icon } from './Icon'

export const categoryLabel = (v?: string | null) => NEWS_CATEGORIES.find((c) => c.value === v)?.label || 'News'

export function NewsCard({ item, lang, variant, delay }: { item: News; lang: Locale; variant?: 'lead' | 'row'; delay?: number }) {
  const t = getDictionary(lang)
  const src = img(item.image, 'card')
  return (
    <Link className={`news-card${variant ? ` news-card--${variant}` : ''} reveal`} data-delay={delay} href={href(lang, `/news/${item.slug}`)}>
      
      <div className="news-card__img">{src ? <img src={src} alt={alt(item.image, item.title)} loading="lazy" /> : null}</div>
      <div className="news-card__body">
        <div className="news-card__meta">
          <span className={`tag${item.category === 'workshop' ? ' tag--gold' : ''}`}>{categoryLabel(item.category)}</span>
          <span>{formatDate(lang, item.publishedDate)}</span>
        </div>
        <h3>{item.title}</h3>
        {variant !== 'row' && <span className="link-arrow">{t.readMore} <Icon name="arrow" /></span>}
      </div>
    </Link>
  )
}
