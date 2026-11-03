'use client'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/** Scroll reveal, animated counters, sticky-header shadow, back-to-top and sub-nav highlighting. */
export function SiteEffects() {
  const path = usePathname()

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const header = document.querySelector('.header')
    const toTop = document.querySelector<HTMLButtonElement>('.to-top')
    const onScroll = () => {
      header?.classList.toggle('is-scrolled', window.scrollY > 8)
      toTop?.classList.toggle('is-visible', window.scrollY > 700)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    const goTop = () => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
    toTop?.addEventListener('click', goTop)

    const observers: IntersectionObserver[] = []
    const reveals = Array.from(document.querySelectorAll('.reveal:not(.is-in)'))
    if (!reduce && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target) }
      }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })
      reveals.forEach((el) => io.observe(el))
      observers.push(io)
    } else reveals.forEach((el) => el.classList.add('is-in'))

    const counters = Array.from(document.querySelectorAll<HTMLElement>('[data-count]'))
    const run = (el: HTMLElement) => {
      const end = parseFloat(el.dataset.count || '0')
      if (reduce) { el.textContent = end.toLocaleString(); return }
      const t0 = performance.now()
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / 1600)
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString()
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }
    const cio = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { run(e.target as HTMLElement); cio.unobserve(e.target) }
    }), { threshold: 0.4 })
    counters.forEach((c) => cio.observe(c))
    observers.push(cio)

    const subLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>(".subnav a[href^='#']"))
    if (subLinks.length) {
      const sio = new IntersectionObserver((entries) => entries.forEach((e) => {
        if (e.isIntersecting) subLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${e.target.id}`))
      }), { rootMargin: '-40% 0px -55% 0px' })
      subLinks.forEach((a) => { const s = document.getElementById(a.getAttribute('href')!.slice(1)); if (s) sio.observe(s) })
      observers.push(sio)
    }

    return () => {
      window.removeEventListener('scroll', onScroll)
      toTop?.removeEventListener('click', goTop)
      observers.forEach((o) => o.disconnect())
    }
  }, [path])

  return null
}
