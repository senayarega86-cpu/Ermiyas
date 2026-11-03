import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import { formatDate, getDictionary, href, type Locale } from '@/i18n'
import { formatBytes, getClient, getGlobal } from '@/lib/payload'
import { PUBLICATION_CATEGORIES } from '@/collections/Publications'
import { Icon } from '@/components/Icon'
import { PageHero } from '@/components/PageHero'

type P = { params: Promise<{ lang: Locale }>; searchParams: Promise<{ category?: string }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { lang } = await params
  const page = await getGlobal('publications-page', lang)
  return { title: page.hero?.title || getDictionary(lang).nav.publications, description: page.hero?.text || undefined }
}

export default async function Publications({ params, searchParams }: P) {
  const { lang } = await params
  const { category: raw } = await searchParams
  const t = getDictionary(lang)
  const category = PUBLICATION_CATEGORIES.some((c) => c.value === raw) ? raw : undefined
  const payload = await getClient()
  const [page, all] = await Promise.all([
    getGlobal('publications-page', lang),
    payload.find({ collection: 'publications', locale: lang, limit: 300, sort: '-publishedDate' }),
  ])
  const cats = PUBLICATION_CATEGORIES.filter((c) => all.docs.some((d) => d.category === c.value))
  const docs = category ? all.docs.filter((d) => d.category === category) : all.docs

  return (
    <>
      <PageHero hero={page.hero} lang={lang} crumb={t.nav.publications} />
      <section className="section section--tint">
        <div className="container">
          {cats.length > 1 && (
            <nav className="filter-links" aria-label="Categories">
              <Link href={href(lang, '/publications')} className={!category ? 'is-active' : undefined}>{t.allCategories}</Link>
              {cats.map((c) => <Link key={c.value} href={href(lang, `/publications?category=${c.value}`)} className={category === c.value ? 'is-active' : undefined}>{c.label}</Link>)}
            </nav>
          )}
          {docs.length ? (
            <div className="pubs">
              {docs.map((p, i) => (
                <div className="pub reveal" data-delay={i % 2 || undefined} key={p.id}>
                  <div className="pub__icon">{(p.filename?.split('.').pop() || 'PDF').toUpperCase()}</div>
                  <div className="pub__body">
                    <h3 className="eth">{p.title}</h3>
                    <p>{[PUBLICATION_CATEGORIES.find((c) => c.value === p.category)?.label, formatBytes(p.filesize), formatDate(lang, p.publishedDate, { year: 'numeric', month: 'long' })].filter(Boolean).join(' · ')}</p>
                    {p.description && <p style={{ marginTop: 6 }}>{p.description}</p>}
                  </div>
                  {p.url && <a className="btn btn--sm" href={p.url} target="_blank" rel="noopener noreferrer"><Icon name="download" />{t.download}</a>}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state"><Icon name="file" /><p>{t.noPublications}</p></div>
          )}
        </div>
      </section>
    </>
  )
}
