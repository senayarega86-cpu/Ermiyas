import type { Metadata } from 'next'
import React from 'react'
import { getDictionary, type Locale } from '@/i18n'
import { getGlobal, getSettings } from '@/lib/payload'
import { Icon } from '@/components/Icon'
import { PageHero } from '@/components/PageHero'
import { ContactForm } from '@/components/ContactForm'

type P = { params: Promise<{ lang: Locale }>; searchParams: Promise<{ topic?: string }> }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { lang } = await params
  const page = await getGlobal('contact-page', lang)
  return { title: page.hero?.title || getDictionary(lang).nav.contact, description: page.hero?.text || undefined }
}

export default async function Contact({ params, searchParams }: P) {
  const { lang } = await params
  const { topic } = await searchParams
  const t = getDictionary(lang)
  const [page, s] = await Promise.all([getGlobal('contact-page', lang), getSettings(lang)])
  const tel = (s.phone || '').replace(/[^+\d]/g, '')
  const topics = (page.topics || []).map((x) => x.label).filter(Boolean)

  return (
    <>
      <PageHero hero={page.hero} lang={lang} crumb={t.nav.contact} />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="contact-cards">
            {s.phone && <div className="ccard reveal"><span className="ccard__icon"><Icon name="phone" /></span><h3>{t.contact.call}</h3><a href={`tel:${tel}`}>{s.phone}</a>{s.fax && <p>{t.footer.fax}: {s.fax}</p>}</div>}
            {s.email && <div className="ccard reveal" data-delay="1"><span className="ccard__icon"><Icon name="mail" /></span><h3>{t.contact.email}</h3><a href={`mailto:${s.email}`}>{s.email}</a>{s.poBox && <p>{t.footer.po} {s.poBox}</p>}</div>}
            {s.address && <div className="ccard reveal" data-delay="2"><span className="ccard__icon"><Icon name="pin" /></span><h3>{t.contact.visit}</h3><p>{s.address}</p></div>}
            {s.hours && <div className="ccard reveal" data-delay="3"><span className="ccard__icon"><Icon name="clock" /></span><h3>{t.contact.hours}</h3><p>{s.hours}</p></div>}
          </div>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container contact-layout">
          <div className="form reveal">
            <h2 style={{ fontSize: 'clamp(1.6rem,2.6vw,2.1rem)' }}>{page.formTitle}</h2>
            {page.formText && <p className="lead" style={{ marginBottom: 28 }}>{page.formText}</p>}
            <ContactForm labels={t.contact} topics={topics.length ? topics : ['General']} success={page.successMessage || '✓'} defaultTopic={topic} />
          </div>
          <div className="map reveal" data-delay="1">
            {s.mapEmbedUrl && <iframe title={s.address || 'Map'} src={s.mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />}
          </div>
        </div>
      </section>
    </>
  )
}
