'use client'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { LangSwitch } from './LangSwitch'

export type MenuGroup = { key: string; label: string; href: string; wide?: boolean; items: { label: string; href: string; strong?: boolean }[] }
type L = { label: string; href: string }

export function MobileMenu(props: {
  logo: string; home: L; contact: L; groups: MenuGroup[]; cta?: L; phone?: L; lang: string
  labels: { open: string; close: string; menu: string; switchTo: string }
}) {
  const [open, setOpen] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)
  const openRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (open) closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open])

  const close = () => { setOpen(false); openRef.current?.focus() }

  return (
    <>
      <button ref={openRef} className="menu-toggle" type="button" aria-label={props.labels.open} aria-expanded={open} aria-controls="drawer" onClick={() => setOpen(true)}>
        <svg aria-hidden="true"><use href="#i-menu" /></svg>
      </button>
      <div className={`drawer${open ? ' is-open' : ''}`} id="drawer" aria-hidden={!open}>
        <div className="drawer__scrim" onClick={close} />
        <div className="drawer__panel" role="dialog" aria-modal="true" aria-label={props.labels.menu} onClick={(e) => { if ((e.target as HTMLElement).closest('a')) setOpen(false) }}>
          <div className="drawer__head">
            
            <img src={props.logo} alt="" width={52} height={52} />
            <button ref={closeRef} className="drawer__close" type="button" aria-label={props.labels.close} onClick={close}>
              <svg aria-hidden="true"><use href="#i-close" /></svg>
            </button>
          </div>
          <Link className="drawer__link" href={props.home.href}>{props.home.label}</Link>
          {props.groups.map((g) => (
            <details key={g.key}>
              <summary>{g.label} <svg aria-hidden="true"><use href="#i-chevron" /></svg></summary>
              <div>{g.items.map((i) => <Link key={i.href + i.label} href={i.href}>{i.label}</Link>)}</div>
            </details>
          ))}
          <Link className="drawer__link" href={props.contact.href}>{props.contact.label}</Link>
          <div className="drawer__foot">
            {props.cta && <Link className="btn btn--gold" href={props.cta.href}>{props.cta.label}</Link>}
            {props.phone && <a className="btn btn--outline" href={props.phone.href}><svg aria-hidden="true"><use href="#i-phone" /></svg>{props.phone.label}</a>}
            <LangSwitch lang={props.lang} label={props.labels.switchTo} className="btn btn--outline" />
          </div>
        </div>
      </div>
    </>
  )
}
