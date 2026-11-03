import type { GlobalConfig } from 'payload'
import { anyone, isLoggedIn } from '../access'
import { iconField, pageHeroField, sectionHeadFields } from '../fields'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'About page',
  admin: { group: 'Pages' },
  access: { read: anyone, update: isLoggedIn },
  fields: [
    {
      type: 'tabs',
      tabs: [
        { label: 'Banner', fields: [pageHeroField()] },
        {
          label: 'Overview', name: 'overview',
          fields: [
            ...sectionHeadFields(),
            { name: 'highlight', type: 'text', localized: true },
            { name: 'body', type: 'richText', localized: true },
            { type: 'row', fields: [{ name: 'imageMain', type: 'upload', relationTo: 'media' }, { name: 'imageSub', type: 'upload', relationTo: 'media' }] },
            { type: 'row', fields: [{ name: 'badgeValue', type: 'text' }, { name: 'badgeLabel', type: 'text', localized: true }] },
          ],
        },
        {
          label: 'History', name: 'history',
          fields: [
            ...sectionHeadFields(),
            { name: 'items', label: 'Timeline', type: 'array', fields: [{ name: 'year', type: 'text', required: true }, { name: 'title', type: 'text', localized: true, required: true }, { name: 'text', type: 'textarea', localized: true }] },
          ],
        },
        {
          label: 'Mission & values', name: 'mission',
          fields: [
            { name: 'eyebrow', type: 'text', localized: true },
            { name: 'title', type: 'text', localized: true },
            { name: 'mission', type: 'textarea', localized: true },
            { name: 'vision', type: 'textarea', localized: true },
            { name: 'valuesEyebrow', type: 'text', localized: true },
            { name: 'valuesTitle', type: 'text', localized: true },
            { name: 'values', type: 'array', fields: [{ name: 'title', type: 'text', localized: true, required: true }, iconField('icon', 'star')] },
          ],
        },
        {
          label: 'Leadership messages',
          fields: [
            {
              name: 'messages', type: 'array', labels: { singular: 'Message', plural: 'Messages' },
              fields: [
                { name: 'eyebrow', type: 'text', localized: true },
                { name: 'person', type: 'relationship', relationTo: 'people', required: true },
                { name: 'quote', type: 'textarea', localized: true },
                { name: 'body', type: 'richText', localized: true },
              ],
            },
          ],
        },
        {
          label: 'Team & partners',
          fields: [
            { name: 'board', type: 'group', fields: [...sectionHeadFields()] },
            { name: 'management', type: 'group', fields: [...sectionHeadFields()] },
            { name: 'partners', type: 'group', fields: [...sectionHeadFields()] },
          ],
        },
      ],
    },
  ],
}
