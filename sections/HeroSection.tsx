'use client';
import { useTranslations } from 'next-intl';
import { BookingForm } from '@/components/ui/BookingForm';

export function HeroSection() {
  const t = useTranslations('hero');

  return (
    <section className="relative min-h-screen flex flex-col">

      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/images/hero.avif"
          alt="Private chauffeur service to Boston Logan Airport"
          className="w-full h-full object-cover object-center"
        />
        {/* Heavy navy wash until the brand photoshoot (W9) replaces the imagery. */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-ink/95 via-brand-dark/85 to-brand-dark/60" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-brand-magenta/5 blur-[80px] pointer-events-none" />
      </div>

      {/* Main content */}
      <div className="relative flex-grow flex items-center px-6 md:px-12 max-w-7xl mx-auto w-full pt-28 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 w-full items-center">

          {/* Left — headline, sub, trust */}
          <div>
            <h1 className="type-display font-bold text-white mb-5">
              {t('headline1')}<br />
              <span className="text-brand-pink italic">{t('headline2')}</span>
            </h1>
            <p className="type-body text-white/70 max-w-lg mb-8">{t('sub')}</p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {(['trust1', 'trust2', 'trust3'] as const).map((k) => (
                <span key={k} className="flex items-center gap-2 type-body-sm text-white/60">
                  <span className="w-1 h-1 bg-brand-pink rotate-45" />
                  {t(k)}
                </span>
              ))}
            </div>
          </div>

          {/* Right — booking form */}
          <div id="booking" className="relative z-[55] bg-white rounded-2xl overflow-hidden">
            <div className="bg-brand-ink px-6 md:px-8 py-4">
              <p className="font-serif text-lg font-semibold text-white leading-tight">{t('formTitle')}</p>
            </div>
            <div className="p-6 md:p-8">
              <BookingForm />
            </div>
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="relative flex justify-center pb-8">
        <button
          onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
          className="flex flex-col items-center gap-1.5 text-white/30 hover:text-white/60 transition-colors cursor-pointer"
          aria-label="Scroll to services"
        >
          <span className="text-[10px] font-light tracking-[0.3em] uppercase">Explore</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
        </button>
      </div>
    </section>
  );
}
