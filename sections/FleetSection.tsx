import { useTranslations } from 'next-intl';
import { Users, Briefcase } from 'lucide-react';
import { FLEET } from '@/lib/data';
import { FallbackImage } from '@/components/ui/FallbackImage';
import { Section } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Card } from '@/components/ui/Card';

const VEHICLE_SUBTITLES: Record<string, string> = {
  '1': 'Mercedes-Benz C300',
  '2': 'Chevrolet Suburban',
  '3': 'Cadillac Escalade',
  '4': 'Mercedes GLE-450',
};

export function FleetSection() {
  const t = useTranslations('fleet');

  return (
    <Section id="fleet" tone="ink">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
        <div>
          <Eyebrow variant="plain" className="mb-4">{t('badge').toUpperCase()}</Eyebrow>
          <h2 className="type-heading font-bold text-white">{t('title')}</h2>
        </div>
        <p className="type-body-sm text-white/40 max-w-xs md:text-right">{t('sub')}</p>
      </div>

      {/* Fleet grid — dark premium 2-column cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {FLEET.map(vehicle => (
          <Card key={vehicle.id} tone="dark" padding="none" hover className="group overflow-hidden">
              {/* Image */}
              <div className="aspect-[16/9] bg-brand-ink overflow-hidden">
                <FallbackImage
                  src={vehicle.imageUrl}
                  alt={vehicle.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  fallbackSrc={'https://placehold.co/800x450/1A1A1A/C2185B?text=' + encodeURIComponent(vehicle.name)}
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <span className="type-caption font-semibold text-brand-magenta tracking-widest uppercase">
                  {VEHICLE_SUBTITLES[vehicle.id]}
                </span>
                <h3 className="font-serif text-xl font-bold text-white mt-1 mb-4">{vehicle.name}</h3>

                {/* Capacity */}
                <div className="flex items-center gap-5 pb-4 mb-4 border-b border-white/8">
                  <div className="flex items-center gap-1.5 type-body-sm text-white/50">
                    <Users size={13} className="text-brand-magenta" />
                    <span>{vehicle.maxPassengers} passengers</span>
                  </div>
                  <div className="flex items-center gap-1.5 type-body-sm text-white/50">
                    <Briefcase size={13} className="text-brand-magenta" />
                    <span>{vehicle.maxLuggage} bags</span>
                  </div>
                </div>

                {/* CTA */}
                <a
                  href="#booking"
                  className="inline-flex items-center gap-1.5 type-body-sm font-semibold text-brand-magenta hover:text-brand-pink transition-colors cursor-pointer"
                >
                  Request a Ride →
                </a>
              </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
