'use client';
import { Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { WHATSAPP_URL } from '@/lib/contact';

export function StickyMobileBar() {
  const t = useTranslations('nav');

  // Always visible on mobile (no scroll gate) so the phone + booking CTAs are
  // reachable at any scroll position. Compact sizing keeps each label on a
  // single line on narrow screens.
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] flex gap-2 border-t border-brand-border bg-white px-3 py-2.5 md:hidden">
      <ButtonLink
        href="tel:+17812345451"
        variant="outline"
        size="sm"
        className="flex-1 whitespace-nowrap"
      >
        <Phone size={15} />
        {t('phone')}
      </ButtonLink>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="flex items-center justify-center rounded-lg border border-[#25D366]/40 bg-[#25D366]/10 px-3 text-[#1DA851] transition-colors hover:bg-[#25D366]/20"
      >
        <WhatsAppIcon size={18} />
      </a>
      <Button
        size="sm"
        className="flex-1 whitespace-nowrap"
        onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
      >
        {t('bookRide')}
      </Button>
    </div>
  );
}
