import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  // Serve the default locale (en) at the root — `/`, not `/en`. Other locales
  // keep their prefix (`/fr`).
  localePrefix: 'as-needed',
  pathnames: {
    '/': '/',
    '/blog': '/blog',
    '/blog/[slug]': '/blog/[slug]',
    '/services/[slug]': '/services/[slug]',
    '/car-service/[city]': '/car-service/[city]',
  },
});
