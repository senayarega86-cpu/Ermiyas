'use client'
import Link from 'next/link'
import React, { useCallback, useEffect, useRef, useState } from 'react'

export type Slide = {
  id: string
  image?: string
  imageAlt?: string
  badgeLabel?: string | null
  badgeText?: string | null
  title: string
  highlight?: string | null
  lead?: string | null
  primary?: { label: string; href: string } | null
  secondary?: { label: string; href: string } | null
}

type Labels = { prev: string; next: string; goTo: string; pause: string; play: string }

export function HeroSlider({ slides, interval = 7, labels }: { slides: Slide[]; interval?: number; labels: Labels }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [userPaused, setUserPaused] = useState(false)
  const [reduced, setReduced] = useState(false)
  const touchX = useRef<number | null>(null)
  const count = slides.length
  const ms = Math.max(3, interval) * 1000

  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count])
  const next = useCallback(() => go(index + 1), [go, index])
  const prev = useCallback(() => go(index - 1), [go, index])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const running = count > 1 && !paused && !userPaused && !reduced
  useEffect(() => {
    if (!running) return
    const t = window.setTimeout(next, ms)
    return () => window.clearTimeout(t)
  }, [running, next, ms, index])

  // Pause while the tab is hidden
  useEffect(() => {
    const onVis = () => setPaused(document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); next() }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev() }
  }

  return (
    <section
      className={`hero hero-slider${running ? ' is-running' : ''}`}
      aria-roledescription="carousel"
      aria-label="Highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={onKey}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return
        const dx = e.changedTouches[0].clientX - touchX.current
        if (Math.abs(dx) > 50) (dx < 0 ? next : prev)()
        touchX.current = null
      }}
      style={{ '--slide-ms': `${ms}ms` } as React.CSSProperties}
    >
      <div className="hero-slider__bgs" aria-hidden="true">
        {slides.map((s, i) => (
          <div key={s.id} className={`hero-slider__bg${i === index ? ' is-active' : ''}`}>
            {s.image && <img src={s.image} alt="" fetchPriority={i === 0 ? 'high' : 'low'} loading={i === 0 ? 'eager' : 'lazy'} />}
          </div>
        ))}
      </div>
      <svg className="hero__rays" aria-hidden="true"><use href="#rays" /></svg>

      <div className="container">
        <div className="hero-slider__slides" aria-live={running ? 'off' : 'polite'}>
          {slides.map((s, i) => (
            <div
              key={s.id}
              className={`hero__content hero-slider__slide${i === index ? ' is-active' : ''}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${count}`}
              aria-hidden={i !== index}
              inert={i !== index ? true : undefined}
            >
              {(s.badgeLabel || s.badgeText) && <span className="hero__badge">{s.badgeLabel && <b>{s.badgeLabel}</b>}{s.badgeText}</span>}
              {i === 0 ? (
                <h1>{s.title} {s.highlight && <span className="hl-gold">{s.highlight}</span>}</h1>
              ) : (
                <h2 className="hero-slider__title">{s.title} {s.highlight && <span className="hl-gold">{s.highlight}</span>}</h2>
              )}
              {s.lead && <p className="hero__lead">{s.lead}</p>}
              <div className="hero__actions">
                {s.primary?.label && (
                  <Link className="btn btn--gold" href={s.primary.href}>
                    {s.primary.label} <svg aria-hidden="true"><use href="#i-arrow" /></svg>
                  </Link>
                )}
                {s.secondary?.label && <Link className="btn btn--ghost" href={s.secondary.href}>{s.secondary.label}</Link>}
              </div>
            </div>
          ))}
        </div>

        {count > 1 && (
          <div className="hero-slider__controls">
            <div className="hero-slider__dots" role="tablist" aria-label={labels.goTo}>
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`${labels.goTo} ${i + 1}`}
                  className={`hero-slider__dot${i === index ? ' is-active' : ''}`}
                  onClick={() => go(i)}
                >
                  <span className="hero-slider__num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="hero-slider__bar"><span key={`${index}-${running}`} /></span>
                </button>
              ))}
            </div>
            <div className="hero-slider__arrows">
              <button type="button" className="hero-slider__arrow" aria-label={userPaused ? labels.play : labels.pause} onClick={() => setUserPaused((v) => !v)}>
                {userPaused
                  ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
                  : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3v14H7zM14 5h3v14h-3z" fill="currentColor" /></svg>}
              </button>
              <button type="button" className="hero-slider__arrow" aria-label={labels.prev} onClick={prev}>
                <svg aria-hidden="true" style={{ transform: 'rotate(180deg)' }}><use href="#i-arrow" /></svg>
              </button>
              <button type="button" className="hero-slider__arrow" aria-label={labels.next} onClick={next}>
                <svg aria-hidden="true"><use href="#i-arrow" /></svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
