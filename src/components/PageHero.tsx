import Link from 'next/link'
import React from 'react'
import type { Locale } from '@/i18n'
import { getDictionary, href } from '@/i18n'
import { img } from '@/lib/payload'
import { Icon, Rays } from './Icon'

type Hero = { eyebrow?: string | null; title?: string | null; text?: string | null; image?: unknown } | null | undefined

export function PageHero({ hero, lang, crumb, fallbackImage, children }: { hero: Hero; lang: Locale; crumb: string; fallbackImage?: string; children?: React.ReactNode }) {
  const t = getDictionary(lang)
  const bg = img(hero?.image, 'large') || fallbackImage
  return (
    <section className="page-hero">
      
      {bg && <div className="page-hero__bg"><img src={bg} alt="" /></div>}
      <Rays className="page-hero__rays" />
      <div className="container">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href={href(lang, '/')}>{t.nav.home}</Link><Icon name="chevron-right" /><span>{crumb}</span>
        </nav>
        {hero?.eyebrow && <span className="eyebrow">{hero.eyebrow}</span>}
        <h1>{hero?.title || crumb}</h1>
        {hero?.text && <p>{hero.text}</p>}
        {children}
      </div>
    </section>
  )
}
