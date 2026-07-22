import { useTranslations } from 'next-intl';
import { ClipboardList, MessageCircleCheck, Car } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';

const ICONS = [ClipboardList, MessageCircleCheck, Car];

export function HowItWorksSection() {
  const t = useTranslations('howItWorks');

  const STEPS = [
    { icon: ICONS[0], title: t('step1Title'), desc: t('step1Desc') },
    { icon: ICONS[1], title: t('step2Title'), desc: t('step2Desc') },
    { icon: ICONS[2], title: t('step3Title'), desc: t('step3Desc') },
  ];

  return (
    <Section id="how-it-works" tone="white" width="5xl">
      <SectionHeader eyebrow={t('badge')} title={t('title')} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-brand-border" />

          {STEPS.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="flex flex-col items-center text-center relative">
              <div className="w-20 h-20 rounded-full bg-brand-light border-2 border-brand-border flex items-center justify-center mb-5 relative z-10">
                <Icon size={28} className="text-brand-magenta" />
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-brand-magenta rounded-full text-white type-caption font-bold flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <h3 className="type-subheading font-semibold text-brand-dark mb-3">{title}</h3>
              <p className="type-body-sm text-gray-500">{desc}</p>
            </div>
          ))}
      </div>
    </Section>
  );
}
