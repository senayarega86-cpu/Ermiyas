import type { CollectionConfig } from 'payload'
import { anyone, isLoggedIn } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Image', plural: 'Images' },
  admin: { description: 'All photos used on the website. Always add a short description.', group: 'Library', defaultColumns: ['filename', 'alt', 'updatedAt'] },
  access: { read: anyone, create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn },
  fields: [
    { name: 'alt', label: 'Description (for accessibility & Google)', type: 'text', required: true, localized: true },
  ],
  upload: {
    mimeTypes: ['image/*'],
    focalPoint: true,
    imageSizes: [
      { name: 'thumb', width: 480, height: 592, position: 'centre' },
      { name: 'card', width: 900, height: 600, position: 'centre' },
      { name: 'large', width: 1920 },
    ],
    adminThumbnail: 'thumb',
  },
}
