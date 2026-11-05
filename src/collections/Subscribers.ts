import type { CollectionConfig } from 'payload'
import { isLoggedIn } from '../access'

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  labels: { singular: 'Newsletter subscriber', plural: 'Newsletter subscribers' },
  admin: { description: 'Emails of people who signed up for the newsletter.', useAsTitle: 'email', group: 'Inbox', defaultColumns: ['email', 'language', 'createdAt'] },
  access: { read: isLoggedIn, create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn },
  defaultSort: '-createdAt',
  fields: [
    { name: 'email', type: 'email', required: true, unique: true },
    { name: 'language', type: 'select', defaultValue: 'en', options: [{ label: 'English', value: 'en' }, { label: 'Amharic', value: 'am' }] },
  ],
}
