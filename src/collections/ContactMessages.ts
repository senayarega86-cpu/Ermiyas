import type { CollectionConfig } from 'payload'
import { isLoggedIn } from '../access'

export const ContactMessages: CollectionConfig = {
  slug: 'contact-messages',
  labels: { singular: 'Message', plural: 'Contact messages' },
  admin: { useAsTitle: 'subject', group: 'Inbox', defaultColumns: ['name', 'email', 'topic', 'status', 'createdAt'] },
  // Website visitors create messages through a server action; only staff can read them.
  access: { read: isLoggedIn, create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn },
  defaultSort: '-createdAt',
  fields: [
    { type: 'row', fields: [{ name: 'name', type: 'text', required: true }, { name: 'email', type: 'email', required: true }] },
    { type: 'row', fields: [{ name: 'phone', type: 'text' }, { name: 'company', type: 'text' }] },
    { name: 'topic', type: 'text' },
    { name: 'subject', type: 'text' },
    { name: 'message', type: 'textarea', required: true },
    {
      name: 'status', type: 'select', defaultValue: 'new', admin: { position: 'sidebar' },
      options: [{ label: 'New', value: 'new' }, { label: 'In progress', value: 'progress' }, { label: 'Answered', value: 'done' }],
    },
  ],
}
