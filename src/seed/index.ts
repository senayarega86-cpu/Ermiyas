/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Fills the database with ECCSA's current website content (from ethiopianchamber.com).
 *
 *   pnpm seed            -> only seeds an empty database
 *   pnpm seed:fresh      -> wipes website content (not admin users or inbox) and seeds again
 *
 * Creates the first administrator from SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD
 * (defaults: admin@ethiopianchamber.com and a random password printed once).
 */
import 'dotenv/config'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload, type Payload } from 'payload'
import config from '@payload-config'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const SEED = path.resolve(dirname, '../../seed')
const force = process.argv.includes('--force') || process.env.SEED_FORCE === '1'

/* ---------- rich text helper: plain lines -> Lexical JSON ----------
   "## Heading", "- bullet", anything else = paragraph */
const textNode = (text: string) => ({ type: 'text', text, format: 0, detail: 0, mode: 'normal', style: '', version: 1 })
const rich = (lines: string[]) => {
  const children: Record<string, unknown>[] = []
  let list: Record<string, unknown> | null = null
  for (const raw of lines) {
    const line = raw.trim()
    if (!line) continue
    if (line.startsWith('- ')) {
      if (!list) {
        list = { type: 'list', listType: 'bullet', tag: 'ul', start: 1, children: [], direction: 'ltr', format: '', indent: 0, version: 1 }
        children.push(list)
      }
      ;(list.children as unknown[]).push({ type: 'listitem', value: (list.children as unknown[]).length + 1, children: [textNode(line.slice(2))], direction: 'ltr', format: '', indent: 0, version: 1 })
      continue
    }
    list = null
    if (line.startsWith('## ')) children.push({ type: 'heading', tag: 'h2', children: [textNode(line.slice(3))], direction: 'ltr', format: '', indent: 0, version: 1 })
    else children.push({ type: 'paragraph', children: [textNode(line)], direction: 'ltr', format: '', indent: 0, version: 1, textFormat: 0, textStyle: '' })
  }
  return { root: { type: 'root', children, direction: 'ltr', format: '', indent: 0, version: 1 } } as never
}

async function upload(payload: Payload, rel: string, altText: string) {
  const filePath = path.join(SEED, 'images', rel)
  if (!fs.existsSync(filePath)) { console.warn('  missing image', rel); return undefined }
  const doc = await payload.create({ collection: 'media', data: { alt: altText }, filePath })
  return doc.id
}

async function wipe(payload: Payload) {
  for (const collection of ['news', 'events', 'services', 'people', 'members', 'partners', 'publications', 'media'] as const) {
    await payload.delete({ collection, where: { id: { exists: true } } })
  }
}

async function main() {
  const payload = await getPayload({ config })

  const existing = await payload.count({ collection: 'services' })
  if (existing.totalDocs > 0 && !force) {
    console.log('Database already has content. Run "pnpm seed:fresh" to replace it.')
    process.exit(0)
  }
  if (force) { console.log('Removing existing website content…'); await wipe(payload) }

  /* ---------- admin user ---------- */
  const users = await payload.count({ collection: 'users' })
  if (users.totalDocs === 0) {
    const email = process.env.SEED_ADMIN_EMAIL || 'admin@ethiopianchamber.com'
    const password = process.env.SEED_ADMIN_PASSWORD || crypto.randomBytes(9).toString('base64url')
    await payload.create({ collection: 'users', data: { email, password, name: 'ECCSA Administrator', role: 'admin' } })
    console.log(`\n  Admin user created\n  Email:    ${email}\n  Password: ${password}\n  (change it after your first login)\n`)
  }

  /* ---------- images ---------- */
  console.log('Uploading images…')
  const m = {
    logo: await upload(payload, 'logo.png', 'ECCSA logo'),
    hero: await upload(payload, 'hero.jpg', 'ECCSA leadership team at the Chamber headquarters'),
    delegation: await upload(payload, 'delegation.jpg', 'ECCSA leadership with an international business delegation'),
    partnership: await upload(payload, 'partnership.jpg', 'ECCSA partnership meeting'),
    meeting: await upload(payload, 'news/n1.jpg', 'ECCSA meeting with development partners'),
    workshop: await upload(payload, 'news/n3.jpg', 'ECCSA training workshop'),
  }

  /* ---------- services ---------- */
  console.log('Services…')
  const services: [string, string, 'advocacy' | 'trade' | 'development', string, string][] = [
    ['advocacy', 'Business Advocacy', 'advocacy', 'megaphone', 'Representing businesses in policy dialogues and advocating for a conducive business environment for business owners, investors and entrepreneurs.'],
    ['research', 'Policy Research & Analysis', 'advocacy', 'chart', 'Conducting studies on economic policies and business challenges to inform evidence-based dialogue.'],
    ['public-private-dialogue', 'Public-Private Dialogue', 'advocacy', 'messages', 'Bridging the gap between the government and the private sector.'],
    ['b2g-engagement', 'B2G Engagement', 'advocacy', 'landmark', 'Facilitating dialogue between businesses and government bodies.'],
    ['trade-promotion', 'Trade Promotion', 'trade', 'globe', 'Facilitating trade fairs, B2B meetings and international market linkages for exporters, importers, manufacturers and service providers.'],
    ['investment', 'Investment Promotion', 'trade', 'trending', 'Promoting investment opportunities for domestic and foreign investors and linking investors with local businesses.'],
    ['export', 'Export Facilitation', 'trade', 'plane', 'Supporting businesses to enter international markets.'],
    ['import', 'Import Facilitation', 'trade', 'package', 'Helping businesses source raw materials and products.'],
    ['certification', 'Business Certification', 'trade', 'badge', 'Issuing trade-related certificates for credibility and compliance.'],
    ['business-information', 'Business Information Services', 'trade', 'database', 'Providing market intelligence and business data.'],
    ['networking', 'Business Networking', 'trade', 'users', 'Creating platforms for businesses to connect and collaborate.'],
    ['sector-support', 'Sector-Specific Support', 'trade', 'factory', 'Specialized support for industries such as agriculture, manufacturing and services.'],
    ['training', 'Capacity Building Training', 'development', 'graduation', 'Training programs in business management, leadership and trade regulation.'],
    ['advisory', 'Business Advisory Services', 'development', 'briefcase', 'Guidance on business expansion, strategy and legal compliance.'],
    ['sme-support', 'SME Development Support', 'development', 'sprout', 'Helping small businesses grow through financial and technical assistance.'],
    ['arbitration', 'Arbitration & Dispute Resolution', 'development', 'scale', 'Mediating business conflicts to avoid lengthy court cases.'],
  ]
  const svc: Record<string, number> = {}
  for (const [i, [slug, title, category, icon, summary]] of services.entries()) {
    const d = await payload.create({ collection: 'services', data: { slug, title, category, icon: icon as never, summary, order: i + 1 } })
    svc[slug] = d.id
  }
  const amServices: Record<string, [string, string]> = {
    advocacy: ['የንግድ ጥብቅና', 'በፖሊሲ ውይይቶች የንግዱን ማኅበረሰብ በመወከል ለባለሀብቶችና ለሥራ ፈጣሪዎች ምቹ የንግድ ከባቢ እንዲፈጠር እንሟገታለን።'],
    'trade-promotion': ['የንግድ ማስተዋወቅ', 'የንግድ ትርዒቶችን፣ የንግድ ለንግድ ስብሰባዎችንና ዓለም አቀፍ የገበያ ትስስሮችን እናመቻቻለን።'],
    investment: ['የኢንቨስትመንት ማስተዋወቅ', 'የሀገር ውስጥና የውጭ ባለሀብቶችን ከአገር ውስጥ ንግዶች ጋር እናገናኛለን።'],
    training: ['የአቅም ግንባታ ሥልጠና', 'በንግድ አስተዳደር፣ በአመራርና በንግድ ሕጎች ላይ ሥልጠና እንሰጣለን።'],
    arbitration: ['የግልግል ዳኝነትና የክርክር አፈታት', 'ረጅም የፍርድ ቤት ሂደትን ለማስቀረት የንግድ አለመግባባቶችን እናስታርቃለን።'],
  }
  for (const [slug, [title, summary]] of Object.entries(amServices)) {
    await payload.update({ collection: 'services', id: svc[slug], locale: 'am', data: { title, summary } })
  }

  /* ---------- people ---------- */
  console.log('Board & management…')
  const people: [string, string, 'board' | 'management', string, boolean?][] = [
    ['Mr. Sebsib Abafira Abajobir', 'President', 'board', 'sebsib', true],
    ['Dr. Aynalem Abayneh Mamo', 'Vice President', 'board', 'aynalem', true],
    ['Mr. Berihu Haftu Girmay', 'Board Member', 'board', 'berihu'],
    ['Eng. Alemayehu Nigatu Kebede', 'Board Member', 'board', 'alemayehu'],
    ['Mr. Abebayehu Girma Wondimu', 'Board Member', 'board', 'abebayehu'],
    ['Mr. Esmael Ali Mohammed', 'Board Member', 'board', 'esmael'],
    ['Haji Ahmed Kelifa Zeruke', 'Board Member', 'board', 'ahmed'],
    ['Megabi Taye Leta Elema', 'Board Member', 'board', 'taye'],
    ['Mr. Sani Hassen Hussen', 'Board Member', 'board', 'sani'],
    ['Mr. Dawud Hamolo Gado', 'Board Member', 'board', 'dawud'],
    ['Mr. Anteneh Addisu Shibeshi', 'Board Member', 'board', 'anteneh'],
    ['Dr. Kenenisa Lemi', 'Secretary General', 'management', 'kenenisa', true],
    ['Helen Reta', 'Deputy Secretary General', 'management', 'helen', true],
  ]
  const amPositions: Record<string, string> = { President: 'ፕሬዚዳንት', 'Vice President': 'ምክትል ፕሬዚዳንት', 'Board Member': 'የቦርድ አባል', 'Secretary General': 'ዋና ጸሐፊ', 'Deputy Secretary General': 'ምክትል ዋና ጸሐፊ' }
  const person: Record<string, number> = {}
  for (const [i, [name, position, group, photo, highlight]] of people.entries()) {
    const photoId = await upload(payload, `team/${photo}.jpg`, name)
    const d = await payload.create({ collection: 'people', data: { name, position, group, photo: photoId, highlight: Boolean(highlight), order: i + 1 } })
    await payload.update({ collection: 'people', id: d.id, locale: 'am', data: { name, position: amPositions[position] } })
    person[photo] = d.id
  }

  /* ---------- members ---------- */
  console.log('Member directory…')
  const members: [string, 'regional' | 'city' | 'national' | 'sectoral', string][] = [
    ['Afar Chamber of Commerce and Sectoral Associations', 'regional', '+251-913-30-79-99'],
    ['Amhara Chamber of Commerce and Sectoral Associations', 'regional', '+251-582-22-17-30 / +251-582-26-40-52'],
    ['Benishangul Chamber of Commerce and Sectoral Associations', 'regional', '+251-578-75-91-64 / +251-578-75-01-06'],
    ['Gambella Chamber of Commerce and Sectoral Associations', 'regional', '+251-475-51-00-69'],
    ['Harari Chamber of Commerce and Sectoral Associations', 'regional', '+251-258-66-91-09'],
    ['Oromia Chamber of Commerce and Sectoral Associations', 'regional', '+251-115-50-98-39 / +251-115-54-92-71'],
    ['Somali Chamber of Commerce and Sectoral Associations', 'regional', '+251-257-75-73-92'],
    ['South Chamber of Commerce and Sectoral Associations', 'regional', '+251-462-20-88-98'],
    ['Tigray Chamber of Commerce and Sectoral Associations', 'regional', '+251-344-40-17-60'],
    ['Addis Ababa Chamber of Commerce and Sectoral Associations', 'city', '+251-115-51-80-55 / +251-115-51-38-14'],
    ['Dire Dawa Chamber of Commerce and Sectoral Associations', 'city', '+251-251-11-3082'],
    ['Ethiopian Chamber of Sectoral Associations', 'national', '+251-115-54-21-44 / +251-115-52-01-34'],
    ['Ethiopian Horticulture (Flower) Producers & Exporters Association', 'sectoral', '+251-116-63-67-50'],
    ['Ethiopian Leather Industries Association', 'sectoral', '+251-115-15-61-44'],
    ['Ethiopian Textile & Garment Manufacturers Association', 'sectoral', '+251-115-57-60-02'],
    ['Ethiopian Meat Exporters Association', 'sectoral', '+251-113-72-88-45'],
    ['Ethiopian Pulses, Oilseeds & Spices Processors-Exporters Association', 'sectoral', '+251-116-62-35-45'],
    ['Ethiopian Sugar & Sweets Producers Association', 'sectoral', '+251-118-33-32-92'],
  ]
  for (const [i, [name, type, phone]] of members.entries()) {
    await payload.create({ collection: 'members', data: { name, type, phone, order: i + 1 } })
  }

  /* ---------- partners ---------- */
  console.log('Partners…')
  const partners: [string, string, string | null, string][] = [
    ['TradeMark Africa', 'tmea', 'tmea-white', 'https://www.trademarkafrica.com/'],
    ['GIZ', 'giz', 'giz-white', 'https://www.giz.de/en/worldwide/336.html'],
    ['Initiative Africa', 'initiative-africa', 'initiative-africa-white', 'https://initiative-africa.org/'],
    ['CIPE — Center for International Private Enterprise', 'cipe-white', 'cipe-white', 'https://www.cipe.org/'],
    ['Pan African Chamber of Commerce and Industry', 'pacci', null, 'https://www.pacci.org/'],
    ['Irish Aid', 'irish-aid', null, 'https://www.irishaid.ie/'],
  ]
  for (const [i, [name, logo, dark, url]] of partners.entries()) {
    const logoId = await upload(payload, `partners/${logo}.png`, `${name} logo`)
    const darkId = dark ? await upload(payload, `partners/${dark}.png`, `${name} logo`) : undefined
    await payload.create({ collection: 'partners', data: { name, logo: logoId!, logoOnDark: darkId, url, order: i + 1 } })
  }

  /* ---------- publications ---------- */
  console.log('Publications…')
  const pubs: [string, string, string, string, 'law' | 'brochure'][] = [
    ['tax-administration-proclamation-amendment.pdf', 'የታክስ አስተዳደር አዋጅ ማሻሻያ', 'Tax Administration Proclamation Amendment (Amharic)', '2026-06-05', 'law'],
    ['income-tax-proclamation-brochure.pdf', 'Brochure: Income Tax Proclamation', 'A guide for businesses to the Income Tax Proclamation', '2025-08-27', 'brochure'],
  ]
  for (const [file, title, description, date, category] of pubs) {
    const fp = path.join(SEED, 'files', file)
    if (fs.existsSync(fp)) await payload.create({ collection: 'publications', data: { title, description, category, publishedDate: date, showOnHome: true }, filePath: fp })
  }

  /* ---------- news ---------- */
  console.log('News…')
  type Post = { title: string; date: string; content: string[]; image: string | null }
  const posts: Post[] = JSON.parse(fs.readFileSync(path.join(SEED, 'news.json'), 'utf8'))
  const cats = ['announcement', 'partnership', 'regional', 'regional', 'workshop', 'regional', 'news', 'news', 'regional'] as const
  for (const [i, p] of posts.entries()) {
    const imageId = p.image ? await upload(payload, p.image, p.title.slice(0, 120)) : undefined
    const excerpt = p.content.find((l) => !l.startsWith('## ') && !l.startsWith('- ') && l.length > 40) || ''
    await payload.create({
      collection: 'news',
      data: {
        title: p.title, slug: `news-${posts.length - i}`, publishedDate: p.date, category: cats[i] || 'news',
        excerpt: excerpt.length > 260 ? `${excerpt.slice(0, 257)}…` : excerpt,
        content: rich(p.content.filter((l) => l !== excerpt)), image: imageId, featured: i < 6, _status: 'published',
      },
    })
  }

  /* ---------- events (example; edit or delete in the admin) ---------- */
  console.log('Events…')
  const nextYear = new Date().getFullYear() + 1
  await payload.create({ collection: 'events', data: {
    title: '17th Ethio-Chamber International Trade Fair', slug: '17th-ethio-chamber-international-trade-fair',
    startDate: `${nextYear}-03-10T09:00:00.000Z`, endDate: `${nextYear}-03-15T17:00:00.000Z`, location: 'Addis Ababa, Ethiopia',
    summary: 'Example event: replace the dates and details in the admin panel. Exhibitors from Ethiopia and abroad meet buyers, investors and partners.',
    image: m.delegation,
  } })
  await payload.create({ collection: 'events', data: {
    title: '16th Ethio-Chamber International Trade Fair', slug: '16th-ethio-chamber-international-trade-fair',
    startDate: '2026-03-12T09:00:00.000Z', endDate: '2026-03-17T17:00:00.000Z', location: 'Addis Ababa, Ethiopia',
    summary: 'The 16th edition of ECCSA’s flagship international trade fair.',
  } })

  /* ---------- globals ---------- */
  console.log('Pages & settings…')
  await payload.updateGlobal({ slug: 'settings', data: {
    siteName: 'Ethiopian Chamber of Commerce and Sectoral Associations', shortName: 'ECCSA',
    seoDescription: "ECCSA is the voice of Ethiopia's private sector since 1947, advocating policy, promoting trade and investment and building business capacity across every region and sector.",
    logo: m.logo,
    footerAbout: 'A unified voice for the private sector, fostering inclusive economic growth through policy advocacy, business networking and capacity building, since 1947.',
    ctaLabel: 'Become a Member', ctaLink: '/membership#join',
    phone: '+251 115 514 005', fax: '+251 115 517 699', poBox: '517', email: 'info@ethiopianchamber.com',
    address: 'Mexico Square, Addis Ababa, Ethiopia', hours: 'Mon – Fri: 8:30 AM – 5:30 PM',
    mapEmbedUrl: 'https://www.google.com/maps?q=Ethiopian+Chamber+of+Commerce+Mexico+Square+Addis+Ababa&output=embed',
    facebook: 'https://web.facebook.com/EthiopianChamber', x: 'https://x.com/EthiopiaChamber',
    linkedin: 'https://www.linkedin.com/company/ethiopianchamber/', youtube: 'https://www.youtube.com/channel/UCMEZ4TO8dQiIJvk2IQkTxhA', telegram: 'https://t.me/ethiopiachamber',
    usefulLinks: [
      { label: 'Ministry of Trade & Regional Integration', url: 'http://www.motri.gov.et/' },
      { label: 'Customs Trade Portal', url: 'https://customs.erca.gov.et/trade/' },
      { label: 'Online Trade Registration & License', url: 'https://etrade.gov.et/' },
      { label: 'Ethiopian Investment Commission', url: 'https://www.investethiopia.gov.et/' },
      { label: 'Ethiopian e-Services Portal', url: 'https://www.eservices.gov.et/am' },
      { label: 'Ethiopian Business Portal', url: 'https://www.business.gov.et/business/home' },
      { label: 'Ethiopian Customs Commission', url: 'http://www.ecc.gov.et/' },
    ],
    legalLinks: [{ label: 'Terms & Conditions', url: '/en/contact' }, { label: 'Privacy Policy', url: '/en/contact' }],
  } })
  await payload.updateGlobal({ slug: 'settings', locale: 'am', data: {
    siteName: 'የኢትዮጵያ የንግድና ዘርፍ ማኅበራት ምክር ቤት', footerAbout: 'ከ1939 ዓ.ም ጀምሮ በፖሊሲ ጥብቅና፣ በንግድ ትስስርና በአቅም ግንባታ አካታች የኢኮኖሚ ዕድገትን የሚያበረታታ የግሉ ዘርፍ የጋራ ድምፅ።',
    ctaLabel: 'አባል ይሁኑ', address: 'ሜክሲኮ አደባባይ፣ አዲስ አበባ፣ ኢትዮጵያ', hours: 'ሰኞ – ዓርብ፡ 2:30 – 11:30',
  } })

  await payload.updateGlobal({ slug: 'home-page', data: {
    hero: {
      badgeLabel: 'SINCE 1947', badgeText: "The apex body of Ethiopia's private sector",
      title: "Transforming Ethiopia's", highlight: 'Private Sector',
      lead: 'ECCSA is the voice of businesses: advocating policy improvements, enhancing trade opportunities and fostering capacity-building for a thriving, globally competitive and investment-friendly economy.',
      image: m.hero, primary: { label: 'Become a Member', url: '/membership#join' }, secondary: { label: 'Explore Our Services', url: '/services' },
    },
    stats: [
      { value: 75, suffix: '+', label: 'Years serving business', icon: 'building' },
      { value: 21, suffix: '', label: 'Member chambers & associations', icon: 'users' },
      { value: 14, suffix: '+', label: 'International trade fairs organized', icon: 'globe' },
      { value: 250, suffix: '+', label: 'Certified trainers', icon: 'graduation' },
    ],
    about: {
      eyebrow: 'About ECCSA', title: 'A catalyst for', highlight: 'business success',
      lead: 'The Ethiopian Chamber of Commerce and Sectoral Associations is a 75-year-old institution representing the private sector nationwide. We are the bridge between businesses and government.',
      text: 'Committed to empowering Ethiopian enterprises, ECCSA enhances business competitiveness, expands market access, influences economic policy and builds strategic alliances for national and global success.',
      checklist: [{ text: 'Policy advocacy & public-private dialogue' }, { text: 'Trade fairs & market linkages' }, { text: 'Capacity building & training' }, { text: 'Arbitration & dispute resolution' }],
      imageMain: m.delegation, imageSub: m.meeting, badgeValue: '1947', badgeLabel: 'ESTABLISHED', button: { label: 'Discover Our Story', url: '/about' },
    },
    pillars: {
      eyebrow: 'What we do', title: 'Empowering businesses, transforming markets', lead: "Three pillars guide everything ECCSA does for Ethiopia's private sector.",
      items: [
        { title: 'Business Advocacy & Policy Support', text: 'We represent the private sector in policy dialogues, research and public-private engagements to drive economic growth.' },
        { title: 'Trade, Investment & Market Expansion', text: 'We facilitate trade fairs, investment forums and global market linkages to help businesses grow.' },
        { title: 'Capacity Building & Business Development', text: 'We provide training, networking, consultancy and dispute resolution to strengthen business competitiveness.' },
      ],
    },
    services: {
      eyebrow: 'Our services', title: 'Everything your business needs to', highlight: 'grow', buttonLabel: 'All Services', featureImage: m.hero,
      items: ['advocacy', 'trade-promotion', 'investment', 'training', 'arbitration', 'research', 'certification', 'export', 'networking'].map((s) => svc[s]) as never,
    },
    message: {
      eyebrow: 'Message from the President', person: person.sebsib, linkLabel: 'Read the full message',
      quote: 'For decades, ECCSA has played a pivotal role in representing and advocating for the Ethiopian business community, strengthening the private sector, facilitating business networking and influencing policies that create a conducive environment for economic development.',
    },
    news: { eyebrow: 'News & updates', title: 'Latest from the Chamber', buttonLabel: 'All News' },
    publications: { eyebrow: 'Resources', title: 'Publications & downloads', limit: 2 },
    membership: {
      eyebrow: 'Membership', title: "Join Ethiopia's most powerful business network",
      lead: 'Gain access to industry leaders, expert business support, market linkages, policy influence and exclusive business insights through your regional, city or sectoral chamber.',
      steps: [{ text: 'Renewed license & registration' }, { text: 'Fill out the membership form' }, { text: 'Pay the annual membership fee' }],
      primary: { label: 'How to Join', url: '/membership#join' }, secondary: { label: 'Find Your Chamber', url: '/membership#directory' },
    },
    partners: { title: 'Trusted partners', subtitle: 'Working with organizations worldwide' },
  } })
  const { id: _id, updatedAt: _u, createdAt: _c, globalType: _g, ...home } = (await payload.findGlobal({ slug: 'home-page', locale: 'en', depth: 0 })) as Record<string, any>
  await payload.updateGlobal({ slug: 'home-page', locale: 'am', data: {
    ...home,
    hero: { ...home.hero, badgeLabel: 'ከ1939 ዓ.ም ጀምሮ', badgeText: 'የኢትዮጵያ የግሉ ዘርፍ የበላይ አካል', title: 'የኢትዮጵያን', highlight: 'የግል ዘርፍ እናሳድጋለን',
      lead: 'ምክር ቤቱ የንግዱ ማኅበረሰብ ድምፅ ነው፤ የፖሊሲ ማሻሻያዎችን ይሟገታል፣ የንግድ ዕድሎችን ያሰፋል፣ ተወዳዳሪና ለኢንቨስትመንት ምቹ ኢኮኖሚ እንዲፈጠር አቅም ይገነባል።',
      primary: { label: 'አባል ይሁኑ', url: '/membership#join' }, secondary: { label: 'አገልግሎቶቻችን', url: '/services' } },
    stats: (home.stats || []).map((s: Record<string, unknown>, i: number) => ({ ...s, label: ['ዓመታት በአገልግሎት', 'አባል ምክር ቤቶችና ማኅበራት', 'ዓለም አቀፍ የንግድ ትርዒቶች', 'የተረጋገጡ አሠልጣኞች'][i] })),
    news: { ...home.news, eyebrow: 'ዜናና መረጃ', title: 'ከምክር ቤቱ አዳዲስ ዜናዎች', buttonLabel: 'ሁሉም ዜናዎች' },
  } as never })

  await payload.updateGlobal({ slug: 'about-page', data: {
    hero: { eyebrow: 'About us', title: "The voice of Ethiopia's private sector", text: 'ECCSA advocates for businesses, connects markets, supports economic growth and fosters a vibrant ecosystem through policy reform, networking, capacity building and trade promotion.', image: m.delegation },
    overview: {
      eyebrow: 'Who we are', title: 'Bridging business', highlight: 'and government',
      lead: "The Ethiopian Chamber of Commerce and Sectoral Associations (ECCSA) is the apex body representing Ethiopia's private sector nationwide.",
      body: rich([
        'ECCSA serves as the bridge between businesses and the government, advocating for policy reform, promoting trade and supporting economic development. Through our member regional chambers, city chambers and sectoral associations, we reach businesses of every size in every sector.',
        'We provide services including business networking, capacity building, market linkages and dispute resolution, fostering a vibrant and inclusive business ecosystem.',
      ]),
      imageMain: m.hero, imageSub: m.partnership, badgeValue: '75+', badgeLabel: 'YEARS OF SERVICE',
    },
    history: {
      eyebrow: 'Our history', title: "Tracing our legacy from 1947 to today's economy", lead: "Over the decades, ECCSA has evolved in response to Ethiopia's changing economic policies.",
      items: [
        { year: '1947', title: 'Establishment', text: "Ethiopia's first chamber of commerce was established under General Notice No. 90/1947, with voluntary membership." },
        { year: '1971', title: 'Reorganized with branches', text: 'Branches opened in key cities such as Asmara, Dire Dawa, Jimma, Gonder and Adama.' },
        { year: '1974', title: 'Restructured', text: 'Restructured under Proclamation No. 148/1974, making membership mandatory under the centrally planned economy.' },
        { year: '2003', title: 'Re-established', text: "Proclamation No. 341/2003 re-established the chamber system for Ethiopia's free-market economy, creating ECCSA in its current form." },
      ],
    },
    mission: {
      eyebrow: 'Purpose', title: 'Mission & vision',
      mission: 'To head the creation of an enabling business environment and capacity in which the business community plays a leading role in the economy through evidence-based dialogue and partnership.',
      vision: 'To see a dynamic chamber system proactively responsive towards sustainable private sector growth.',
      valuesEyebrow: 'Core values', valuesTitle: 'What we stand for',
      values: [{ title: 'Transparency', icon: 'eye' }, { title: 'Accountability', icon: 'shield' }, { title: 'Talent Management', icon: 'star' }, { title: 'Visibility', icon: 'megaphone' }, { title: 'Adaptation & Learning', icon: 'refresh' }],
    },
    messages: [
      { eyebrow: 'Message from the President', person: person.sebsib,
        quote: 'Welcome to the official website of the Ethiopian Chamber of Commerce and Sectoral Associations, a platform dedicated to fostering economic growth, trade and investment in Ethiopia.',
        body: rich(["For decades, ECCSA has played a pivotal role in representing and advocating for the Ethiopian business community. Our chamber's historical journey reflects a commitment to strengthening the private sector, facilitating business networking and influencing policies that create a conducive environment for economic development."]) },
      { eyebrow: 'Message from the Secretary General', person: person.kenenisa,
        quote: 'As the apex body representing the private sector, ECCSA is committed to delivering services that empower businesses and enhance their competitiveness.',
        body: rich(["This platform is designed to provide essential services, insights and opportunities for businesses, investors and stakeholders engaged in Ethiopia's economic development, from business advocacy and trade promotion to capacity building and dispute resolution."]) },
    ],
    board: { eyebrow: 'Leadership', title: 'Board of Directors' },
    management: { eyebrow: 'Management', title: 'Our core management team' },
    partners: { eyebrow: 'Our partners', title: 'Strengthening business through collaboration', lead: 'ECCSA works with local and international organizations, including government agencies, NGOs, private sector leaders and global trade organizations, so that Ethiopian businesses can grow, innovate and connect with global markets.' },
  } })

  await payload.updateGlobal({ slug: 'services-page', data: {
    hero: { eyebrow: 'Our services', title: 'Services that help Ethiopian businesses compete and grow', text: 'From the policy table to global markets, ECCSA offers services across advocacy, trade & investment, and business development.', image: m.meeting },
    categories: [
      { category: 'advocacy', eyebrow: '01 · Advocacy & Policy', title: 'A strong voice in policy-making', lead: 'We represent the private sector in policy dialogue, research and public-private engagement to drive economic growth.' },
      { category: 'trade', eyebrow: '02 · Trade & Investment', title: 'Connecting Ethiopian business to the world', lead: 'We facilitate trade fairs, investment forums and global market linkages that help businesses grow, including the Ethio-Chamber International Trade Fair.' },
      { category: 'development', eyebrow: '03 · Business Development', title: 'Building stronger, more competitive enterprises', lead: 'We provide training, consultancy and dispute resolution to strengthen business competitiveness.' },
    ],
    academy: {
      enabled: true, eyebrow: 'Business Leadership Academy', title: 'Developing the next generation of business leaders',
      lead: 'The ECCSA Business Leadership Academy delivers practical training for chamber leaders, managers and entrepreneurs, backed by a network of more than 250 certified trainers.',
      bullets: [{ text: 'Leadership & governance' }, { text: 'Business management' }, { text: 'Trade regulations' }, { text: 'Strategic planning' }],
      image: m.workshop, badgeValue: '250+', badgeLabel: 'CERTIFIED TRAINERS', buttonLabel: 'Enquire about training', buttonUrl: '/contact?topic=Training',
    },
    feedback: {
      enabled: true, eyebrow: 'Trade facilitation feedback', title: 'Tell us about your trade experience',
      text: 'Faced delays or obstacles in importing, exporting or customs? Your feedback helps ECCSA advocate for faster, simpler trade procedures.',
      buttonLabel: 'Give Feedback', buttonUrl: '/contact?topic=Trade facilitation feedback',
    },
  } })

  await payload.updateGlobal({ slug: 'membership-page', data: {
    hero: { eyebrow: 'Membership', title: "Join Ethiopia's thriving business community", text: 'Explore the network of regional, city and sectoral chambers driving business growth and opportunity across Ethiopia.', image: m.delegation },
    overview: {
      eyebrow: 'Membership overview', title: 'One network, every region and sector',
      lead: 'ECCSA unites businesses across regions and industries, fostering collaboration, market access and economic growth.',
      body: rich([
        'Based on Proclamation No. 341/2003, the members of the Ethiopian Chamber of Commerce and Sectoral Associations are:',
        '- Representatives of Regional Chambers of Commerce and Sectoral Associations',
        '- Representatives of the Chamber of National Sectoral Associations',
        '- Representatives of City Chambers of Commerce and Sectoral Associations',
        'Individual businesses become members of their city/woreda chamber of commerce and sectoral association, or of their sectoral association, which works with businesses of all sizes and represents every sector.',
      ]),
    },
    benefits: {
      eyebrow: 'Membership benefits', title: 'Why become a member?',
      lead: "Gain access to networking, market opportunities, expert consultancy, capacity-building programs and business development support to help your company thrive in Ethiopia's growing economy.",
      items: [
        { title: 'Market Access', text: 'Connect with local and international markets to expand your business reach.', icon: 'trending' },
        { title: 'Capacity Building', text: 'Access training, manuals and strategic-planning support.', icon: 'graduation' },
        { title: 'Networking', text: 'Engage with business leaders, policymakers and investors.', icon: 'users' },
        { title: 'Business Development', text: 'Receive expert consultancy on membership and business strategy.', icon: 'briefcase' },
        { title: 'Information Exchange', text: 'Stay updated with industry trends and best practices.', icon: 'refresh' },
        { title: 'Advocacy & Policy Influence', text: 'Have your voice heard in national policy dialogue through the Chamber.', icon: 'megaphone' },
      ],
    },
    join: {
      eyebrow: 'Step-by-step process', title: 'Membership requirements',
      lead: 'Each member chamber and association has its own requirements, but the most common requirements for companies are:',
      steps: [
        { title: 'Renewed license & registration', text: 'A valid, renewed trade license and business registration.' },
        { title: 'Fill out the membership form', text: 'Complete the registration form of your local chamber or sectoral association.' },
        { title: 'Pay the annual membership fee', text: 'Pay the annual fee to your chamber to activate your membership benefits.' },
      ],
      buttonLabel: 'Ask us about membership', buttonUrl: '/contact?topic=Membership',
    },
    directory: { eyebrow: 'Members', title: 'ECCSA member directory', lead: 'Find the regional, city or sectoral chamber that serves your business.' },
    faq: {
      eyebrow: 'FAQ', title: 'Frequently asked questions',
      items: [
        { question: 'Who can become a member?', answer: 'Any legally registered business can join its local city/woreda chamber or its sectoral association, which are members of ECCSA.' },
        { question: 'Where do I register?', answer: 'Register with the chamber or association that serves your region or sector. Use the directory above to find their contact details.' },
        { question: 'What does membership cost?', answer: 'Membership fees are set by each member chamber and association. Contact your chamber for the current annual fee.' },
      ],
    },
  } })

  await payload.updateGlobal({ slug: 'news-page', data: { hero: { eyebrow: 'News & updates', title: 'Latest from the Chamber', text: "News, announcements and stories from ECCSA and Ethiopia's chamber network.", image: m.meeting } } })
  await payload.updateGlobal({ slug: 'events-page', data: { hero: { eyebrow: 'Events', title: 'Trade fairs, forums & workshops', text: 'Discover where industry leaders connect, ideas flourish and opportunities are made.', image: m.delegation }, emptyText: 'There are no upcoming events at the moment. Please check back soon.' } })
  await payload.updateGlobal({ slug: 'publications-page', data: { hero: { eyebrow: 'Resources', title: 'Publications & downloads', text: 'Laws, guides, reports and magazines for the Ethiopian business community.' } } })
  await payload.updateGlobal({ slug: 'contact-page', data: {
    hero: { eyebrow: 'Contact us', title: "Let's connect: your business, our support", text: 'Questions about trade, investment, membership or advocacy? Our team is ready to help.', image: m.hero },
    formTitle: 'Send us a message', formText: "Fill in the form and the right ECCSA team will get back to you.",
    topics: [{ label: 'General enquiry' }, { label: 'Membership' }, { label: 'Trade & investment' }, { label: 'Training' }, { label: 'Arbitration' }, { label: 'Trade facilitation feedback' }, { label: 'Media & press' }],
    successMessage: 'Thank you! Your message has been received. We will reply soon.',
  } })

  console.log('\n✓ Seed complete.')
  process.exit(0)
}

try {
  await main()
} catch (e) {
  console.error(e)
  process.exit(1)
}
