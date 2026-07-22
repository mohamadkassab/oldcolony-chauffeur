'use client';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { CITY_PAGES } from '@/lib/cities-content';

// The design's "flat rates teaser": navy split section — pitch on the left,
// a sample of real published town rates on the right. Rates come straight
// from cities-content.ts so this can never drift from the town pages.
const FEATURED_SLUGS = ['milton', 'dedham', 'canton', 'sharon'];

export function FlatRatesSection() {
  const t = useTranslations('rates');
  const featured = CITY_PAGES.filter((c) => FEATURED_SLUGS.includes(c.slug));

  return (
    <Section id="rates" tone="dark" width="6xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

        {/* Left — pitch */}
        <div>
          <Eyebrow className="mb-4 text-brand-pink">{t('badge').toUpperCase()}</Eyebrow>
          <h2 className="type-heading font-bold text-white mb-4">{t('title')}</h2>
          <p className="type-body text-white/60 mb-8">{t('sub')}</p>
          <a
            href="#booking"
            className="inline-block bg-brand-magenta text-brand-dark type-cta font-bold px-7 py-3.5 rounded-lg hover:bg-brand-pink transition-colors"
          >
            {t('cta')} →
          </a>
        </div>

        {/* Right — sample rate table */}
        <div className="rounded-2xl bg-brand-ink border border-brand-dark-line overflow-hidden">
          {featured.map((c) => (
            <Link
              key={c.slug}
              href={{ pathname: '/car-service/[city]', params: { city: c.slug } }}
              className="flex items-center justify-between px-6 py-5 border-b border-brand-dark-line hover:bg-brand-dark-soft transition-colors"
            >
              <span className="type-body font-medium text-white/85">
                {c.name} <span className="text-white/40">{t('toLogan')}</span>
              </span>
              <span className="font-serif text-2xl font-semibold text-brand-pink">${c.sedanRate}</span>
            </Link>
          ))}
          <div className="flex items-center justify-between px-6 py-4">
            <p className="type-caption text-white/40">{t('note')}</p>
            <a href="#service-area" className="type-caption font-semibold text-brand-pink whitespace-nowrap hover:underline">
              {t('seeAll')} →
            </a>
          </div>
        </div>

      </div>
    </Section>
  );
}
