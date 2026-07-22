'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { CITY_PAGES } from '@/lib/cities-content';
import type { VehicleClass } from '@/lib/quote';
import clsx from 'clsx';

/** Fired by the fare finder; BookingForm listens and pre-fills the trip. */
export const PREFILL_EVENT = 'oc:prefill';
export interface PrefillDetail {
  pickup: string;
  dropoff: string;
}

const LOGAN_LABEL = 'Boston Logan International Airport (BOS)';

/**
 * The hero's interactive fare widget: pick a corridor town + vehicle class,
 * see the published flat rate instantly, then jump into the booking form with
 * the trip pre-filled — where lib/quote.ts re-derives the exact same rate.
 */
export function FareFinder() {
  const t = useTranslations('hero.fare');
  const [slug, setSlug] = useState('canton');
  const [vClass, setVClass] = useState<VehicleClass>('sedan');

  const town = CITY_PAGES.find((c) => c.slug === slug) ?? CITY_PAGES[0];
  const rate = vClass === 'sedan' ? town.sedanRate : town.suvRate;

  const book = () => {
    const detail: PrefillDetail = {
      pickup: `${town.name}, MA`,
      dropoff: LOGAN_LABEL,
    };
    window.dispatchEvent(new CustomEvent(PREFILL_EVENT, { detail }));
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="rounded-2xl border border-white/15 bg-white/[0.07] backdrop-blur-md p-5 max-w-lg">
      <p className="type-badge font-semibold text-brand-pink/90 mb-3">{t('title').toUpperCase()}</p>

      <div className="flex flex-wrap items-stretch gap-2.5">
        {/* Town */}
        <div className="relative flex-1 min-w-[10rem]">
          <select
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            aria-label={t('town')}
            className="w-full h-11 appearance-none rounded-xl border border-white/20 bg-white/10 pl-3.5 pr-9 text-sm font-medium text-white outline-none cursor-pointer hover:border-brand-pink/60 focus:border-brand-pink transition-colors [&>option]:text-brand-dark"
          >
            {CITY_PAGES.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
          <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/60" />
        </div>

        {/* Vehicle class toggle */}
        <div className="flex h-11 rounded-xl border border-white/20 bg-white/10 p-1">
          {(['sedan', 'suv'] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setVClass(v)}
              className={clsx(
                'px-3.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors cursor-pointer',
                vClass === v ? 'bg-brand-magenta text-brand-dark' : 'text-white/60 hover:text-white',
              )}
            >
              {t(v)}
            </button>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-center gap-1.5 min-w-[7rem]">
          <span
            key={`${slug}-${vClass}`}
            className="font-serif text-4xl font-semibold text-brand-pink leading-none animate-[oc-pop_.35s_ease]"
          >
            ${rate}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wide text-white/50 leading-tight">
            {t('flat')}<br />{t('toLogan')}
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="type-caption text-white/45">{t('note')}</p>
        <button
          type="button"
          onClick={book}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-magenta px-4 py-2.5 type-cta font-bold text-brand-dark hover:bg-brand-pink transition-colors cursor-pointer"
        >
          {t('cta')} <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
