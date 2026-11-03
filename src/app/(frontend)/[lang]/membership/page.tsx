import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import { getDictionary, href, type Locale } from '@/i18n'
import { getClient, getGlobal } from '@/lib/payload'
import { MEMBER_TYPES } from '@/collections/Members'
import { Icon } from '@/components/Icon'
import { PageHero } from '@/components/PageHero'
import { RichText } from '@/components/RichText'
import { MembersDirectory } from '@/components/MembersDirectory'

type P = { params: Promise<{ lang: Locale }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { lang } = await params
  const page = await getGlobal('membership-page', lang)
  return { title: page.hero?.title || getDictionary(lang).nav.membership, description: page.hero?.text || undefined }
}

export default async function Membership({ params }: P) {
  const { lang } = await params
  const t = getDictionary(lang)
  const payload = await getClient()
  const [page, members] = await Promise.all([
    getGlobal('membership-page', lang),
    payload.find({ collection: 'members', locale: lang, limit: 500, sort: 'order', depth: 0 }),
  ])
  const counts = MEMBER_TYPES.map((m) => ({ key: m.value, label: t.members.types[m.value], n: members.docs.filter((d) => d.type === m.value).length })).filter((c) => c.n)
  const { overview: o, benefits: b, join: j, directory: d, faq } = page

  return (
    <>
      <PageHero hero={page.hero} lang={lang} crumb={t.nav.membership}>
        <div className="hero__actions" style={{ marginTop: 32 }}>
          <a className="btn btn--gold" href="#join">{t.nav.join} <Icon name="arrow" /></a>
          <a className="btn btn--ghost" href="#directory">{t.nav.directory}</a>
        </div>
      </PageHero>
      <nav className="subnav" aria-label="On this page">
        <div className="container">
          <a href="#overview">{t.nav.overview}</a>
          {!!b?.items?.length && <a href="#benefits">{t.nav.benefits}</a>}
          {!!j?.steps?.length && <a href="#join">{t.nav.join}</a>}
          <a href="#directory">{t.nav.directory}</a>
          {!!faq?.items?.length && <a href="#faq">FAQ</a>}
        </div>
      </nav>

      <section className="section" id="overview">
        <div className="container">
          <div className="split" style={{ alignItems: 'start' }}>
            <div className="reveal">
              {o?.eyebrow && <span className="eyebrow">{o.eyebrow}</span>}
              <h2>{o?.title}</h2>
              {o?.lead && <p className="lead">{o.lead}</p>}
            </div>
            <div className="reveal" data-delay="1"><RichText data={o?.body} /></div>
          </div>
          {counts.length > 0 && (
            <div className="member-types" style={{ marginTop: 'clamp(40px,5vw,64px)' }}>
              {counts.map((c, i) => <div className="mtype reveal" data-delay={i || undefined} key={c.key}><strong data-count={c.n}>{c.n}</strong><span>{c.label}</span></div>)}
            </div>
          )}
        </div>
      </section>

      {!!b?.items?.length && (
        <section className="section section--tint" id="benefits">
          <div className="container">
            <div className="section-head reveal">
              {b.eyebrow && <span className="eyebrow">{b.eyebrow}</span>}
              <h2>{b.title}</h2>
              {b.lead && <p className="lead">{b.lead}</p>}
            </div>
            <div className="benefits">
              {b.items.map((it, i) => (
                <div className="benefit reveal" data-delay={i % 3 || undefined} key={it.id}>
                  <span className="benefit__icon"><Icon name={it.icon || 'star'} /></span>
                  <div><h3>{it.title}</h3><p>{it.text}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {!!j?.steps?.length && (
        <section className="section section--dark" id="join">
          <div className="container">
            <div className="section-head reveal">
              {j.eyebrow && <span className="eyebrow">{j.eyebrow}</span>}
              <h2>{j.title}</h2>
              {j.lead && <p className="lead">{j.lead}</p>}
            </div>
            <div className="steps">
              {j.steps.map((s, i) => <div className="step reveal" data-delay={i + 1} key={s.id}><h3>{s.title}</h3><p>{s.text}</p></div>)}
            </div>
            {j.buttonLabel && <p style={{ marginTop: 40 }}><Link className="btn btn--gold" href={href(lang, j.buttonUrl || '/contact')}>{j.buttonLabel} <Icon name="arrow" /></Link></p>}
          </div>
        </section>
      )}

      <section className="section" id="directory">
        <div className="container">
          <div className="section-head reveal">
            {d?.eyebrow && <span className="eyebrow">{d.eyebrow}</span>}
            <h2>{d?.title || t.nav.directory}</h2>
            {d?.lead && <p className="lead">{d.lead}</p>}
          </div>
          <MembersDirectory
            members={members.docs.map((m) => ({ id: m.id, name: m.name, type: m.type, phone: m.phone, email: m.email, website: m.website }))}
            labels={t.members}
          />
        </div>
      </section>

      {!!faq?.items?.length && (
        <section className="section section--tint" id="faq">
          <div className="container">
            <div className="section-head section-head--center reveal">
              {faq.eyebrow && <span className="eyebrow">{faq.eyebrow}</span>}
              <h2>{faq.title}</h2>
            </div>
            <div className="faq">
              {faq.items.map((q) => (
                <details key={q.id} className="reveal"><summary>{q.question}<Icon name="plus" /></summary><p>{q.answer}</p></details>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
