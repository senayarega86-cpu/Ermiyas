import Link from 'next/link'
import React from 'react'
import type { Partner, Person, Service } from '@/payload-types'
import { formatDate, getDictionary, href, type Locale } from '@/i18n'
import { alt, formatBytes, getClient, getGlobal, img } from '@/lib/payload'
import { Icon, Rays } from '@/components/Icon'
import { NewsCard } from '@/components/NewsCard'
import { HeroSlider, type Slide } from '@/components/HeroSlider'

export default async function Home({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params
  const t = getDictionary(lang)
  const h = (p?: string | null) => href(lang, p || '/')
  const payload = await getClient()
  const [home, news, pubs, partners] = await Promise.all([
    getGlobal('home-page', lang),
    payload.find({ collection: 'news', locale: lang, limit: 3, sort: '-publishedDate', depth: 1, where: { _status: { equals: 'published' } } }),
    payload.find({ collection: 'publications', locale: lang, limit: 4, sort: '-publishedDate', where: { showOnHome: { equals: true } } }),
    payload.find({ collection: 'partners', limit: 20, sort: 'order', depth: 1 }),
  ])
  const { hero, about, pillars, services, message, membership } = home
  const featured = (services?.items || []).filter((s): s is Service => typeof s === 'object')
  const person = typeof message?.person === 'object' ? (message.person as Person) : null
  const [lead, ...side] = news.docs
  const logos = partners.docs.map((p: Partner) => ({ name: p.name, src: img(p.logoOnDark) || img(p.logo) })).filter((p) => p.src)
  const pubLimit = home.publications?.limit || 2
  const slides: Slide[] = (hero?.slides || []).map((s, i) => ({
    id: s.id || String(i),
    image: img(s.image, 'large'),
    imageAlt: alt(s.image),
    badgeLabel: s.badgeLabel, badgeText: s.badgeText, title: s.title, highlight: s.highlight, lead: s.lead,
    primary: s.primary?.label ? { label: s.primary.label, href: h(s.primary.url) } : null,
    secondary: s.secondary?.label ? { label: s.secondary.label, href: h(s.secondary.url) } : null,
  }))
  const sliderLabels = lang === 'am'
    ? { prev: 'ቀዳሚ', next: 'ቀጣይ', goTo: 'ወደ ስላይድ', pause: 'አቁም', play: 'ቀጥል' }
    : { prev: 'Previous slide', next: 'Next slide', goTo: 'Go to slide', pause: 'Pause', play: 'Play' }

  return (
    <>
      {slides.length > 0 && <HeroSlider slides={slides} interval={hero?.interval || 7} labels={sliderLabels} />}

      {!!home.stats?.length && (
        <div className="stats-wrap">
          <div className="container">
            <div className="stats reveal" aria-label={t.stats}>
              {home.stats.map((s) => (
                <div className="stat" key={s.id}>
                  <span className="stat__icon"><Icon name={s.icon || 'star'} /></span>
                  <div className="stat__num"><span data-count={s.value}>{s.value}</span>{s.suffix && <span>{s.suffix}</span>}</div>
                  <div className="stat__label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {about?.title && (
        <section className="section">
          <div className="container split">
            <div className="media-stack reveal">
              
              <div className="media-stack__main">{img(about.imageMain, 'large') && <img src={img(about.imageMain, 'large')} alt={alt(about.imageMain)} loading="lazy" />}</div>
              {img(about.imageSub) && <div className="media-stack__sub"><img src={img(about.imageSub, 'card')} alt={alt(about.imageSub)} loading="lazy" /></div>}
              
              {about.badgeValue && <div className="media-stack__badge"><strong>{about.badgeValue}</strong><span>{about.badgeLabel}</span></div>}
              <div className="media-stack__dots" />
            </div>
            <div className="reveal" data-delay="1">
              {about.eyebrow && <span className="eyebrow">{about.eyebrow}</span>}
              <h2>{about.title} {about.highlight && <span className="hl">{about.highlight}</span>}</h2>
              {about.lead && <p className="lead">{about.lead}</p>}
              {about.text && <p>{about.text}</p>}
              {!!about.checklist?.length && <ul className="checklist">{about.checklist.map((c) => <li key={c.id}><Icon name="check" />{c.text}</li>)}</ul>}
              {about.button?.label && <Link className="btn" href={h(about.button.url)}>{about.button.label} <Icon name="arrow" /></Link>}
            </div>
          </div>
        </section>
      )}

      {!!pillars?.items?.length && (
        <section className="section section--dark">
          <Rays className="hero__rays" style={{ left: -260, right: 'auto', top: 'auto', bottom: -380, opacity: 0.08 }} />
          <div className="container">
            <div className="section-head section-head--center reveal">
              {pillars.eyebrow && <span className="eyebrow">{pillars.eyebrow}</span>}
              <h2>{pillars.title}</h2>
              {pillars.lead && <p className="lead">{pillars.lead}</p>}
            </div>
            <div className="pillars">
              {pillars.items.map((p, i) => (
                <div className="pillar reveal" data-delay={i + 1} key={p.id}>
                  <div className="pillar__num">{String(i + 1).padStart(2, '0')}</div>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {featured.length > 0 && (
        <section className="section section--tint">
          <div className="container">
            <div className="section-head section-head--split reveal">
              <div>
                {services?.eyebrow && <span className="eyebrow">{services.eyebrow}</span>}
                <h2>{services?.title} {services?.highlight && <span className="hl">{services.highlight}</span>}</h2>
              </div>
              {services?.buttonLabel && <Link className="btn btn--outline" href={h('/services')}>{services.buttonLabel} <Icon name="arrow" /></Link>}
            </div>
            <div className="services-grid services-grid--featured">
              {featured.map((s, i) => (
                <Link className="svc reveal" data-delay={i ? ((i - 1) % 4) + 1 : undefined} href={h(`/services#${s.slug}`)} key={s.id}>
                  
                  {i === 0 && img(services?.featureImage) && <div className="svc__bg"><img src={img(services?.featureImage, 'large')} alt="" loading="lazy" /></div>}
                  <span className="svc__icon"><Icon name={s.icon || 'star'} /></span>
                  <h3>{s.title}</h3>
                  <p>{s.summary}</p>
                  <span className="link-arrow">{t.learnMore} <Icon name="arrow" /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {person && message?.quote && (
        <section className="section">
          <div className="container message">
            
            <div className="message__photo reveal">{img(person.photo) && <img src={img(person.photo)} alt={person.name} loading="lazy" />}</div>
            <div className="reveal" data-delay="1">
              {message.eyebrow && <span className="eyebrow">{message.eyebrow}</span>}
              <blockquote>{message.quote}</blockquote>
              <cite><strong>{person.name}</strong><span>{person.position}</span></cite>
              {message.linkLabel && <p style={{ marginTop: 28 }}><Link className="link-arrow" href={h('/about#messages')}>{message.linkLabel} <Icon name="arrow" /></Link></p>}
            </div>
          </div>
        </section>
      )}

      {lead && (
        <section className="section section--tint">
          <div className="container">
            <div className="section-head section-head--split reveal">
              <div>
                {home.news?.eyebrow && <span className="eyebrow">{home.news.eyebrow}</span>}
                <h2>{home.news?.title}</h2>
              </div>
              <Link className="btn btn--outline" href={h('/news')}>{home.news?.buttonLabel || t.viewAll} <Icon name="arrow" /></Link>
            </div>
            <div className="news-grid">
              <NewsCard item={lead} lang={lang} variant="lead" />
              {side.length > 0 && <div className="news-grid__side">{side.map((n, i) => <NewsCard key={n.id} item={n} lang={lang} variant="row" delay={i + 1} />)}</div>}
            </div>
          </div>
        </section>
      )}

      {pubs.docs.length > 0 && (
        <section className="section" style={{ paddingBottom: 0 }}>
          <div className="container">
            <div className="section-head section-head--split reveal">
              <div>
                {home.publications?.eyebrow && <span className="eyebrow">{home.publications.eyebrow}</span>}
                <h2>{home.publications?.title}</h2>
              </div>
              <Link className="btn btn--outline" href={h('/publications')}>{t.viewAll} <Icon name="arrow" /></Link>
            </div>
            <div className="pubs">
              {pubs.docs.slice(0, pubLimit).map((p, i) => (
                <div className="pub reveal" data-delay={i % 2 || undefined} key={p.id}>
                  <div className="pub__icon">{(p.filename?.split('.').pop() || 'PDF').toUpperCase()}</div>
                  <div className="pub__body"><h3 className="eth">{p.title}</h3><p>{[p.description, formatBytes(p.filesize), formatDate(lang, p.publishedDate, { year: 'numeric', month: 'long' })].filter(Boolean).join(' · ')}</p></div>
                  {p.url && <a className="btn btn--sm" href={p.url} target="_blank" rel="noopener noreferrer"><Icon name="download" />{t.download}</a>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {membership?.title && (
        <section className="section">
          <div className="container">
            <div className="cta-band reveal">
              <Rays className="cta-band__rays" />
              <div>
                {membership.eyebrow && <span className="eyebrow">{membership.eyebrow}</span>}
                <h2>{membership.title}</h2>
                {membership.lead && <p>{membership.lead}</p>}
                <div className="hero__actions" style={{ marginTop: 28 }}>
                  {membership.primary?.label && <Link className="btn btn--gold" href={h(membership.primary.url)}>{membership.primary.label} <Icon name="arrow" /></Link>}
                  {membership.secondary?.label && <Link className="btn btn--ghost" href={h(membership.secondary.url)}>{membership.secondary.label}</Link>}
                </div>
              </div>
              {!!membership.steps?.length && <div className="cta-band__steps">{membership.steps.map((s, i) => <div className="cta-step" key={s.id}><b>{i + 1}</b>{s.text}</div>)}</div>}
            </div>
          </div>
        </section>
      )}

      {logos.length > 0 && (
        <section className="partners" aria-label={home.partners?.title || 'Partners'}>
          <div className="container partners__inner">
            <div className="partners__label"><b>{home.partners?.title}</b>{home.partners?.subtitle}</div>
            <div className="marquee">
              <div className="marquee__track">
                
                {[0, 1, 2, 3].map((d) => logos.map((l, i) => <img key={`${d}-${i}`} src={l.src} alt={d ? '' : l.name} aria-hidden={d ? true : undefined} loading="lazy" />))}
              </div>
            </div>
          </div>
        </section>
      )}
      <div style={{ height: 'clamp(72px,10vw,128px)' }} />
    </>
  )
}
