import type { CollectionConfig } from 'payload'
import { anyone, isLoggedIn } from '../access'
import { orderField } from '../fields'

export const Partners: CollectionConfig = {
  slug: 'partners',
  admin: { useAsTitle: 'name', group: 'Organization', defaultColumns: ['name', 'url', 'order'] },
  access: { read: anyone, create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn },
  defaultSort: 'order',
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'logo', label: 'Logo (for white background)', type: 'upload', relationTo: 'media', required: true },
    { name: 'logoOnDark', label: 'White logo (for dark background, optional)', type: 'upload', relationTo: 'media' },
    { name: 'url', label: 'Website', type: 'text' },
    orderField,
  ],
}
