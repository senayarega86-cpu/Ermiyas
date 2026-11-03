'use client'
import React, { useMemo, useState } from 'react'

type M = { id: number | string; name: string; type: string; phone?: string | null; email?: string | null; website?: string | null }
type Labels = { search: string; all: string; showing: string; empty: string; types: Record<string, string> }

const STOP = new Set(['chamber', 'chambers', 'of', 'and', 'commerce', 'sectoral', 'association', 'associations', 'ethiopian', 'the', 'industries', 'producers', 'exporters', 'manufacturers'])
const initials = (n: string) => {
  const words = n.replace(/[^\p{L}\s]/gu, ' ').split(/\s+/).filter(Boolean)
  const key = words.filter((w) => !STOP.has(w.toLowerCase()))
  const pick = key.length ? key : words
  return pick.slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '?'
}

export function MembersDirectory({ members, labels }: { members: M[]; labels: Labels }) {
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('all')
  const types = useMemo(() => Array.from(new Set(members.map((m) => m.type))), [members])
  const shown = members.filter((m) =>
    (filter === 'all' || m.type === filter) &&
    `${m.name} ${m.phone || ''} ${m.email || ''}`.toLowerCase().includes(q.trim().toLowerCase()))

  return (
    <>
      <div className="dir-tools">
        <div className="search">
          <svg aria-hidden="true"><use href="#i-search" /></svg>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={labels.search} aria-label={labels.search} />
        </div>
        <div className="chips" role="group">
          {['all', ...types].map((tp) => (
            <button key={tp} type="button" className={`chip${filter === tp ? ' is-active' : ''}`} aria-pressed={filter === tp} onClick={() => setFilter(tp)}>
              {tp === 'all' ? labels.all : labels.types[tp] || tp}
            </button>
          ))}
        </div>
      </div>
      <p className="dir-count">{labels.showing}: <strong>{shown.length}</strong> / {members.length}</p>
      <div className="dir">
        {shown.map((m) => (
          <div className="member" data-type={m.type} key={m.id}>
            <span className="member__badge" aria-hidden="true">{initials(m.name)}</span>
            <div>
              <h3>{m.name}</h3>
              {m.phone && <p>{m.phone.split('/').map((p, i) => (
                <React.Fragment key={i}>{i > 0 && ' · '}<a href={`tel:${p.replace(/[^+\d]/g, '')}`}>{p.trim()}</a></React.Fragment>
              ))}</p>}
              {m.email && <p><a href={`mailto:${m.email}`}>{m.email}</a></p>}
              {m.website && <p><a href={m.website} target="_blank" rel="noopener noreferrer">{m.website.replace(/^https?:\/\//, '')}</a></p>}
            </div>
          </div>
        ))}
      </div>
      {shown.length === 0 && <div className="dir-empty" style={{ display: 'block' }}>{labels.empty}</div>}
    </>
  )
}
