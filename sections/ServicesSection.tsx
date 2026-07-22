import { useTranslations } from 'next-intl';
import { Plane, MapPin, Clock, Star, ArrowRight } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Link } from '@/i18n/navigation';
import { SERVICE_PAGES } from '@/lib/services-content';

const ICONS = [Plane, MapPin, Clock, Star];
const KEYS  = ['airport', 'city', 'hourly', 'event'] as const;

export function ServicesSection() {
  const t = useTranslations('services');

  return (
    <Section id="services" tone="fog">
      <SectionHeader
        eyebrow={t('badge').toUpperCase()}
        eyebrowVariant="plain"
        title={t('title')}
        sub={t('sub')}
      />

      {/* 2×2 card grid — each card links to its dedicated service page */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {KEYS.map((key, i) => {
          const Icon = ICONS[i];
          // ServiceType enum values match the message keys ('airport', …).
          const slug = SERVICE_PAGES.find((s) => s.serviceType === key)?.slug ?? '';
          return (
            <Link key={key} href={{ pathname: '/services/[slug]', params: { slug } }} className="block">
              <Card border="neutral" hover className="group h-full">
                <div className="w-12 h-12 bg-brand-light rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-magenta transition-colors duration-300">
                  <Icon size={20} className="text-brand-magenta group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-brand-dark mb-3">
                  {t(`${key}.title`)}
                </h3>
                <p className="type-body-sm text-gray-500 leading-relaxed">{t(`${key}.desc`)}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 type-caption font-semibold text-brand-magenta group-hover:gap-3 transition-all">
                  {t('learnMore')} <ArrowRight size={12} />
                </span>
              </Card>
            </Link>
          );
        })}
      </div>
    </Section>
  );
}
