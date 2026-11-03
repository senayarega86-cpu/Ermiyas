import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminField, isAdminOrSelf } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Admin user', plural: 'Admin users' },
  admin: { useAsTitle: 'email', defaultColumns: ['name', 'email', 'role'], group: 'Settings' },
  auth: true,
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: isAdminOrSelf,
    update: isAdminOrSelf,
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      saveToJWT: true,
      access: { create: isAdminField, update: isAdminField },
      options: [
        { label: 'Administrator (full access)', value: 'admin' },
        { label: 'Editor (content only)', value: 'editor' },
      ],
    },
  ],
}
