import type { GlobalConfig } from 'payload'
import { anyone, isLoggedIn } from '../access'
import { pageHeroField } from '../fields'
import { SERVICE_CATEGORIES } from '../collections/Services'

export const ServicesPage: GlobalConfig = {
  slug: 'services-page',
  label: 'Services page',
  admin: { group: 'Pages' },
  access: { read: anyone, update: isLoggedIn },
  fields: [
    {
      type: 'tabs',
      tabs: [
        { label: 'Banner', fields: [pageHeroField()] },
        {
          label: 'Categories',
          fields: [
            {
              name: 'categories', type: 'array', labels: { singular: 'Category', plural: 'Categories' },
              admin: { description: 'Heading shown above each group of services.' },
              fields: [
                { name: 'category', type: 'select', required: true, options: SERVICE_CATEGORIES },
                { name: 'eyebrow', type: 'text', localized: true },
                { name: 'title', type: 'text', localized: true },
                { name: 'lead', type: 'textarea', localized: true },
              ],
            },
          ],
        },
        {
          label: 'Leadership Academy', name: 'academy',
          fields: [
            { name: 'enabled', type: 'checkbox', defaultValue: true },
            { name: 'eyebrow', type: 'text', localized: true },
            { name: 'title', type: 'text', localized: true },
            { name: 'lead', type: 'textarea', localized: true },
            { name: 'bullets', type: 'array', fields: [{ name: 'text', type: 'text', localized: true, required: true }] },
            { name: 'image', type: 'upload', relationTo: 'media' },
            { type: 'row', fields: [{ name: 'badgeValue', type: 'text' }, { name: 'badgeLabel', type: 'text', localized: true }] },
            { type: 'row', fields: [{ name: 'buttonLabel', type: 'text', localized: true }, { name: 'buttonUrl', type: 'text' }] },
          ],
        },
        {
          label: 'Feedback box', name: 'feedback',
          fields: [
            { name: 'enabled', type: 'checkbox', defaultValue: true },
            { name: 'eyebrow', type: 'text', localized: true },
            { name: 'title', type: 'text', localized: true },
            { name: 'text', type: 'textarea', localized: true },
            { type: 'row', fields: [{ name: 'buttonLabel', type: 'text', localized: true }, { name: 'buttonUrl', type: 'text' }] },
          ],
        },
      ],
    },
  ],
}
