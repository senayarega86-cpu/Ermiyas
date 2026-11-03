import Link from 'next/link'
import React from 'react'
import type { Locale } from '@/i18n'
import { getDictionary, href } from '@/i18n'
import { getClient, getSettings, img } from '@/lib/payload'
import { Icon } from './Icon'
import { MobileMenu, type MenuGroup } from './MobileMenu'
import { LangSwitch } from './LangSwitch'
import { NavLink } from './NavLink'

export async function Header({ lang }: { lang: Locale }) {
  const t = getDictionary(lang)
  const settings = await getSettings(lang)
  const payload = await getClient()
  const [services, ticker] = await Promise.all([
    payload.find({ collection: 'services', locale: lang, limit: 9, sort: 'order', depth: 0 }),
    payload.find({ collection: 'news', locale: lang, limit: 6, sort: '-publishedDate', depth: 0, where: { featured: { equals: true }, _status: { equals: 'published' } } }),
  ])
  const logo = img(settings.logo) || '/logo.png'
  const h = (p: string) => href(lang, p)

  const groups: MenuGroup[] = [
    { key: 'about', label: t.nav.about, href: h('/about'), items: [
      { label: t.nav.aboutEccsa, href: h('/about') }, { label: t.nav.history, href: h('/about#history') },
      { label: t.nav.mission, href: h('/about#mission') }, { label: t.nav.board, href: h('/about#board') },
      { label: t.nav.management, href: h('/about#management') }, { label: t.nav.partners, href: h('/about#partners') },
    ] },
    { key: 'services', label: t.nav.services, href: h('/services'), wide: true, items: [
      ...services.docs.map((s) => ({ label: s.title, href: h(`/services#${s.slug}`) })),
      { label: t.nav.allServices, href: h('/services'), strong: true },
    ] },
    { key: 'membership', label: t.nav.membership, href: h('/membership'), items: [
      { label: t.nav.overview, href: h('/membership') }, { label: t.nav.benefits, href: h('/membership#benefits') },
      { label: t.nav.join, href: h('/membership#join') }, { label: t.nav.directory, href: h('/membership#directory') },
    ] },
    { key: 'news', label: t.nav.resources, href: h('/news'), items: [
      { label: t.nav.news, href: h('/news') }, { label: t.nav.events, href: h('/events') },
      { label: t.nav.publications, href: h('/publications') },
    ] },
  ]
  const social = [
    ['facebook', settings.facebook], ['x', settings.x], ['linkedin', settings.linkedin], ['youtube', settings.youtube], ['telegram', settings.telegram],
  ].filter(([, u]) => u) as [string, string][]
  const tel = (settings.phone || '').replace(/[^+\d]/g, '')

  return (
    <>
      <a className="skip-link" href="#main">{t.skip}</a>
      <div className="topbar">
        <div className="container">
          <div className="topbar__info">
            {settings.hours && <span><Icon name="clock" />{settings.hours}</span>}
            {settings.email && <a href={`mailto:${settings.email}`}><Icon name="mail" />{settings.email}</a>}
          </div>
          {ticker.docs.length > 0 && (
            <div className="ticker" aria-label={t.latest}>
              <span className="ticker__label"><Icon name="bolt" size={12} />{t.latest}</span>
              <div className="ticker__track">
                <div className="ticker__move">
                  {[0, 1].map((dup) => ticker.docs.map((n) => (
                    <Link key={`${dup}-${n.id}`} href={h(`/news/${n.slug}`)} aria-hidden={dup ? true : undefined} tabIndex={dup ? -1 : undefined}>{n.title}</Link>
                  )))}
                </div>
              </div>
            </div>
          )}
          <div className="topbar__end">
            <div className="topbar__social">
              {social.map(([k, u]) => <a key={k} href={u} aria-label={k} target="_blank" rel="noopener noreferrer"><Icon name={k} /></a>)}
            </div>
            <LangSwitch lang={lang} label={t.switchTo} />
          </div>
        </div>
      </div>

      <header className="header">
        <div className="container">
          <Link className="brand" href={h('/')} aria-label={settings.shortName}>
            
            <img src={logo} alt={`${settings.shortName} logo`} width={56} height={56} />
            <span className="brand__text">
              <span className="brand__name">{settings.shortName}</span>
              <span className="brand__sub">{settings.siteName}</span>
            </span>
          </Link>

          <nav className="nav" aria-label="Main">
            <ul className="nav__list">
              <li className="nav__item"><NavLink className="nav__link" href={h('/')} exact>{t.nav.home}</NavLink></li>
              {groups.map((g) => (
                <li className="nav__item" key={g.key}>
                  <NavLink className="nav__link" href={g.href} also={g.key === 'news' ? [h('/events'), h('/publications')] : undefined}>{g.label} <Icon name="chevron" /></NavLink>
                  <div className={`dropdown${g.wide ? ' dropdown--wide' : ''}`}>
                    {g.items.map((i) => <Link key={i.href + i.label} href={i.href}>{i.strong ? <strong>{i.label}</strong> : i.label}</Link>)}
                  </div>
                </li>
              ))}
              <li className="nav__item"><NavLink className="nav__link" href={h('/contact')}>{t.nav.contact}</NavLink></li>
            </ul>
          </nav>

          <div className="header__cta">
            {settings.phone && (
              <a className="header__phone" href={`tel:${tel}`}>
                <span className="header__phone-icon"><Icon name="phone" /></span>
                <span><small>{t.questions}</small><strong>{settings.phone}</strong></span>
              </a>
            )}
            {settings.ctaLabel && <Link className="btn btn--gold btn--sm" href={h(settings.ctaLink || '/membership#join')}>{settings.ctaLabel}</Link>}
            <MobileMenu
              logo={logo}
              home={{ label: t.nav.home, href: h('/') }}
              contact={{ label: t.nav.contact, href: h('/contact') }}
              groups={groups}
              cta={settings.ctaLabel ? { label: settings.ctaLabel, href: h(settings.ctaLink || '/membership#join') } : undefined}
              phone={settings.phone ? { label: settings.phone, href: `tel:${tel}` } : undefined}
              lang={lang}
              labels={{ open: t.openMenu, close: t.closeMenu, menu: t.menu, switchTo: t.switchTo }}
            />
          </div>
        </div>
      </header>
    </>
  )
}
