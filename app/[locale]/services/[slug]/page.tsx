import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Check } from 'lucide-react';
import { Navbar }          from '@/components/layout/Navbar';
import { Footer }          from '@/components/layout/Footer';
import { StickyMobileBar } from '@/components/layout/StickyMobileBar';
import { BookingForm }     from '@/components/ui/BookingForm';
import { Card }            from '@/components/ui/Card';
import { Eyebrow }         from '@/components/ui/Eyebrow';
import { SERVICE_PAGES, getServicePage } from '@/lib/services-content';
import type { Locale } from '@/types';

const BASE_URL = 'https://oldcolonychauffeur.com';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return SERVICE_PAGES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = getServicePage(slug);
  if (!service) return {};
  const copy = service.copy[locale as Locale] ?? service.copy.en;

  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    alternates: {
      canonical: `${BASE_URL}/services/${service.slug}`,
      languages: {
        // Default locale (en) is served at the root, not `/en`.
        'en': `${BASE_URL}/services/${service.slug}`,
        'fr': `${BASE_URL}/fr/services/${service.slug}`,
        'x-default': `${BASE_URL}/services/${service.slug}`,
      },
    },
    openGraph: {
      type: 'website',
      url: `${BASE_URL}/services/${service.slug}`,
      title: copy.metaTitle,
      description: copy.metaDescription,
    },
  };
}

export default async function ServicePage({ params }: Props) {
  const { locale, slug } = await params;
  const service = getServicePage(slug);
  if (!service) notFound();
  const copy = service.copy[locale as Locale] ?? service.copy.en;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: copy.eyebrow,
    description: copy.metaDescription,
    url: `${BASE_URL}/services/${service.slug}`,
    areaServed: 'Greater Boston, MA',
    provider: {
      '@type': 'LocalBusiness',
      name: 'Old Colony Chauffeur',
      telephone: '+17812345451',
      url: BASE_URL,
    },
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
              <Eyebrow className="mb-5">{copy.eyebrow.toUpperCase()}</Eyebrow>
              <h1 className="type-heading font-bold text-brand-dark mb-6">{copy.title}</h1>
              <p className="type-body text-gray-600 leading-relaxed">{copy.intro}</p>

              {copy.sections.map((section) => (
                <section key={section.heading} className="mt-8">
                  <h2 className="font-serif text-xl font-semibold text-brand-dark mb-3">
                    {section.heading}
                  </h2>
                  <p className="type-body-sm text-gray-500 leading-relaxed">{section.body}</p>
                </section>
              ))}

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

            {/* Right — booking form, pre-selected to this service */}
            <div id="booking" className="lg:sticky lg:top-28">
              <Card padding="lg">
                <BookingForm defaultServiceType={service.serviceType} />
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
