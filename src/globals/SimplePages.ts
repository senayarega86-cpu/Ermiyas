import type { GlobalConfig } from 'payload'
import { anyone, isLoggedIn } from '../access'
import { pageHeroField } from '../fields'

const simplePage = (slug: string, label: string, extra: GlobalConfig['fields'] = []): GlobalConfig => ({
  slug,
  label,
  admin: { group: 'Pages' },
  access: { read: anyone, update: isLoggedIn },
  fields: [pageHeroField(), ...extra],
})

export const NewsPage = simplePage('news-page', 'News page')
export const EventsPage = simplePage('events-page', 'Events page', [
  { name: 'emptyText', label: 'Text when there are no upcoming events', type: 'text', localized: true },
])
export const PublicationsPage = simplePage('publications-page', 'Publications page')
export const ContactPage = simplePage('contact-page', 'Contact page', [
  { name: 'formTitle', type: 'text', localized: true },
  { name: 'formText', type: 'textarea', localized: true },
  { name: 'topics', label: 'Enquiry topics', type: 'array', fields: [{ name: 'label', type: 'text', localized: true, required: true }] },
  { name: 'successMessage', type: 'text', localized: true },
])
