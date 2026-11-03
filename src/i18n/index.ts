export const LOCALES = ['en', 'am'] as const
export type Locale = (typeof LOCALES)[number]
export const isLocale = (v: string): v is Locale => (LOCALES as readonly string[]).includes(v)

/** Builds a link that keeps the current language, e.g. href('am', '/about') -> /am/about */
export const href = (lang: Locale, path = '/') => {
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path
  const clean = path.startsWith('/') ? path : `/${path}`
  return `/${lang}${clean === '/' ? '' : clean}`
}

const en = {
  langName: 'English',
  switchTo: 'አማርኛ',
  nav: {
    home: 'Home', about: 'About', services: 'Services', membership: 'Membership', resources: 'News & Resources',
    contact: 'Contact', news: 'Latest News', events: 'Events', publications: 'Publications & Downloads',
    aboutEccsa: 'About ECCSA', history: 'Our History', mission: 'Mission, Vision & Values', board: 'Board of Directors',
    management: 'Management', partners: 'Our Partners', allServices: 'View all services →',
    overview: 'Membership Overview', benefits: 'Member Benefits', join: 'How to Join', directory: 'Member Directory',
  },
  questions: 'Have any questions?',
  latest: 'Latest',
  skip: 'Skip to content',
  menu: 'Menu', openMenu: 'Open menu', closeMenu: 'Close menu',
  readMore: 'Read more', learnMore: 'Learn more', download: 'Download', viewAll: 'View all',
  backToNews: 'Back to news', relatedNews: 'More news', share: 'Share',
  allCategories: 'All', page: 'Page', of: 'of', prev: 'Previous', next: 'Next',
  noNews: 'No news has been published yet.',
  upcoming: 'Upcoming events', past: 'Past events', register: 'Register', location: 'Location',
  noPublications: 'No publications yet.',
  newsletter: { title: "Stay ahead of Ethiopia's business news", text: 'Get ECCSA news, trade opportunities, events and policy updates in your inbox.', placeholder: 'Your email address', button: 'Subscribe', ok: "Thank you! You're subscribed to ECCSA updates.", exists: 'You are already subscribed. Thank you!', error: 'Something went wrong. Please try again.' },
  footer: { services: 'Services', links: 'Useful Links', contact: 'Contact Us', rights: 'All rights reserved.', fax: 'Fax', po: 'P.O. Box' },
  members: { search: 'Search by name or phone…', all: 'All', showing: 'Showing', empty: 'No members match your search.', types: { regional: 'Regional Chambers', city: 'City Chambers', national: 'National Chamber', sectoral: 'Sectoral Associations' } as Record<string, string> },
  contact: { call: 'Call us', email: 'Email us', visit: 'Visit our office', hours: 'Office hours', name: 'Full name', emailField: 'Email address', phone: 'Phone', company: 'Company / Organization', topic: 'Topic', subject: 'Subject', message: 'Message', send: 'Send message', sending: 'Sending…', privacy: 'We reply within two working days. Your details are only used to answer your enquiry.', error: 'Please check the form and try again.' },
  stats: 'Key figures',
}

export type Dictionary = typeof en

const am: Dictionary = {
  langName: 'አማርኛ',
  switchTo: 'English',
  nav: {
    home: 'መነሻ', about: 'ስለ እኛ', services: 'አገልግሎቶች', membership: 'አባልነት', resources: 'ዜናና መረጃዎች',
    contact: 'ያግኙን', news: 'አዳዲስ ዜናዎች', events: 'ዝግጅቶች', publications: 'ህትመቶችና ሰነዶች',
    aboutEccsa: 'ስለ ምክር ቤቱ', history: 'ታሪካችን', mission: 'ተልዕኮ፣ ራዕይና እሴቶች', board: 'የዳይሬክተሮች ቦርድ',
    management: 'ማኔጅመንት', partners: 'አጋሮቻችን', allServices: 'ሁሉንም አገልግሎቶች ይመልከቱ →',
    overview: 'የአባልነት መግለጫ', benefits: 'የአባልነት ጥቅሞች', join: 'እንዴት አባል መሆን ይቻላል', directory: 'የአባላት ዝርዝር',
  },
  questions: 'ጥያቄ አለዎት?',
  latest: 'አዳዲስ',
  skip: 'ወደ ይዘቱ ይሂዱ',
  menu: 'ማውጫ', openMenu: 'ማውጫ ክፈት', closeMenu: 'ማውጫ ዝጋ',
  readMore: 'ተጨማሪ ያንብቡ', learnMore: 'ተጨማሪ ይወቁ', download: 'አውርድ', viewAll: 'ሁሉንም ይመልከቱ',
  backToNews: 'ወደ ዜናዎች ይመለሱ', relatedNews: 'ተጨማሪ ዜናዎች', share: 'ያጋሩ',
  allCategories: 'ሁሉም', page: 'ገጽ', of: 'ከ', prev: 'ቀዳሚ', next: 'ቀጣይ',
  noNews: 'እስካሁን የታተመ ዜና የለም።',
  upcoming: 'መጪ ዝግጅቶች', past: 'ያለፉ ዝግጅቶች', register: 'ይመዝገቡ', location: 'ቦታ',
  noPublications: 'እስካሁን ህትመት የለም።',
  newsletter: { title: 'የኢትዮጵያን የንግድ ዜና ቀድመው ይወቁ', text: 'የምክር ቤቱን ዜናዎች፣ የንግድ ዕድሎች፣ ዝግጅቶችና የፖሊሲ መረጃዎች በኢሜይልዎ ያግኙ።', placeholder: 'የኢሜይል አድራሻዎ', button: 'ይመዝገቡ', ok: 'እናመሰግናለን! ለምክር ቤቱ መረጃዎች ተመዝግበዋል።', exists: 'ቀድሞውኑ ተመዝግበዋል። እናመሰግናለን!', error: 'ችግር ተፈጥሯል። እባክዎ እንደገና ይሞክሩ።' },
  footer: { services: 'አገልግሎቶች', links: 'ጠቃሚ ማስፈንጠሪያዎች', contact: 'ያግኙን', rights: 'መብቱ በሕግ የተጠበቀ ነው።', fax: 'ፋክስ', po: 'ፖ.ሣ.ቁ.' },
  members: { search: 'በስም ወይም በስልክ ይፈልጉ…', all: 'ሁሉም', showing: 'የሚታዩ', empty: 'ከፍለጋዎ ጋር የሚዛመድ አባል የለም።', types: { regional: 'የክልል ምክር ቤቶች', city: 'የከተማ ምክር ቤቶች', national: 'ብሔራዊ ምክር ቤት', sectoral: 'የዘርፍ ማኅበራት' } },
  contact: { call: 'ይደውሉልን', email: 'ኢሜይል ይላኩልን', visit: 'ቢሯችንን ይጎብኙ', hours: 'የሥራ ሰዓት', name: 'ሙሉ ስም', emailField: 'የኢሜይል አድራሻ', phone: 'ስልክ', company: 'ድርጅት', topic: 'ርዕሰ ጉዳይ', subject: 'ርዕስ', message: 'መልዕክት', send: 'መልዕክት ይላኩ', sending: 'በመላክ ላይ…', privacy: 'በሁለት የሥራ ቀናት ውስጥ ምላሽ እንሰጣለን። መረጃዎ ለጥያቄዎ ምላሽ ለመስጠት ብቻ ይውላል።', error: 'እባክዎ ቅጹን አረጋግጠው እንደገና ይሞክሩ።' },
  stats: 'ቁልፍ አሃዞች',
}

export const getDictionary = (lang: Locale): Dictionary => (lang === 'am' ? am : en)

export const formatDate = (lang: Locale, d?: string | null, opts: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }) => {
  if (!d) return ''
  try {
    return new Intl.DateTimeFormat(lang === 'am' ? 'am-ET' : 'en-US', { ...opts, timeZone: 'Africa/Addis_Ababa' }).format(new Date(d))
  } catch {
    return new Date(d).toDateString()
  }
}
