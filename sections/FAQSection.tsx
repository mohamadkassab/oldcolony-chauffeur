'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';

export function FAQSection() {
  const t    = useTranslations('faq');
  const items = t.raw('items') as { q: string; a: string }[];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section id="faq" tone="light" width="3xl">
      <SectionHeader eyebrow={t('badge')} title={t('title')} eyebrowTone="contrast" />

      <div className="space-y-3">
        {items.map((item, i) => (
          <Card key={i} padding="none" className="overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-6 py-5 text-left group"
            >
              <span className="type-body-sm font-semibold text-brand-dark pr-4">{item.q}</span>
              <ChevronDown
                size={18}
                className={clsx('text-brand-magenta flex-shrink-0 transition-transform duration-200', open === i && 'rotate-180')}
              />
            </button>
            {open === i && (
              <div className="px-6 pb-5">
                <p className="type-body-sm text-gray-500">{item.a}</p>
              </div>
            )}
          </Card>
        ))}
      </div>
    </Section>
  );
}
