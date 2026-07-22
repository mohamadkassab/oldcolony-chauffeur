import { useTranslations } from 'next-intl';
import { Star } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { REVIEWS } from '@/lib/data';

export function TestimonialsSection() {
  const t = useTranslations('testimonials');

  return (
    <Section id="testimonials" tone="white">
      <SectionHeader eyebrow={t('badge')} title={t('title')} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {REVIEWS.map(({ name, location, stars, text }) => (
          <Card key={name} padding="md" hover>
            <div className="flex gap-1 mb-4">
              {Array.from({ length: stars }).map((_, i) => (
                <Star key={i} size={14} className="fill-brand-pink text-brand-pink" />
              ))}
            </div>
            <p className="type-body-sm text-gray-600 mb-5">&ldquo;{text}&rdquo;</p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-brand-light border border-brand-border flex items-center justify-center text-brand-magenta font-bold font-serif text-sm">
                {name[0]}
              </div>
              <div>
                <p className="type-body-sm font-semibold text-brand-dark">{name}</p>
                <p className="type-caption text-gray-400">{location}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
