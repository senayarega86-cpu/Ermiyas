'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

export function NavLink({ href, exact, also, className, children }: { href: string; exact?: boolean; also?: string[]; className?: string; children: React.ReactNode }) {
  const path = usePathname() || ''
  const match = (h: string) => (exact ? path === h : path === h || path.startsWith(h + '/'))
  const active = match(href) || (also || []).some(match)
  return <Link href={href} className={className} aria-current={active ? 'page' : undefined}>{children}</Link>
}
