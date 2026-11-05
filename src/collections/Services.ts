import type { CollectionConfig } from 'payload'
import { anyone, isLoggedIn } from '../access'
import { iconField, orderField, slugField } from '../fields'

export const SERVICE_CATEGORIES = [
  { label: 'Advocacy & Policy', value: 'advocacy' },
  { label: 'Trade & Investment', value: 'trade' },
  { label: 'Business Development', value: 'development' },
]

export const Services: CollectionConfig = {
  slug: 'services',
  admin: { description: 'The services shown on the Services page, in the menu and in the footer. Use "Order" to change the sequence.', useAsTitle: 'title', group: 'Content', defaultColumns: ['title', 'category', 'order'] },
  access: { read: anyone, create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn },
  defaultSort: 'order',
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'summary', label: 'Short description', type: 'textarea', required: true, localized: true },
    { name: 'details', label: 'Full description (optional)', type: 'richText', localized: true },
    { name: 'category', type: 'select', required: true, defaultValue: 'advocacy', options: SERVICE_CATEGORIES, admin: { position: 'sidebar' } },
    iconField('icon', 'star', true),
    orderField,
    slugField('title'),
  ],
}
