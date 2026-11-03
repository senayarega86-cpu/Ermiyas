import type { GlobalConfig } from 'payload'
import { anyone, isLoggedIn } from '../access'
import { iconField, sectionHeadFields } from '../fields'

const link = (name: string, label: string) => ({
  name, label, type: 'group' as const,
  fields: [
    { type: 'row' as const, fields: [{ name: 'label', type: 'text' as const, localized: true }, { name: 'url', type: 'text' as const }] },
  ],
})

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Home page',
  admin: { group: 'Pages' },
  access: { read: anyone, update: isLoggedIn },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Banner',
          name: 'hero',
          fields: [
            { type: 'row', fields: [{ name: 'badgeLabel', type: 'text', localized: true }, { name: 'badgeText', type: 'text', localized: true }] },
            { type: 'row', fields: [{ name: 'title', type: 'text', localized: true, required: true }, { name: 'highlight', label: 'Highlighted words (gold)', type: 'text', localized: true }] },
            { name: 'lead', type: 'textarea', localized: true },
            { name: 'image', type: 'upload', relationTo: 'media' },
            link('primary', 'Main button'),
            link('secondary', 'Second button'),
          ],
        },
        {
          label: 'Numbers',
          fields: [
            {
              name: 'stats', type: 'array', maxRows: 4, labels: { singular: 'Number', plural: 'Numbers' },
              fields: [
                { type: 'row', fields: [{ name: 'value', type: 'number', required: true }, { name: 'suffix', type: 'text', admin: { description: 'e.g. + or K+' } }] },
                { name: 'label', type: 'text', localized: true, required: true },
                iconField('icon', 'building'),
              ],
            },
          ],
        },
        {
          label: 'About',
          name: 'about',
          fields: [
            ...sectionHeadFields(),
            { name: 'highlight', label: 'Highlighted words in heading', type: 'text', localized: true },
            { name: 'text', type: 'textarea', localized: true },
            { name: 'checklist', type: 'array', fields: [{ name: 'text', type: 'text', localized: true, required: true }] },
            { type: 'row', fields: [{ name: 'imageMain', type: 'upload', relationTo: 'media' }, { name: 'imageSub', type: 'upload', relationTo: 'media' }] },
            { type: 'row', fields: [{ name: 'badgeValue', type: 'text' }, { name: 'badgeLabel', type: 'text', localized: true }] },
            link('button', 'Button'),
          ],
        },
        {
          label: 'Pillars',
          name: 'pillars',
          fields: [
            ...sectionHeadFields(),
            { name: 'items', type: 'array', maxRows: 6, fields: [{ name: 'title', type: 'text', localized: true, required: true }, { name: 'text', type: 'textarea', localized: true }] },
          ],
        },
        {
          label: 'Services',
          name: 'services',
          fields: [
            ...sectionHeadFields(),
            { name: 'highlight', label: 'Highlighted word in heading', type: 'text', localized: true },
            { name: 'items', label: 'Services to show (first one is the large card)', type: 'relationship', relationTo: 'services', hasMany: true, maxRows: 9 },
            { name: 'featureImage', label: 'Photo for the large card', type: 'upload', relationTo: 'media' },
            { name: 'buttonLabel', type: 'text', localized: true },
          ],
        },
        {
          label: 'President message',
          name: 'message',
          fields: [
            { name: 'eyebrow', type: 'text', localized: true },
            { name: 'person', type: 'relationship', relationTo: 'people' },
            { name: 'quote', type: 'textarea', localized: true },
            { name: 'linkLabel', type: 'text', localized: true },
          ],
        },
        {
          label: 'News & publications',
          fields: [
            { name: 'news', type: 'group', fields: [...sectionHeadFields(), { name: 'buttonLabel', type: 'text', localized: true }] },
            { name: 'publications', type: 'group', fields: [...sectionHeadFields(), { name: 'limit', type: 'number', defaultValue: 2 }] },
          ],
        },
        {
          label: 'Membership box',
          name: 'membership',
          fields: [
            ...sectionHeadFields(),
            { name: 'steps', type: 'array', maxRows: 5, fields: [{ name: 'text', type: 'text', localized: true, required: true }] },
            link('primary', 'Main button'),
            link('secondary', 'Second button'),
          ],
        },
        {
          label: 'Partners strip',
          name: 'partners',
          fields: [{ name: 'title', type: 'text', localized: true }, { name: 'subtitle', type: 'text', localized: true }],
        },
      ],
    },
  ],
}
