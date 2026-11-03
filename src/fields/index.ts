import type { Field, FieldHook, GroupField } from 'payload'

/** Icons available in the website's icon set (see src/components/Icon.tsx). */
export const ICONS = [
  'megaphone', 'globe', 'trending', 'graduation', 'chart', 'users', 'scale', 'badge', 'plane',
  'package', 'database', 'landmark', 'sprout', 'briefcase', 'factory', 'messages', 'handshake',
  'target', 'eye', 'gem', 'shield', 'star', 'bulb', 'refresh', 'building', 'file', 'calendar',
] as const

export const iconField = (name = 'icon', defaultValue = 'star', sidebar = false): Field => ({
  name,
  type: 'select',
  defaultValue,
  options: ICONS.map((i) => ({ label: i, value: i })),
  admin: { description: 'Icon shown next to this item on the website.', ...(sidebar ? { position: 'sidebar' as const } : {}) },
})

const slugify = (v: string) =>
  v
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)

/** Builds a URL slug from another field (Amharic-only titles fall back to a timestamp). */
export const slugField = (from = 'title'): Field => {
  const hook: FieldHook = ({ value, data, originalDoc }) => {
    if (typeof value === 'string' && value.trim()) return slugify(value) || value
    const src = (data?.[from] ?? originalDoc?.[from]) as unknown
    const text = typeof src === 'string' ? src : ''
    return slugify(text) || `item-${Date.now().toString(36)}`
  }
  return {
    name: 'slug',
    type: 'text',
    index: true,
    unique: true,
    admin: { position: 'sidebar', description: 'Web address of this item. Leave empty to create it automatically.' },
    hooks: { beforeValidate: [hook] },
  }
}

/** Banner at the top of an inner page. */
export const pageHeroField = (defaults: { eyebrow?: string; title?: string; text?: string } = {}): GroupField => ({
  name: 'hero',
  label: 'Page banner',
  type: 'group',
  fields: [
    { name: 'eyebrow', type: 'text', localized: true, defaultValue: defaults.eyebrow },
    { name: 'title', type: 'text', localized: true, required: true, defaultValue: defaults.title },
    { name: 'text', type: 'textarea', localized: true, defaultValue: defaults.text },
    { name: 'image', type: 'upload', relationTo: 'media', admin: { description: 'Background photo (optional).' } },
  ],
})

/** Small heading block used before most sections. */
export const sectionHeadFields = (prefix = ''): Field[] => [
  { name: `${prefix}eyebrow`, label: 'Small label', type: 'text', localized: true },
  { name: `${prefix}title`, label: 'Heading', type: 'text', localized: true },
  { name: `${prefix}lead`, label: 'Intro text', type: 'textarea', localized: true },
]

export const orderField: Field = {
  name: 'order',
  type: 'number',
  defaultValue: 0,
  admin: { position: 'sidebar', description: 'Lower numbers are shown first.' },
}
