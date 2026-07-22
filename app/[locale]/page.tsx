import { getMessages } from 'next-intl/server';
import { Navbar }               from '@/components/layout/Navbar';
import { Footer }               from '@/components/layout/Footer';
import { StickyMobileBar }      from '@/components/layout/StickyMobileBar';
import { HeroSection }          from '@/sections/HeroSection';
import { ServicesSection }      from '@/sections/ServicesSection';
import { FleetSection }         from '@/sections/FleetSection';
import { HowItWorksSection }    from '@/sections/HowItWorksSection';
import { FlatRatesSection }     from '@/sections/FlatRatesSection';
import { ServiceAreaSection }   from '@/sections/ServiceAreaSection';
import { TestimonialsSection }  from '@/sections/TestimonialsSection';
import { FAQSection }           from '@/sections/FAQSection';

export const revalidate = 60;

export default async function HomePage() {
  // FAQPage rich-result schema, built from the same localized items the FAQ
  // section renders so the markup can never drift from the visible content.
  const messages = await getMessages();
  const faqItems = (messages as { faq?: { items?: { q: string; a: string }[] } }).faq?.items ?? [];
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar transparent />
      <main className="flex-grow">
        {/* Conversion-first order: the published flat rates are the
            differentiator, so they come right after the hero. */}
        <HeroSection />
        <FlatRatesSection />
        <HowItWorksSection />
        <ServicesSection />
        <FleetSection />
        <TestimonialsSection />
        <ServiceAreaSection />
        <FAQSection />
      </main>
      <Footer />
      {faqItems.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      {/* Clears the always-visible mobile bar so it never covers footer content. */}
      <div aria-hidden className="h-16 md:hidden" />
      <StickyMobileBar />
    </div>
  );
}
