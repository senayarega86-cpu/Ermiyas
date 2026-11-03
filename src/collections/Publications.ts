import type { CollectionConfig } from 'payload'
import { anyone, isLoggedIn } from '../access'

export const PUBLICATION_CATEGORIES = [
  { label: 'Law & Regulation', value: 'law' },
  { label: 'Brochure', value: 'brochure' },
  { label: 'Weekly Business Report', value: 'weekly' },
  { label: 'Monthly Digital Magazine', value: 'magazine' },
  { label: 'Annual Report', value: 'annual' },
  { label: 'Research', value: 'research' },
  { label: 'Other', value: 'other' },
]

export const Publications: CollectionConfig = {
  slug: 'publications',
  labels: { singular: 'Publication (PDF)', plural: 'Publications' },
  admin: { useAsTitle: 'title', group: 'Library', defaultColumns: ['title', 'category', 'publishedDate', 'filesize'] },
  access: { read: anyone, create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn },
  defaultSort: '-publishedDate',
  upload: {
    mimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.*', 'application/vnd.ms-*'],
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'description', type: 'textarea', localized: true },
    { name: 'category', type: 'select', defaultValue: 'other', options: PUBLICATION_CATEGORIES },
    { name: 'publishedDate', type: 'date', defaultValue: () => new Date().toISOString() },
    { name: 'showOnHome', label: 'Show on home page', type: 'checkbox', defaultValue: true },
  ],
}
