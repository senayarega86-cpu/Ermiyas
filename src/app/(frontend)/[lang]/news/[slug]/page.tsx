import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'
import { formatDate, getDictionary, href, type Locale } from '@/i18n'
import { alt, getClient, img } from '@/lib/payload'
import { Icon, Rays } from '@/components/Icon'
import { categoryLabel, NewsCard } from '@/components/NewsCard'
import { RichText } from '@/components/RichText'

type P = { params: Promise<{ lang: Locale; slug: string }> }

const getArticle = async (slug: string, lang: Locale) => {
  const payload = await getClient()
  const r = await payload.find({ collection: 'news', locale: lang, limit: 1, depth: 1, where: { slug: { equals: decodeURIComponent(slug) }, _status: { equals: 'published' } } })
  return r.docs[0]
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { lang, slug } = await params
  const a = await getArticle(slug, lang)
  if (!a) return {}
  const image = img(a.image, 'large')
  return { title: a.title, description: a.excerpt || undefined, openGraph: { title: a.title, description: a.excerpt || undefined, images: image ? [image] : undefined, type: 'article' } }
}

export default async function Article({ params }: P) {
  const { lang, slug } = await params
  const t = getDictionary(lang)
  const a = await getArticle(slug, lang)
  if (!a) notFound()
  const payload = await getClient()
  const more = await payload.find({ collection: 'news', locale: lang, limit: 3, depth: 1, sort: '-publishedDate', where: { id: { not_equals: a.id }, _status: { equals: 'published' } } })
  const url = `${process.env.NEXT_PUBLIC_SERVER_URL || ''}${href(lang, `/news/${a.slug}`)}`
  const enc = encodeURIComponent
  const gallery = (a.gallery || []).filter((g) => typeof g === 'object')

  return (
    <>
      <section className="page-hero article-hero">
        <Rays className="page-hero__rays" />
        <div className="container">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href={href(lang, '/')}>{t.nav.home}</Link><Icon name="chevron-right" />
            <Link href={href(lang, '/news')}>{t.nav.news}</Link><Icon name="chevron-right" /><span>{categoryLabel(a.category)}</span>
          </nav>
          <h1>{a.title}</h1>
          <div className="article-meta">
            <span className="tag">{categoryLabel(a.category)}</span>
            <span><Icon name="calendar" size={15} /> {formatDate(lang, a.publishedDate)}</span>
          </div>
        </div>
      </section>
      <div className="container">
        
        {img(a.image) && <div className="article-cover"><img src={img(a.image, 'large')} alt={alt(a.image, a.title)} /></div>}
        <div className="article">
          <article className="article__body">
            {a.excerpt && <p className="article__lead">{a.excerpt}</p>}
            <RichText data={a.content} />
            {gallery.length > 0 && (
              <div className="gallery">
                
                {gallery.map((g, i) => <a key={i} href={img(g)} target="_blank" rel="noopener noreferrer"><img src={img(g, 'card')} alt={alt(g)} loading="lazy" /></a>)}
              </div>
            )}
          </article>
          <aside className="article__aside">
            <div className="aside-card">
              <h3>{t.share}</h3>
              <div className="socials">
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Icon name="facebook" /></a>
                <a href={`https://x.com/intent/post?url=${enc(url)}&text=${enc(a.title)}`} target="_blank" rel="noopener noreferrer" aria-label="X"><Icon name="x" /></a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Icon name="linkedin" /></a>
                <a href={`https://t.me/share/url?url=${enc(url)}&text=${enc(a.title)}`} target="_blank" rel="noopener noreferrer" aria-label="Telegram"><Icon name="telegram" /></a>
              </div>
            </div>
            <Link className="btn btn--outline" href={href(lang, '/news')} style={{ justifyContent: 'center' }}>← {t.backToNews}</Link>
          </aside>
        </div>
      </div>
      {more.docs.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head"><h2>{t.relatedNews}</h2></div>
            <div className="news-list">{more.docs.map((n, i) => <NewsCard key={n.id} item={n} lang={lang} delay={i} />)}</div>
          </div>
        </section>
      )}
    </>
  )
}
