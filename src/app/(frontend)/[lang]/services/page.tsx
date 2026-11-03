import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import { getDictionary, href, type Locale } from '@/i18n'
import { getClient, getGlobal, img } from '@/lib/payload'
import { SERVICE_CATEGORIES } from '@/collections/Services'
import { Icon, Rays } from '@/components/Icon'
import { PageHero } from '@/components/PageHero'
import { RichText } from '@/components/RichText'

type P = { params: Promise<{ lang: Locale }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { lang } = await params
  const page = await getGlobal('services-page', lang)
  return { title: page.hero?.title || getDictionary(lang).nav.services, description: page.hero?.text || undefined }
}

export default async function Services({ params }: P) {
  const { lang } = await params
  const t = getDictionary(lang)
  const payload = await getClient()
  const [page, services] = await Promise.all([
    getGlobal('services-page', lang),
    payload.find({ collection: 'services', locale: lang, limit: 200, sort: 'order', depth: 0 }),
  ])
  const groups = SERVICE_CATEGORIES.map((c) => ({
    key: c.value,
    head: page.categories?.find((x) => x.category === c.value),
    fallback: c.label,
    items: services.docs.filter((s) => s.category === c.value),
  })).filter((g) => g.items.length)
  const offsets = groups.map((_, gi) => groups.slice(0, gi).reduce((sum, g) => sum + g.items.length, 0))
  const a = page.academy
  const f = page.feedback
  const ext = (u?: string | null) => (u && /^https?:/.test(u) ? { target: '_blank', rel: 'noopener noreferrer' } : {})

  return (
    <>
      <PageHero hero={page.hero} lang={lang} crumb={t.nav.services} />
      <nav className="subnav" aria-label="Service categories">
        <div className="container">
          {groups.map((g) => <a key={g.key} href={`#cat-${g.key}`}>{g.head?.eyebrow?.replace(/^\d+\s*·\s*/, '') || g.fallback}</a>)}
          {a?.enabled && a.title && <a href="#leadership-academy">{a.eyebrow || 'Academy'}</a>}
          {f?.enabled && f.title && <a href="#feedback">{f.eyebrow || 'Feedback'}</a>}
        </div>
      </nav>

      {groups.map((g, gi) => (
        <section className={`section${gi % 2 ? ' section--tint' : ''}`} id={`cat-${g.key}`} key={g.key}>
          <div className="container">
            <div className="section-head reveal">
              {g.head?.eyebrow && <span className="eyebrow">{g.head.eyebrow}</span>}
              <h2>{g.head?.title || g.fallback}</h2>
              {g.head?.lead && <p className="lead">{g.head.lead}</p>}
            </div>
            <div className="services-grid">
              {g.items.map((s, i) => {
                const n = offsets[gi] + i + 1
                return (
                  <article className="svc reveal" data-delay={i % 4 || undefined} id={s.slug || undefined} key={s.id}>
                    <span className="svc__num">{String(n).padStart(2, '0')}</span>
                    <span className="svc__icon"><Icon name={s.icon || 'star'} /></span>
                    <h3>{s.title}</h3>
                    <p>{s.summary}</p>
                    <RichText data={s.details} className="prose svc__details" />
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      ))}

      {a?.enabled && a.title && (
        <section className="section section--dark" id="leadership-academy">
          <div className="container split">
            <div className="reveal">
              {a.eyebrow && <span className="eyebrow">{a.eyebrow}</span>}
              <h2>{a.title}</h2>
              {a.lead && <p className="lead">{a.lead}</p>}
              {!!a.bullets?.length && <ul className="checklist">{a.bullets.map((b) => <li key={b.id} style={{ color: '#fff' }}><Icon name="check" />{b.text}</li>)}</ul>}
              {a.buttonLabel && <Link className="btn btn--gold" href={href(lang, a.buttonUrl || '/contact')} {...ext(a.buttonUrl)}>{a.buttonLabel} <Icon name="arrow" /></Link>}
            </div>
            <div className="media-stack reveal" data-delay="1">
              
              <div className="media-stack__main">{img(a.image) && <img src={img(a.image, 'large')} alt="" loading="lazy" />}</div>
              {a.badgeValue && <div className="media-stack__badge" style={{ background: 'var(--gold-400)' }}><strong style={{ color: 'var(--navy-900)' }}>{a.badgeValue}</strong><span style={{ color: 'var(--navy-800)' }}>{a.badgeLabel}</span></div>}
            </div>
          </div>
        </section>
      )}

      {f?.enabled && f.title && (
        <section className="section" id="feedback">
          <div className="container">
            <div className="cta-band reveal">
              <Rays className="cta-band__rays" />
              <div>
                {f.eyebrow && <span className="eyebrow">{f.eyebrow}</span>}
                <h2>{f.title}</h2>
                {f.text && <p>{f.text}</p>}
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {f.buttonLabel && <a className="btn btn--gold" href={href(lang, f.buttonUrl || '/contact')} {...ext(f.buttonUrl)}>{f.buttonLabel} <Icon name="arrow" /></a>}
                <Link className="btn btn--ghost" href={href(lang, '/contact')}>{t.nav.contact}</Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
