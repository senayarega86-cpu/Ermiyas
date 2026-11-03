import type { CollectionConfig } from 'payload'
import { isLoggedIn } from '../access'
import { slugField } from '../fields'

export const NEWS_CATEGORIES = [
  { label: 'News', value: 'news' },
  { label: 'Partnership', value: 'partnership' },
  { label: 'Workshop', value: 'workshop' },
  { label: 'Regional', value: 'regional' },
  { label: 'Announcement', value: 'announcement' },
  { label: 'Press release', value: 'press' },
]

export const News: CollectionConfig = {
  slug: 'news',
  labels: { singular: 'News article', plural: 'News' },
  admin: { useAsTitle: 'title', group: 'Content', defaultColumns: ['title', 'category', 'publishedDate', '_status'] },
  access: {
    read: ({ req }) => (req.user ? true : { _status: { equals: 'published' } }),
    create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn,
  },
  versions: { drafts: true },
  defaultSort: '-publishedDate',
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'excerpt', label: 'Short summary', type: 'textarea', localized: true },
    { name: 'image', label: 'Main photo', type: 'upload', relationTo: 'media' },
    { name: 'content', type: 'richText', localized: true },
    { name: 'gallery', type: 'upload', relationTo: 'media', hasMany: true, admin: { description: 'Extra photos (optional).' } },
    slugField('title'),
    { name: 'publishedDate', type: 'date', required: true, defaultValue: () => new Date().toISOString(), admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'category', type: 'select', defaultValue: 'news', options: NEWS_CATEGORIES, admin: { position: 'sidebar' } },
    { name: 'featured', label: 'Show in the top "Latest" ticker', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
  ],
}
