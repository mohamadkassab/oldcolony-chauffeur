import { useTranslations } from 'next-intl';
import { Section } from '@/components/ui/Section';

// Truthful trust strip — no invented numbers. "10+" is the chauffeur's real
// years of professional driving experience.
const STATS = [
  { value: '10+',     key: 'driving'      },
  { value: '$0',      key: 'surge'        },
  { value: 'EN · FR', key: 'languages'    },
  { value: '24/7',    key: 'availability' },
];

export function StatsSection() {
  const t = useTranslations('stats');

  return (
    <Section tone="dark" width="5xl" spacing="md">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        {STATS.map(({ value, key }) => (
          <div key={key}>
            <p className="type-stat font-bold text-brand-pink mb-2">{value}</p>
            <p className="type-caption font-medium uppercase tracking-wider text-white/50">{t(key as 'driving' | 'surge' | 'languages' | 'availability')}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
