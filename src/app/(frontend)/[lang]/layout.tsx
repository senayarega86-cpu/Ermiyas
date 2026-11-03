import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import React from 'react'
import '../styles.css'
import { isLocale, LOCALES, type Locale } from '@/i18n'
import { getSettings } from '@/lib/payload'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { IconSprite } from '@/components/Icon'
import { SiteEffects } from '@/components/SiteEffects'

// Content comes from the admin panel, so always render the latest version.
export const dynamic = 'force-dynamic'

export const viewport: Viewport = { themeColor: '#0A2347' }

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const s = await getSettings(lang)
  const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  return {
    metadataBase: new URL(base),
    title: { default: `${s.shortName} — ${s.siteName}`, template: `%s · ${s.shortName}` },
    description: s.seoDescription || undefined,
    icons: { icon: '/favicon.png', apple: '/apple-touch-icon.png' },
    openGraph: { siteName: s.siteName, type: 'website', locale: lang === 'am' ? 'am_ET' : 'en_US' },
    alternates: { languages: Object.fromEntries(LOCALES.map((l) => [l, `/${l}`])) },
  }
}

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const locale = lang as Locale
  return (
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+Ethiopic:wght@400;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet" />
        <noscript><style>{'.reveal{opacity:1!important;transform:none!important}'}</style></noscript>
      </head>
      <body>
        <IconSprite />
        <Header lang={locale} />
        <main id="main">{children}</main>
        <Footer lang={locale} />
        <SiteEffects />
      </body>
    </html>
  )
}
