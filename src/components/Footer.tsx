import Link from 'next/link'
import React from 'react'
import type { Locale } from '@/i18n'
import { getDictionary, href } from '@/i18n'
import { getClient, getSettings, img } from '@/lib/payload'
import { Icon, Rays } from './Icon'
import { Newsletter } from './Newsletter'

export async function Footer({ lang }: { lang: Locale }) {
  const t = getDictionary(lang)
  const s = await getSettings(lang)
  const payload = await getClient()
  const services = await payload.find({ collection: 'services', locale: lang, limit: 7, sort: 'order', depth: 0 })
  const social = [['facebook', s.facebook], ['x', s.x], ['linkedin', s.linkedin], ['youtube', s.youtube], ['telegram', s.telegram]].filter(([, u]) => u) as [string, string][]
  const tel = (s.phone || '').replace(/[^+\d]/g, '')

  return (
    <>
      <section className="section" style={{ paddingTop: 0 }} aria-label="Newsletter">
        <div className="container">
          <div className="newsletter reveal">
            <Rays className="newsletter__rays" />
            <div>
              <h2>{t.newsletter.title}</h2>
              <p>{t.newsletter.text}</p>
            </div>
            <Newsletter lang={lang} labels={t.newsletter} />
          </div>
        </div>
      </section>

      <footer className="footer">
        <Rays className="footer__mark" />
        <div className="container">
          <div className="footer__grid">
            <div className="footer__brand">
              
              <img src={img(s.logo) || '/logo.png'} alt={`${s.shortName} logo`} width={72} height={72} loading="lazy" />
              {s.footerAbout && <p>{s.footerAbout}</p>}
              <div className="socials">
                {social.map(([k, u]) => <a key={k} href={u} aria-label={k} target="_blank" rel="noopener noreferrer"><Icon name={k} /></a>)}
              </div>
            </div>
            <div>
              <h4>{t.footer.services}</h4>
              <ul>{services.docs.map((sv) => <li key={sv.id}><Link href={href(lang, `/services#${sv.slug}`)}>{sv.title}</Link></li>)}</ul>
            </div>
            <div>
              <h4>{t.footer.links}</h4>
              <ul>{(s.usefulLinks || []).map((l) => <li key={l.id}><a href={l.url} target="_blank" rel="noopener noreferrer">{l.label}</a></li>)}</ul>
            </div>
            <div>
              <h4>{t.footer.contact}</h4>
              <ul className="footer__contact">
                {s.address && <li><Icon name="pin" /><span>{s.address}</span></li>}
                {s.phone && <li><Icon name="phone" /><a href={`tel:${tel}`}>{s.phone}</a></li>}
                {s.fax && <li><Icon name="fax" /><span>{t.footer.fax}: {s.fax}</span></li>}
                {s.poBox && <li><Icon name="inbox" /><span>{t.footer.po} {s.poBox}</span></li>}
                {s.email && <li><Icon name="mail" /><a href={`mailto:${s.email}`}>{s.email}</a></li>}
                {s.hours && <li><Icon name="clock" /><span>{s.hours}</span></li>}
              </ul>
            </div>
          </div>
          <div className="footer__bottom">
            <span>© {new Date().getFullYear()} {s.siteName} ({s.shortName}). {t.footer.rights}</span>
            <nav aria-label="Legal">{(s.legalLinks || []).map((l) => <a key={l.id} href={l.url}>{l.label}</a>)}</nav>
          </div>
        </div>
      </footer>
      <button className="to-top" type="button" aria-label="Back to top"><Icon name="arrow-up" /></button>
    </>
  )
}
