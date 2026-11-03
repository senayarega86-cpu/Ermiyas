import type { Metadata } from 'next'
import React from 'react'
import type { Event } from '@/payload-types'
import { formatDate, getDictionary, type Locale } from '@/i18n'
import { getClient, getGlobal } from '@/lib/payload'
import { Icon } from '@/components/Icon'
import { PageHero } from '@/components/PageHero'

type P = { params: Promise<{ lang: Locale }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { lang } = await params
  const page = await getGlobal('events-page', lang)
  return { title: page.hero?.title || getDictionary(lang).nav.events, description: page.hero?.text || undefined }
}

const EventRow = ({ e, lang, past, register }: { e: Event; lang: Locale; past?: boolean; register: string }) => (
  <article className={`event reveal${past ? ' event--past' : ''}`} id={e.slug || undefined}>
    <div className="event__date">
      <strong>{formatDate(lang, e.startDate, { day: 'numeric' })}</strong>
      <span>{formatDate(lang, e.startDate, { month: 'short', year: 'numeric' })}</span>
    </div>
    <div>
      <h3>{e.title}</h3>
      <div className="event__meta">
        <span><Icon name="clock" />{formatDate(lang, e.startDate, { hour: '2-digit', minute: '2-digit', weekday: 'long' })}{e.endDate ? ` – ${formatDate(lang, e.endDate)}` : ''}</span>
        {e.location && <span><Icon name="pin" />{e.location}</span>}
      </div>
      {e.summary && <p>{e.summary}</p>}
    </div>
    {!past && e.registrationUrl && <a className="btn btn--gold btn--sm" href={e.registrationUrl} target="_blank" rel="noopener noreferrer">{register} <Icon name="arrow" /></a>}
  </article>
)

export default async function Events({ params }: P) {
  const { lang } = await params
  const t = getDictionary(lang)
  const payload = await getClient()
  const now = new Date().toISOString()
  const [page, upcoming, past] = await Promise.all([
    getGlobal('events-page', lang),
    payload.find({ collection: 'events', locale: lang, limit: 50, sort: 'startDate', where: { or: [{ startDate: { greater_than_equal: now } }, { endDate: { greater_than_equal: now } }] } }),
    payload.find({ collection: 'events', locale: lang, limit: 20, sort: '-startDate', where: { and: [{ startDate: { less_than: now } }, { or: [{ endDate: { less_than: now } }, { endDate: { exists: false } }] }] } }),
  ])

  return (
    <>
      <PageHero hero={page.hero} lang={lang} crumb={t.nav.events} />
      <section className="section section--tint">
        <div className="container">
          <div className="section-head reveal"><span className="eyebrow">{t.nav.events}</span><h2>{t.upcoming}</h2></div>
          {upcoming.docs.length ? (
            <div className="events">{upcoming.docs.map((e) => <EventRow key={e.id} e={e} lang={lang} register={t.register} />)}</div>
          ) : (
            <div className="empty-state"><Icon name="calendar" /><p>{page.emptyText}</p></div>
          )}
        </div>
      </section>
      {past.docs.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head reveal"><h2>{t.past}</h2></div>
            <div className="events">{past.docs.map((e) => <EventRow key={e.id} e={e} lang={lang} past register={t.register} />)}</div>
          </div>
        </section>
      )}
    </>
  )
}
