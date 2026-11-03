'use server'
import { getClient } from '@/lib/payload'

export type FormState = { status: 'idle' | 'ok' | 'exists' | 'error' }

const str = (fd: FormData, k: string, max = 2000) => String(fd.get(k) ?? '').trim().slice(0, max)

export async function subscribe(_prev: FormState, fd: FormData): Promise<FormState> {
  const email = str(fd, 'email', 200).toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { status: 'error' }
  const payload = await getClient()
  const existing = await payload.find({ collection: 'subscribers', where: { email: { equals: email } }, limit: 1, overrideAccess: true })
  if (existing.totalDocs) return { status: 'exists' }
  await payload.create({ collection: 'subscribers', data: { email, language: str(fd, 'lang') === 'am' ? 'am' : 'en' }, overrideAccess: true })
  return { status: 'ok' }
}

export async function sendMessage(_prev: FormState, fd: FormData): Promise<FormState> {
  if (str(fd, 'website')) return { status: 'ok' } // honeypot: silently ignore bots
  const data = {
    name: str(fd, 'name', 200), email: str(fd, 'email', 200), phone: str(fd, 'phone', 60), company: str(fd, 'company', 200),
    topic: str(fd, 'topic', 120), subject: str(fd, 'subject', 300), message: str(fd, 'message', 5000),
  }
  if (!data.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || data.message.length < 5) return { status: 'error' }
  try {
    const payload = await getClient()
    await payload.create({ collection: 'contact-messages', data: { ...data, status: 'new' }, overrideAccess: true })
    return { status: 'ok' }
  } catch {
    return { status: 'error' }
  }
}
