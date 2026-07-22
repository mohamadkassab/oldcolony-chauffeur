'use client';
import Script from 'next/script';
import { useEffect } from 'react';
import { GOOGLE_ADS_ID, GA4_ID, trackPhoneConversion, trackEmailConversion } from '@/lib/gtag';

/* Loads the Google tag site-wide (Google Ads conversions + optional GA4) and
   tracks every tel:/mailto: link click via event delegation, so individual
   components don't need handlers. */
export function GoogleAds() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const link = target?.closest?.('a[href^="tel:"], a[href^="mailto:"]');
      if (!link) return;
      const href = link.getAttribute('href') ?? '';
      if (href.startsWith('tel:')) trackPhoneConversion();
      else trackEmailConversion();
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const primaryId = GOOGLE_ADS_ID || GA4_ID;
  if (!primaryId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${primaryId}`}
        strategy="afterInteractive"
      />
      <Script id="google-tag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          ${GOOGLE_ADS_ID ? `gtag('config', '${GOOGLE_ADS_ID}');` : ''}
          ${GA4_ID ? `gtag('config', '${GA4_ID}');` : ''}`}
      </Script>
    </>
  );
}
