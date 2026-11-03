import type { CollectionConfig } from 'payload'
import { anyone, isLoggedIn } from '../access'
import { orderField } from '../fields'

export const MEMBER_TYPES = [
  { label: 'Regional Chamber', value: 'regional' },
  { label: 'City Chamber', value: 'city' },
  { label: 'National Chamber', value: 'national' },
  { label: 'Sectoral Association', value: 'sectoral' },
]

export const Members: CollectionConfig = {
  slug: 'members',
  labels: { singular: 'Member chamber', plural: 'Member directory' },
  admin: { useAsTitle: 'name', group: 'Organization', defaultColumns: ['name', 'type', 'phone'] },
  access: { read: anyone, create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn },
  defaultSort: 'order',
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    { name: 'type', type: 'select', required: true, defaultValue: 'regional', options: MEMBER_TYPES },
    {
      type: 'row',
      fields: [
        { name: 'phone', type: 'text', admin: { description: 'Separate several numbers with " / "' } },
        { name: 'email', type: 'email' },
        { name: 'website', type: 'text' },
      ],
    },
    orderField,
  ],
}
