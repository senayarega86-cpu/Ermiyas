'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export function LangSwitch({ lang, label, className = 'lang-switch' }: { lang: string; label: string; className?: string }) {
  const path = usePathname() || `/${lang}`
  const other = lang === 'am' ? 'en' : 'am'
  const target = path.replace(/^\/(en|am)(?=\/|$)/, `/${other}`)
  return (
    <Link className={className} href={target} hrefLang={other} lang={other} prefetch={false}>
      <svg width="14" height="14" aria-hidden="true"><use href="#i-globe" /></svg>{label}
    </Link>
  )
}
