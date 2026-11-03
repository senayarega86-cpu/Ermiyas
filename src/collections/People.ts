import type { CollectionConfig } from 'payload'
import { anyone, isLoggedIn } from '../access'
import { orderField } from '../fields'

export const People: CollectionConfig = {
  slug: 'people',
  labels: { singular: 'Person', plural: 'Board & Management' },
  admin: { useAsTitle: 'name', group: 'Organization', defaultColumns: ['name', 'position', 'group', 'order'] },
  access: { read: anyone, create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn },
  defaultSort: 'order',
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    { name: 'position', type: 'text', required: true, localized: true },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    {
      name: 'group', type: 'select', required: true, defaultValue: 'board',
      options: [{ label: 'Board of Directors', value: 'board' }, { label: 'Management', value: 'management' }],
      admin: { position: 'sidebar' },
    },
    { name: 'highlight', label: 'Highlight card (e.g. President)', type: 'checkbox', admin: { position: 'sidebar' } },
    orderField,
  ],
}
