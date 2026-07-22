import { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { listBlogPosts } from '@/lib/repositories/blog';
import { SERVICE_PAGES } from '@/lib/services-content';
import { CITY_PAGES } from '@/lib/cities-content';

const BASE_URL = 'https://oldcolonychauffeur.com';

// The default locale lives at the root (`localePrefix: 'as-needed'`); the
// others keep their prefix.
function localeUrl(locale: string, path = '') {
  const prefix = locale === routing.defaultLocale ? '' : `/${locale}`;
  return `${BASE_URL}${prefix}${path}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const homePages = routing.locales.map(locale => ({
    url:              localeUrl(locale),
    lastModified:     new Date(),
    changeFrequency:  'weekly' as const,
    priority:         1,
  }));

  const blogIndexPages = routing.locales.map(locale => ({
    url:              localeUrl(locale, '/blog'),
    lastModified:     new Date(),
    changeFrequency:  'weekly' as const,
    priority:         0.7,
  }));

  const servicePages = routing.locales.flatMap(locale =>
    SERVICE_PAGES.map(service => ({
      url:              localeUrl(locale, `/services/${service.slug}`),
      lastModified:     new Date(),
      changeFrequency:  'monthly' as const,
      priority:         0.8,
    })),
  );

  const cityPages = routing.locales.flatMap(locale =>
    CITY_PAGES.map(city => ({
      url:              localeUrl(locale, `/car-service/${city.slug}`),
      lastModified:     new Date(),
      changeFrequency:  'monthly' as const,
      priority:         0.7,
    })),
  );

  // Never let a DB hiccup break the sitemap — degrade to the static pages.
  let postPages: MetadataRoute.Sitemap = [];
  try {
    const posts = await listBlogPosts();
    postPages = routing.locales.flatMap(locale =>
      posts.map(post => ({
        url:              localeUrl(locale, `/blog/${post.slug}`),
        lastModified:     post.updatedAt,
        changeFrequency:  'monthly' as const,
        priority:         0.6,
      })),
    );
  } catch (err) {
    console.error('Failed to load blog posts for sitemap', err);
  }

  return [...homePages, ...servicePages, ...cityPages, ...blogIndexPages, ...postPages];
}
