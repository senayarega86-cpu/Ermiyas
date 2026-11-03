import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { News } from './collections/News'
import { Events } from './collections/Events'
import { Services } from './collections/Services'
import { People } from './collections/People'
import { Members } from './collections/Members'
import { Partners } from './collections/Partners'
import { Publications } from './collections/Publications'
import { ContactMessages } from './collections/ContactMessages'
import { Subscribers } from './collections/Subscribers'
import { Settings } from './globals/Settings'
import { HomePage } from './globals/HomePage'
import { AboutPage } from './globals/AboutPage'
import { ServicesPage } from './globals/ServicesPage'
import { MembershipPage } from './globals/MembershipPage'
import { ContactPage, EventsPage, NewsPage, PublicationsPage } from './globals/SimplePages'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: ' · ECCSA Admin',
      icons: [{ rel: 'icon', type: 'image/png', url: '/favicon.png' }],
    },
    components: {
      graphics: {
        Logo: '@/components/admin/Logo#Logo',
        Icon: '@/components/admin/Logo#Icon',
      },
    },
  },
  collections: [News, Events, Services, People, Members, Partners, Media, Publications, ContactMessages, Subscribers, Users],
  globals: [HomePage, AboutPage, ServicesPage, MembershipPage, NewsPage, EventsPage, PublicationsPage, ContactPage, Settings],
  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: 'አማርኛ (Amharic)', code: 'am' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
    // In production the database tables are created/updated automatically from src/migrations.
    prodMigrations: migrations,
  }),
  sharp,
  plugins: [],
})
