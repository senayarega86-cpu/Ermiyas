import React from 'react'
import type { Payload } from 'payload'

type Props = { payload: Payload; user?: { name?: string | null; email?: string | null } | null }

const Svg = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
)
const I = {
  news: 'M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2M18 14h-8M15 18h-5M10 6h8v4h-8V6Z',
  calendar: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z',
  mail: 'M22 7l-10 6L2 7M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z',
  users: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
  building: 'M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18ZM6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2M10 6h4M10 10h4M10 14h4M10 18h4',
  plus: 'M12 5v14M5 12h14',
  home: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z',
  settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z',
  external: 'M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6',
}

function greeting() {
  const h = Number(new Intl.DateTimeFormat('en-US', { hour: 'numeric', hour12: false, timeZone: 'Africa/Addis_Ababa' }).format(new Date()))
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
}

/** Welcome banner, live numbers and quick actions at the top of the admin dashboard. */
export async function Dashboard({ payload, user }: Props) {
  const now = new Date().toISOString()
  const [news, drafts, events, messages, subscribers, members] = await Promise.all([
    payload.count({ collection: 'news', where: { _status: { equals: 'published' } } }),
    payload.count({ collection: 'news', where: { _status: { equals: 'draft' } } }),
    payload.count({ collection: 'events', where: { startDate: { greater_than_equal: now } } }),
    payload.count({ collection: 'contact-messages', where: { status: { equals: 'new' } } }),
    payload.count({ collection: 'subscribers' }),
    payload.count({ collection: 'members' }),
  ])
  const name = user?.name || user?.email?.split('@')[0] || ''
  const stats = [
    { label: 'Published news', value: news.totalDocs, note: drafts.totalDocs ? `${drafts.totalDocs} draft${drafts.totalDocs > 1 ? 's' : ''}` : 'All published', href: '/admin/collections/news', icon: I.news },
    { label: 'Upcoming events', value: events.totalDocs, note: 'From today', href: '/admin/collections/events', icon: I.calendar },
    { label: 'New messages', value: messages.totalDocs, note: messages.totalDocs ? 'Waiting for a reply' : 'Inbox is clear', href: '/admin/collections/contact-messages?where[status][equals]=new', icon: I.mail, alert: messages.totalDocs > 0 },
    { label: 'Newsletter subscribers', value: subscribers.totalDocs, note: 'Total sign-ups', href: '/admin/collections/subscribers', icon: I.users },
    { label: 'Member chambers', value: members.totalDocs, note: 'In the directory', href: '/admin/collections/members', icon: I.building },
  ]
  const actions = [
    { label: 'Write news', href: '/admin/collections/news/create', icon: I.plus, primary: true },
    { label: 'Add event', href: '/admin/collections/events/create', icon: I.calendar },
    { label: 'Edit home page', href: '/admin/globals/home-page', icon: I.home },
    { label: 'Site settings', href: '/admin/globals/settings', icon: I.settings },
  ]

  return (
    <div className="eccsa-dash">
      <section className="eccsa-hero">
        <svg className="eccsa-hero__rays" viewBox="-100 -100 200 200" aria-hidden="true">
          {Array.from({ length: 28 }, (_, i) => <rect key={i} x="34" y="-3" width="64" height="6" rx="3" transform={`rotate(${(360 / 28) * i})`} />)}
        </svg>
        <div className="eccsa-hero__text">
          <span className="eccsa-hero__eyebrow">ECCSA Website · Admin</span>
          <h1>{greeting()}{name ? `, ${name}` : ''} 👋</h1>
          <p>Manage the content of ethiopianchamber.com: news, events, services, members and every page, in English and አማርኛ.</p>
          <div className="eccsa-hero__actions">
            {actions.map((a) => (
              <a key={a.href} href={a.href} className={`eccsa-btn${a.primary ? ' eccsa-btn--gold' : ''}`}><Svg d={a.icon} />{a.label}</a>
            ))}
            <a href="/" target="_blank" rel="noopener noreferrer" className="eccsa-btn eccsa-btn--ghost"><Svg d={I.external} />View website</a>
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="eccsa-hero__logo" src="/logo.png" alt="" width={150} height={150} />
      </section>

      <section className="eccsa-stats">
        {stats.map((s) => (
          <a key={s.label} href={s.href} className={`eccsa-stat${s.alert ? ' eccsa-stat--alert' : ''}`}>
            <span className="eccsa-stat__icon"><Svg d={s.icon} /></span>
            <strong>{s.value}</strong>
            <span className="eccsa-stat__label">{s.label}</span>
            <span className="eccsa-stat__note">{s.note}</span>
          </a>
        ))}
      </section>

      <p className="eccsa-tip"><b>Tip:</b> use <b>Locale</b> (top right) to switch to <b>አማርኛ</b> and type the Amharic version of any text. Empty Amharic fields show the English text on the website.</p>
    </div>
  )
}
