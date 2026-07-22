import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Check, MapPin, Plane } from 'lucide-react';
import { Navbar }          from '@/components/layout/Navbar';
import { Footer }          from '@/components/layout/Footer';
import { StickyMobileBar } from '@/components/layout/StickyMobileBar';
import { BookingForm }     from '@/components/ui/BookingForm';
import { Card }            from '@/components/ui/Card';
import { Eyebrow }         from '@/components/ui/Eyebrow';
import { CITY_PAGES, getCityPage, type CityPage as CityPageData } from '@/lib/cities-content';
import { ServiceType } from '@/types';

const BASE_URL = 'https://oldcolonychauffeur.com';

// Localized page template — city facts are interpolated into these strings.
// (Unique EN blurbs live in cities-content.ts; FR uses a factual template.)
const L10N = {
  en: {
    eyebrow: (c: CityPageData) => `Service Area · ${c.name}`,
    title: (c: CityPageData) => `Car Service to ${c.name}, ${c.state}`,
    intro: (c: CityPageData) => c.blurb,
    loganHeading: (c: CityPageData) => `Logan Airport transfers from ${c.name}`,
    loganBody: (c: CityPageData) =>
      `${c.name} is roughly ${c.loganMiles} miles from Logan International Airport — about ${c.loganMinutes} minutes door to terminal depending on traffic. The flat rate from ${c.name} is $${c.sedanRate} by sedan or $${c.suvRate} by SUV, tolls included, confirmed in writing before your trip. We track your flight in real time, adjust for delays, and include up to 60 minutes of free wait on arrivals. Early flights, late arrivals, holiday weekends: the price you book is the price you pay.`,
    rateSedan: 'Sedan flat rate',
    rateSuv: 'SUV flat rate',
    rateTime: 'Drive time',
    rateNote: 'One-way to/from Logan · tolls included · gratuity at your discretion',
    pickupHeading: (c: CityPageData) => `Where we pick up in ${c.name}`,
    pickupBody: (c: CityPageData) =>
      `Our chauffeurs cover all of ${c.name} — homes, hotels and offices alike. Frequent pickup spots include:`,
    features: [
      'Flat rates — no surge pricing, ever',
      'Free real-time flight tracking',
      'Available 24/7, including holidays',
      'Professional, background-checked chauffeurs',
      'Mercedes sedans & premium SUVs',
      'Child seats on request',
    ],
  },
  fr: {
    eyebrow: (c: CityPageData) => `Zone desservie · ${c.name}`,
    title: (c: CityPageData) => `Service de voiture à ${c.name}, ${c.state}`,
    intro: (c: CityPageData) =>
      `Old Colony Chauffeur assure un service de voiture privée avec chauffeur à ${c.name} — transferts vers l'aéroport Logan, trajets d'affaires, sorties et événements, toujours à prix fixe convenu à l'avance.`,
    loganHeading: (c: CityPageData) => `Transferts vers l'aéroport Logan depuis ${c.name}`,
    loganBody: (c: CityPageData) =>
      `${c.name} se trouve à environ ${c.loganMiles} miles de l'aéroport Logan — soit ${c.loganMinutes} minutes de porte à terminal selon le trafic. Le prix fixe depuis ${c.name} est de ${c.sedanRate} $ en berline ou ${c.suvRate} $ en SUV, péages inclus, confirmé par écrit avant votre trajet. Nous suivons votre vol en temps réel, avec jusqu'à 60 minutes d'attente gratuite à l'arrivée. Vol matinal, arrivée tardive ou week-end férié : le prix réservé est le prix payé.`,
    rateSedan: 'Prix fixe berline',
    rateSuv: 'Prix fixe SUV',
    rateTime: 'Durée du trajet',
    rateNote: 'Aller simple vers/depuis Logan · péages inclus · pourboire à votre discrétion',
    pickupHeading: (c: CityPageData) => `Nos points de prise en charge à ${c.name}`,
    pickupBody: (c: CityPageData) =>
      `Nos chauffeurs couvrent tout ${c.name} — domiciles, hôtels et bureaux. Points de départ fréquents :`,
    features: [
      'Prix fixes — jamais de tarifs dynamiques',
      'Suivi de vol gratuit en temps réel',
      'Disponible 24h/24, 7j/7, jours fériés inclus',
      'Chauffeurs professionnels vérifiés',
      'Berlines Mercedes et SUV haut de gamme',
      'Sièges enfants sur demande',
    ],
  },
} as const;

interface Props {
  params: Promise<{ locale: string; city: string }>;
}

export function generateStaticParams() {
  return CITY_PAGES.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, city } = await params;
  const data = getCityPage(city);
  if (!data) return {};

  const isFr = locale === 'fr';
  const title = isFr
    ? `Service de voiture à ${data.name}, ${data.state} | Transferts aéroport Logan | Old Colony Chauffeur`
    : `Car Service ${data.name} ${data.state} | Logan Airport Transfers | Old Colony Chauffeur`;
  const description = isFr
    ? `Service de voiture à prix fixe à ${data.name}, ${data.state} — transfert aéroport Logan ${data.sedanRate} $ en berline (${data.loganMiles} mi, ~${data.loganMinutes} min), trajets d'affaires et événements. 24h/24. Appelez le (781) 234-5451.`
    : `Flat-rate car service in ${data.name}, ${data.state} — $${data.sedanRate} sedan to Logan Airport (${data.loganMiles} mi, ~${data.loganMinutes} min), corporate rides & events. No surge pricing, 24/7. Call (781) 234-5451.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/car-service/${data.slug}`,
      languages: {
        // Default locale (en) is served at the root, not `/en`.
        'en': `${BASE_URL}/car-service/${data.slug}`,
        'fr': `${BASE_URL}/fr/car-service/${data.slug}`,
        'x-default': `${BASE_URL}/car-service/${data.slug}`,
      },
    },
    openGraph: {
      type: 'website',
      url: `${BASE_URL}/car-service/${data.slug}`,
      title,
      description,
    },
  };
}

export default async function CityServicePage({ params }: Props) {
  const { locale, city } = await params;
  const data = getCityPage(city);
  if (!data) notFound();
  const copy = locale === 'fr' ? L10N.fr : L10N.en;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Car Service ${data.name}, ${data.state}`,
    description: copy.loganBody(data),
    url: `${BASE_URL}/car-service/${data.slug}`,
    areaServed: { '@type': 'City', name: `${data.name}, ${data.state}` },
    provider: {
      '@type': 'LocalBusiness',
      name: 'Old Colony Chauffeur',
      telephone: '+17812345451',
      url: BASE_URL,
    },
    offers: [
      {
        '@type': 'Offer',
        name: `${data.name} to Logan Airport — sedan`,
        price: data.sedanRate,
        priceCurrency: 'USD',
      },
      {
        '@type': 'Offer',
        name: `${data.name} to Logan Airport — SUV`,
        price: data.suvRate,
        priceCurrency: 'USD',
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="flex-grow pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

            {/* Left — copy */}
            <div>
              <Eyebrow className="mb-5">{copy.eyebrow(data).toUpperCase()}</Eyebrow>
              <h1 className="type-heading font-bold text-brand-dark mb-6">{copy.title(data)}</h1>
              <p className="type-body text-gray-600 leading-relaxed">{copy.intro(data)}</p>

              {/* Published flat rates — the reason this page exists */}
              <div className="mt-8 rounded-2xl bg-brand-ink p-6 flex flex-wrap gap-x-8 gap-y-4">
                <div>
                  <p className="type-caption font-medium text-white/60 mb-1">{copy.rateSedan}</p>
                  <p className="type-stat text-white">${data.sedanRate}</p>
                </div>
                <div className="border-l border-white/15 pl-8">
                  <p className="type-caption font-medium text-white/60 mb-1">{copy.rateSuv}</p>
                  <p className="type-stat text-white">${data.suvRate}</p>
                </div>
                <div className="border-l border-white/15 pl-8">
                  <p className="type-caption font-medium text-white/60 mb-1">{copy.rateTime}</p>
                  <p className="type-stat text-brand-pink">~{data.loganMinutes} min</p>
                </div>
                <p className="w-full type-caption text-white/40 mt-1">{copy.rateNote}</p>
              </div>

              <section className="mt-8">
                <h2 className="flex items-center gap-2 font-serif text-xl font-semibold text-brand-dark mb-3">
                  <Plane size={18} className="text-brand-magenta" />
                  {copy.loganHeading(data)}
                </h2>
                <p className="type-body-sm text-gray-500 leading-relaxed">{copy.loganBody(data)}</p>
              </section>

              <section className="mt-8">
                <h2 className="flex items-center gap-2 font-serif text-xl font-semibold text-brand-dark mb-3">
                  <MapPin size={18} className="text-brand-magenta" />
                  {copy.pickupHeading(data)}
                </h2>
                <p className="type-body-sm text-gray-500 leading-relaxed mb-4">{copy.pickupBody(data)}</p>
                <div className="flex flex-wrap gap-2">
                  {data.landmarks.map((landmark) => (
                    <span
                      key={landmark}
                      className="inline-flex items-center gap-1.5 rounded-full bg-brand-light px-4 py-1.5 type-caption font-medium text-brand-magenta"
                    >
                      <MapPin size={11} /> {landmark}
                    </span>
                  ))}
                </div>
              </section>

              <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {copy.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 type-body-sm text-gray-600">
                    <span className="mt-0.5 w-4 h-4 rounded-full bg-brand-light flex items-center justify-center flex-shrink-0">
                      <Check size={10} className="text-brand-magenta" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right — booking form; airport transfer is the primary local intent */}
            <div id="booking" className="lg:sticky lg:top-28">
              <Card padding="lg">
                <BookingForm defaultServiceType={ServiceType.AIRPORT} />
              </Card>
            </div>

          </div>
        </div>
      </main>
      <Footer />
      {/* Clears the always-visible mobile bar so it never covers footer content. */}
      <div aria-hidden className="h-16 md:hidden" />
      <StickyMobileBar />
    </div>
  );
}
