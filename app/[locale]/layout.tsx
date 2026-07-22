import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { SessionProvider } from 'next-auth/react';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { routing } from '@/i18n/routing';
import { GoogleAds } from '@/components/analytics/GoogleAds';
import { ChatWidget } from '@/components/chat/ChatWidget';
import '../globals.css';

const BASE_URL = 'https://oldcolonychauffeur.com';

export const metadata: Metadata = {
  title: 'Boston Car Service | Car Service to Logan Airport | Old Colony Chauffeur',
  description: 'Professional Boston car service & flat-rate car service to Logan Airport. No surge pricing, 24/7 chauffeurs, free flight tracking, curbside pickup at every terminal. Black car, corporate & airport transfers across Cambridge, Quincy, Newton, Brookline & all of Greater Boston. Call (781) 234-5451.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'Old Colony Chauffeur',
    title: 'Boston Car Service | Car Service to Logan Airport & Black Car | Old Colony Chauffeur',
    description: 'Professional car service in Boston, MA. Flat-rate car service to Logan Airport, black car rides, corporate & wedding transportation. No surge pricing. Serving all of Greater Boston. Call (781) 234-5451.',
    images: [
      {
        // Social crawlers don't reliably read AVIF — dedicated OG-sized JPG.
        url: `${BASE_URL}/images/og-hero.jpg`,
        width: 1200,
        height: 630,
        alt: 'Old Colony Chauffeur — Professional Car Service in Boston, MA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Boston Car Service | Car Service to Logan Airport | Old Colony Chauffeur',
    description: 'Professional car service in Boston, MA. Flat-rate car service to Logan Airport, black car rides & corporate transportation across Greater Boston. No surge pricing.',
    images: [`${BASE_URL}/images/og-hero.jpg`],
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      // Default locale (en) is served at the root, not `/en`.
      'en': BASE_URL,
      'fr': `${BASE_URL}/fr`,
      'x-default': BASE_URL,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: { icon: '/favicon.svg' },
};

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'TaxiService'],
  name: 'Old Colony Chauffeur',
  description: 'Private chauffeur service south and west of Boston. Flat-rate car service to Logan Airport in luxury vehicles, hourly chauffeur, corporate travel, and weddings & events. No surge pricing, free flight tracking, 24/7 by reservation. English & Français.',
  url: BASE_URL,
  telephone: '+17812345451',
  email: 'info@oldcolonychauffeur.com',
  // TODO(W11): add streetAddress + postalCode + geo + hasMap once the new
  // business address is provided; keep town-level only until then.
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Canton',
    addressRegion: 'MA',
    addressCountry: 'US',
  },
  areaServed: [
    'Canton, MA', 'Dedham, MA', 'Westwood, MA', 'Norwood, MA', 'Milton, MA',
    'Sharon, MA', 'Stoughton, MA', 'Walpole, MA', 'Needham, MA', 'Quincy, MA',
    'Logan International Airport',
  ],
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '00:00',
    closes: '23:59',
  },
  priceRange: '$$',
  currenciesAccepted: 'USD',
  paymentAccepted: 'Cash, Credit Card',
  // Service catalog — mirrors the four homepage services + /services pages.
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Car Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Airport Transfer',
          url: `${BASE_URL}/services/airport-transfer`,
          description: 'Flat-rate car service to and from Logan Airport (BOS), Manchester (MHT) and T.F. Green (PVD) with free flight tracking and curbside pickup.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Black Car & City Rides',
          url: `${BASE_URL}/services/black-car`,
          description: 'Point-to-point black car service across Boston and Greater Boston — fixed prices, professional chauffeurs, no surge pricing.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Hourly Chauffeur Hire',
          url: `${BASE_URL}/services/hourly`,
          description: 'Private chauffeur and vehicle by the hour for meetings, roadshows, nights out and multi-stop itineraries.',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Wedding & Event Transportation',
          url: `${BASE_URL}/services/wedding-events`,
          description: 'Wedding, prom and special-event transportation across Greater Boston with immaculate vehicles and on-schedule service.',
        },
      },
    ],
  },
  // NOTE: deliberately no aggregateRating/review markup. Our reviews are
  // collected on Google, and Google ignores/penalizes "self-serving" review
  // schema fed from third-party profiles. Ratings belong to the GBP listing.
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'en' | 'fr')) {
    notFound();
  }

  const messages = await getMessages();
  // Resolve the session on the server so the header renders its final
  // signed-in/out state immediately — no "Sign In → profile" flash on load.
  const session = await auth();

  return (
    <html lang={locale} className="h-full antialiased">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <SessionProvider session={session}>
          <NextIntlClientProvider messages={messages}>
            {children}
            <ChatWidget />
          </NextIntlClientProvider>
        </SessionProvider>
        <GoogleAds />
      </body>
    </html>
  );
}
