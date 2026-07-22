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
          alt="Professional car service in Boston"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark/70 via-brand-dark/50 to-brand-magenta/20" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-brand-magenta/5 blur-[80px] pointer-events-none" />
      </div>

      {/* Main content */}
      <div className="relative flex-grow flex items-center px-6 md:px-12 max-w-7xl mx-auto w-full pt-28 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 w-full items-center">

          {/* Left — headline */}
          <div>
            <h1 className="type-display font-bold text-white mb-10">
              {t('headline1')}<br />
              <span className="text-brand-pink italic">{t('headline2')}</span>
            </h1>
          </div>

          {/* Right — booking form */}
          <div id="booking" className="relative z-[55] bg-white rounded-2xl p-6 md:p-8">
            <BookingForm />
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
