import type { GlobalConfig } from 'payload'
import { anyone, isLoggedIn } from '../access'
import { iconField, pageHeroField, sectionHeadFields } from '../fields'

export const MembershipPage: GlobalConfig = {
  slug: 'membership-page',
  label: 'Membership page',
  admin: { group: 'Pages' },
  access: { read: anyone, update: isLoggedIn },
  fields: [
    {
      type: 'tabs',
      tabs: [
        { label: 'Banner', fields: [pageHeroField()] },
        { label: 'Overview', name: 'overview', fields: [...sectionHeadFields(), { name: 'body', type: 'richText', localized: true }] },
        {
          label: 'Benefits', name: 'benefits',
          fields: [
            ...sectionHeadFields(),
            { name: 'items', type: 'array', fields: [{ name: 'title', type: 'text', localized: true, required: true }, { name: 'text', type: 'textarea', localized: true }, iconField('icon', 'star')] },
          ],
        },
        {
          label: 'How to join', name: 'join',
          fields: [
            ...sectionHeadFields(),
            { name: 'steps', type: 'array', fields: [{ name: 'title', type: 'text', localized: true, required: true }, { name: 'text', type: 'textarea', localized: true }] },
            { type: 'row', fields: [{ name: 'buttonLabel', type: 'text', localized: true }, { name: 'buttonUrl', type: 'text' }] },
          ],
        },
        { label: 'Directory', name: 'directory', fields: [...sectionHeadFields()] },
        {
          label: 'FAQ', name: 'faq',
          fields: [
            ...sectionHeadFields(),
            { name: 'items', type: 'array', fields: [{ name: 'question', type: 'text', localized: true, required: true }, { name: 'answer', type: 'textarea', localized: true, required: true }] },
          ],
        },
      ],
    },
  ],
}
