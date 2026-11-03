import type { Metadata } from 'next'
import React from 'react'
import type { Partner, Person } from '@/payload-types'
import { getDictionary, type Locale } from '@/i18n'
import { alt, getClient, getGlobal, img } from '@/lib/payload'
import { Icon } from '@/components/Icon'
import { PageHero } from '@/components/PageHero'
import { RichText } from '@/components/RichText'

type P = { params: Promise<{ lang: Locale }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { lang } = await params
  const page = await getGlobal('about-page', lang)
  return { title: page.hero?.title || getDictionary(lang).nav.about, description: page.hero?.text || undefined }
}

const Leader = ({ p, delay }: { p: Person; delay?: number }) => (
  <div className={`leader${p.highlight ? ' leader--feature' : ''} reveal`} data-delay={delay || undefined}>
    
    {img(p.photo) && <img src={img(p.photo, 'thumb')} alt={p.name} loading="lazy" />}
    <div className="leader__info"><h3>{p.name}</h3><p>{p.position}</p></div>
  </div>
)

export default async function About({ params }: P) {
  const { lang } = await params
  const t = getDictionary(lang)
  const payload = await getClient()
  const [page, people, partners] = await Promise.all([
    getGlobal('about-page', lang),
    payload.find({ collection: 'people', locale: lang, limit: 100, sort: 'order', depth: 1 }),
    payload.find({ collection: 'partners', limit: 50, sort: 'order', depth: 1 }),
  ])
  const board = people.docs.filter((p) => p.group === 'board')
  const management = people.docs.filter((p) => p.group === 'management')
  const { overview: o, history, mission: m } = page
  const sub = [
    ['overview', t.nav.aboutEccsa], ['history', t.nav.history], ['mission', t.nav.mission],
    page.messages?.length ? ['messages', lang === 'am' ? 'መልዕክቶች' : 'Leadership Messages'] : null,
    board.length ? ['board', t.nav.board] : null, management.length ? ['management', t.nav.management] : null,
    partners.docs.length ? ['partners', t.nav.partners] : null,
  ].filter((x): x is string[] => Boolean(x && x[1]))

  return (
    <>
      <PageHero hero={page.hero} lang={lang} crumb={t.nav.about} />
      <nav className="subnav" aria-label="On this page"><div className="container">{sub.map(([id, l]) => <a key={id} href={`#${id}`}>{l}</a>)}</div></nav>

      <section className="section" id="overview">
        <div className="container split">
          <div className="reveal">
            {o?.eyebrow && <span className="eyebrow">{o.eyebrow}</span>}
            <h2>{o?.title} {o?.highlight && <span className="hl">{o.highlight}</span>}</h2>
            {o?.lead && <p className="lead">{o.lead}</p>}
            <RichText data={o?.body} />
          </div>
          <div className="media-stack reveal" data-delay="1">
            
            <div className="media-stack__main">{img(o?.imageMain) && <img src={img(o?.imageMain, 'large')} alt={alt(o?.imageMain)} loading="lazy" />}</div>
            {img(o?.imageSub) && <div className="media-stack__sub"><img src={img(o?.imageSub, 'card')} alt={alt(o?.imageSub)} loading="lazy" /></div>}
            
            {o?.badgeValue && <div className="media-stack__badge"><strong>{o.badgeValue}</strong><span>{o.badgeLabel}</span></div>}
          </div>
        </div>
      </section>

      {!!history?.items?.length && (
        <section className="section section--dark" id="history">
          <div className="container">
            <div className="section-head reveal">
              {history.eyebrow && <span className="eyebrow">{history.eyebrow}</span>}
              <h2>{history.title}</h2>
              {history.lead && <p className="lead">{history.lead}</p>}
            </div>
            <div className="timeline" style={{ gridTemplateColumns: history.items.length > 4 ? undefined : `repeat(${history.items.length}, 1fr)` }}>
              {history.items.map((it, i) => (
                <div className="tl reveal" data-delay={(i % 4) + 1} key={it.id}>
                  <span className="tl__dot" />
                  <div className="tl__year">{it.year}</div>
                  <h3>{it.title}</h3>
                  <p>{it.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section" id="mission">
        <div className="container">
          <div className="split" style={{ alignItems: 'start' }}>
            <div className="reveal">
              {m?.eyebrow && <span className="eyebrow">{m.eyebrow}</span>}
              <h2>{m?.title}</h2>
              <div className="mvv">
                {m?.mission && <div className="mvv__item"><span className="mvv__icon"><Icon name="target" /></span><div><h3>{lang === 'am' ? 'ተልዕኮ' : 'Our Mission'}</h3><p>{m.mission}</p></div></div>}
                {m?.vision && <div className="mvv__item"><span className="mvv__icon"><Icon name="eye" /></span><div><h3>{lang === 'am' ? 'ራዕይ' : 'Our Vision'}</h3><p>{m.vision}</p></div></div>}
              </div>
            </div>
            {!!m?.values?.length && (
              <div className="reveal" data-delay="1">
                {m.valuesEyebrow && <span className="eyebrow">{m.valuesEyebrow}</span>}
                <h2>{m.valuesTitle}</h2>
                <div className="values" style={{ gridTemplateColumns: 'repeat(2,1fr)', marginTop: 30 }}>
                  {m.values.map((v, i) => (
                    <div className="value" key={v.id} style={i === m.values!.length - 1 && m.values!.length % 2 ? { gridColumn: '1/-1' } : undefined}>
                      <span className="value__icon"><Icon name={v.icon || 'star'} /></span><h3>{v.title}</h3>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {!!page.messages?.length && (
        <section className="section section--tint" id="messages">
          <div className="container">
            {page.messages.map((msg, i) => {
              const p = typeof msg.person === 'object' ? (msg.person as Person) : null
              if (!p) return null
              return (
                <div className="message reveal" key={msg.id} style={i ? { marginTop: 'clamp(56px,8vw,96px)' } : undefined}>
                  
                  <div className="message__photo">{img(p.photo) && <img src={img(p.photo)} alt={p.name} loading="lazy" />}</div>
                  <div>
                    {msg.eyebrow && <span className="eyebrow">{msg.eyebrow}</span>}
                    {msg.quote && <blockquote>{msg.quote}</blockquote>}
                    <div style={{ marginTop: 20 }}><RichText data={msg.body} /></div>
                    <cite><strong>{p.name}</strong><span>{p.position}</span></cite>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {board.length > 0 && (
        <section className="section" id="board">
          <div className="container">
            <div className="section-head reveal">
              {page.board?.eyebrow && <span className="eyebrow">{page.board.eyebrow}</span>}
              <h2>{page.board?.title || t.nav.board}</h2>
              {page.board?.lead && <p className="lead">{page.board.lead}</p>}
            </div>
            <div className="leaders">{board.map((p, i) => <Leader key={p.id} p={p} delay={i % 4} />)}</div>
          </div>
        </section>
      )}

      {management.length > 0 && (
        <section className="section section--tint" id="management">
          <div className="container">
            <div className="section-head reveal">
              {page.management?.eyebrow && <span className="eyebrow">{page.management.eyebrow}</span>}
              <h2>{page.management?.title || t.nav.management}</h2>
              {page.management?.lead && <p className="lead">{page.management.lead}</p>}
            </div>
            <div className="leaders">{management.map((p, i) => <Leader key={p.id} p={p} delay={i % 4} />)}</div>
          </div>
        </section>
      )}

      {partners.docs.length > 0 && (
        <section className="section" id="partners">
          <div className="container">
            <div className="section-head reveal">
              {page.partners?.eyebrow && <span className="eyebrow">{page.partners.eyebrow}</span>}
              <h2>{page.partners?.title || t.nav.partners}</h2>
              {page.partners?.lead && <p className="lead">{page.partners.lead}</p>}
            </div>
            <div className="partner-grid">
              {partners.docs.map((p: Partner, i) => {
                const inner = <img src={img(p.logo)} alt={p.name} loading="lazy" />
                return p.url
                  ? <a key={p.id} className="partner-tile reveal" data-delay={i % 5 || undefined} href={p.url} target="_blank" rel="noopener noreferrer">{inner}</a>
                  : <div key={p.id} className="partner-tile reveal" data-delay={i % 5 || undefined}>{inner}</div>
              })}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
