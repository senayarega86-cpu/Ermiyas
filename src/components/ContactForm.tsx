'use client'
import React, { useActionState, useRef, useEffect } from 'react'
import { sendMessage, type FormState } from '@/app/(frontend)/actions'
import type { Dictionary } from '@/i18n'

export function ContactForm({ labels, topics, success, defaultTopic }: { labels: Dictionary['contact']; topics: string[]; success: string; defaultTopic?: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(sendMessage, { status: 'idle' })
  const ref = useRef<HTMLFormElement>(null)
  useEffect(() => { if (state.status === 'ok') ref.current?.reset() }, [state])

  return (
    <form ref={ref} action={action} className="form-fields">
      <div className="form__row">
        <div className="field"><label htmlFor="cf-name">{labels.name} *</label><input id="cf-name" name="name" required autoComplete="name" /></div>
        <div className="field"><label htmlFor="cf-email">{labels.emailField} *</label><input id="cf-email" name="email" type="email" required autoComplete="email" /></div>
      </div>
      <div className="form__row">
        <div className="field"><label htmlFor="cf-phone">{labels.phone}</label><input id="cf-phone" name="phone" type="tel" autoComplete="tel" /></div>
        <div className="field"><label htmlFor="cf-company">{labels.company}</label><input id="cf-company" name="company" autoComplete="organization" /></div>
      </div>
      <div className="form__row">
        <div className="field">
          <label htmlFor="cf-topic">{labels.topic}</label>
          <select id="cf-topic" name="topic" defaultValue={defaultTopic && topics.includes(defaultTopic) ? defaultTopic : topics[0]}>
            {topics.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="field"><label htmlFor="cf-subject">{labels.subject}</label><input id="cf-subject" name="subject" /></div>
      </div>
      <div className="field"><label htmlFor="cf-message">{labels.message} *</label><textarea id="cf-message" name="message" required minLength={5} /></div>
      {/* Honeypot field to stop spam bots */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" />
      <button className="btn" type="submit" disabled={pending}>{pending ? labels.sending : labels.send} <svg aria-hidden="true"><use href="#i-arrow" /></svg></button>
      {state.status === 'ok' && <p className="form-msg form-msg--ok" role="status">{success}</p>}
      {state.status === 'error' && <p className="form-msg form-msg--error" role="alert">{labels.error}</p>}
      <p className="form__note">{labels.privacy}</p>
    </form>
  )
}
