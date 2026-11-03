import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import type { Where } from 'payload'
import { getDictionary, href, type Locale } from '@/i18n'
import { getClient, getGlobal } from '@/lib/payload'
import { NEWS_CATEGORIES } from '@/collections/News'
import { Icon } from '@/components/Icon'
import { NewsCard } from '@/components/NewsCard'
import { PageHero } from '@/components/PageHero'

type P = { params: Promise<{ lang: Locale }>; searchParams: Promise<{ page?: string; category?: string }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { lang } = await params
  const page = await getGlobal('news-page', lang)
  return { title: page.hero?.title || getDictionary(lang).nav.news, description: page.hero?.text || undefined }
}

export default async function NewsIndex({ params, searchParams }: P) {
  const { lang } = await params
  const sp = await searchParams
  const t = getDictionary(lang)
  const current = Math.max(1, parseInt(sp.page || '1', 10) || 1)
  const category = NEWS_CATEGORIES.some((c) => c.value === sp.category) ? sp.category : undefined
  const where: Where = { _status: { equals: 'published' }, ...(category ? { category: { equals: category } } : {}) }
  const payload = await getClient()
  const [page, news, used] = await Promise.all([
    getGlobal('news-page', lang),
    payload.find({ collection: 'news', locale: lang, limit: 9, page: current, sort: '-publishedDate', depth: 1, where }),
    payload.find({ collection: 'news', limit: 500, depth: 0, select: { category: true }, where: { _status: { equals: 'published' } } }),
  ])
  const usedCats = NEWS_CATEGORIES.filter((c) => used.docs.some((d) => d.category === c.value))
  const link = (p: number, c = category) => {
    const q = new URLSearchParams()
    if (c) q.set('category', c)
    if (p > 1) q.set('page', String(p))
    const s = q.toString()
    return href(lang, `/news${s ? `?${s}` : ''}`)
  }

  return (
    <>
      <PageHero hero={page.hero} lang={lang} crumb={t.nav.news} />
      <section className="section section--tint">
        <div className="container">
          {usedCats.length > 1 && (
            <nav className="filter-links" aria-label="Categories">
              <Link href={link(1, '')} className={!category ? 'is-active' : undefined}>{t.allCategories}</Link>
              {usedCats.map((c) => <Link key={c.value} href={link(1, c.value)} className={category === c.value ? 'is-active' : undefined}>{c.label}</Link>)}
            </nav>
          )}
          {news.docs.length ? (
            <div className="news-list">{news.docs.map((n, i) => <NewsCard key={n.id} item={n} lang={lang} delay={i % 3} />)}</div>
          ) : (
            <div className="empty-state"><Icon name="file" /><p>{t.noNews}</p></div>
          )}
          {news.totalPages > 1 && (
            <nav className="pager" aria-label="Pagination">
              {news.hasPrevPage && <Link href={link(current - 1)}>← {t.prev}</Link>}
              {Array.from({ length: news.totalPages }, (_, i) => i + 1).map((p) =>
                p === current ? <span key={p} className="is-current" aria-current="page">{p}</span> : <Link key={p} href={link(p)}>{p}</Link>)}
              {news.hasNextPage && <Link href={link(current + 1)}>{t.next} →</Link>}
            </nav>
          )}
        </div>
      </section>
    </>
  )
}
