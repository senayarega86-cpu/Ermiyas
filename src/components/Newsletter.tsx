'use client'
import React, { useActionState } from 'react'
import { subscribe, type FormState } from '@/app/(frontend)/actions'
import type { Dictionary } from '@/i18n'

export function Newsletter({ lang, labels }: { lang: string; labels: Dictionary['newsletter'] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(subscribe, { status: 'idle' })
  return (
    <div>
      <form action={action}>
        <input type="hidden" name="lang" value={lang} />
        <label htmlFor="nl-email" className="sr-only">{labels.placeholder}</label>
        <input id="nl-email" type="email" name="email" placeholder={labels.placeholder} required autoComplete="email" />
        <button className="btn" type="submit" disabled={pending}>{labels.button} <svg aria-hidden="true"><use href="#i-arrow" /></svg></button>
      </form>
      {state.status !== 'idle' && (
        <p className={`form-msg form-msg--${state.status}`} role="status">
          {state.status === 'ok' ? labels.ok : state.status === 'exists' ? labels.exists : labels.error}
        </p>
      )}
    </div>
  )
}
