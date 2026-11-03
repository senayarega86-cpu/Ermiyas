import type { GlobalConfig } from 'payload'
import { anyone, isLoggedIn } from '../access'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Site settings',
  admin: { group: 'Settings' },
  access: { read: anyone, update: isLoggedIn },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            { name: 'siteName', type: 'text', localized: true, required: true, defaultValue: 'Ethiopian Chamber of Commerce and Sectoral Associations' },
            { name: 'shortName', type: 'text', required: true, defaultValue: 'ECCSA' },
            { name: 'seoDescription', type: 'textarea', localized: true },
            { name: 'logo', type: 'upload', relationTo: 'media' },
            { name: 'footerAbout', label: 'Footer text', type: 'textarea', localized: true },
            { name: 'ctaLabel', label: 'Header button text', type: 'text', localized: true, defaultValue: 'Become a Member' },
            { name: 'ctaLink', label: 'Header button link', type: 'text', defaultValue: '/membership#join' },
          ],
        },
        {
          label: 'Contact',
          fields: [
            { name: 'phone', type: 'text', defaultValue: '+251 115 514 005' },
            { name: 'fax', type: 'text', defaultValue: '+251 115 517 699' },
            { name: 'poBox', label: 'P.O. Box', type: 'text', defaultValue: '517' },
            { name: 'email', type: 'email', defaultValue: 'info@ethiopianchamber.com' },
            { name: 'address', type: 'text', localized: true, defaultValue: 'Mexico Square, Addis Ababa, Ethiopia' },
            { name: 'hours', label: 'Office hours', type: 'text', localized: true, defaultValue: 'Mon – Fri: 8:30 AM – 5:30 PM' },
            { name: 'mapEmbedUrl', label: 'Google Maps embed link', type: 'text', admin: { description: 'Google Maps → Share → Embed a map → copy only the src="…" link.' } },
          ],
        },
        {
          label: 'Social media',
          fields: [
            { name: 'facebook', type: 'text' },
            { name: 'x', label: 'X (Twitter)', type: 'text' },
            { name: 'linkedin', type: 'text' },
            { name: 'youtube', type: 'text' },
            { name: 'telegram', type: 'text' },
          ],
        },
        {
          label: 'Footer links',
          fields: [
            {
              name: 'usefulLinks', type: 'array', labels: { singular: 'Link', plural: 'Links' },
              fields: [{ name: 'label', type: 'text', localized: true, required: true }, { name: 'url', type: 'text', required: true }],
            },
            {
              name: 'legalLinks', type: 'array', labels: { singular: 'Link', plural: 'Links' },
              fields: [{ name: 'label', type: 'text', localized: true, required: true }, { name: 'url', type: 'text', required: true }],
            },
          ],
        },
      ],
    },
  ],
}
