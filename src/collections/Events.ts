import type { CollectionConfig } from 'payload'
import { anyone, isLoggedIn } from '../access'
import { slugField } from '../fields'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: { description: 'Trade fairs, forums and workshops. Upcoming and past events are sorted automatically by date.', useAsTitle: 'title', group: 'Content', defaultColumns: ['title', 'startDate', 'location'] },
  access: { read: anyone, create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn },
  defaultSort: '-startDate',
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    {
      type: 'row',
      fields: [
        { name: 'startDate', type: 'date', required: true, admin: { date: { pickerAppearance: 'dayAndTime' } } },
        { name: 'endDate', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
      ],
    },
    { name: 'location', type: 'text', localized: true },
    { name: 'summary', type: 'textarea', localized: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'content', type: 'richText', localized: true },
    { name: 'registrationUrl', label: 'Registration link (optional)', type: 'text' },
    slugField('title'),
  ],
}
