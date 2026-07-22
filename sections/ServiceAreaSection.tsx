import { useTranslations } from 'next-intl';
import { MapPin, Plane } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Link } from '@/i18n/navigation';
import { CITY_PAGES } from '@/lib/cities-content';

const PILL =
  'flex items-center gap-2 bg-brand-dark-soft border border-brand-dark-line hover:border-brand-magenta hover:bg-brand-dark-line transition-colors duration-200 rounded-full px-5 py-2.5 group';

const AIRPORTS = ['Logan Airport (BOS)', 'Manchester Airport (MHT)', 'T.F. Green Airport (PVD)'];

export function ServiceAreaSection() {
  const t = useTranslations('serviceArea');

  return (
    <Section id="service-area" tone="dark" width="5xl">
      <SectionHeader
        eyebrow={t('badge')}
        title={t('title')}
        sub={t('sub')}
        tone="dark"
        subWidth="max-w-xl"
      />

      <div className="flex flex-wrap justify-center gap-3">
        {/* Airports link to the airport-transfer service page */}
        {AIRPORTS.map((airport) => (
          <Link
            key={airport}
            href={{ pathname: '/services/[slug]', params: { slug: 'airport-transfer' } }}
            className={PILL}
          >
            <Plane size={13} className="text-brand-magenta group-hover:text-brand-pink transition-colors flex-shrink-0" />
            <span className="type-body-sm font-medium text-white/70 group-hover:text-white transition-colors">{airport}</span>
          </Link>
        ))}

        {/* Each town links to its own local landing page */}
        {CITY_PAGES.map((city) => (
          <Link
            key={city.slug}
            href={{ pathname: '/car-service/[city]', params: { city: city.slug } }}
            className={PILL}
          >
            <MapPin size={13} className="text-brand-magenta group-hover:text-brand-pink transition-colors flex-shrink-0" />
            <span className="type-body-sm font-medium text-white/70 group-hover:text-white transition-colors">
              {city.state === 'RI' ? `${city.name}, RI` : city.name}
            </span>
          </Link>
        ))}
      </div>

      <p className="type-body-sm text-center text-white/30 mt-10">
        Don&apos;t see your city? <a href="tel:+17812345451" className="text-brand-magenta hover:text-brand-pink underline transition-colors">Call us</a> — we cover more areas on request.
      </p>
    </Section>
  );
}
