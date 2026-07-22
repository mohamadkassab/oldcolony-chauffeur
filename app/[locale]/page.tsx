import { Navbar }               from '@/components/layout/Navbar';
import { Footer }               from '@/components/layout/Footer';
import { StickyMobileBar }      from '@/components/layout/StickyMobileBar';
import { HeroSection }          from '@/sections/HeroSection';
import { StatsSection }         from '@/sections/StatsSection';
import { ServicesSection }      from '@/sections/ServicesSection';
import { FleetSection }         from '@/sections/FleetSection';
import { BlogSection }          from '@/sections/BlogSection';
import { HowItWorksSection }    from '@/sections/HowItWorksSection';
import { FlatRatesSection }     from '@/sections/FlatRatesSection';
import { ServiceAreaSection }   from '@/sections/ServiceAreaSection';
import { TestimonialsSection }  from '@/sections/TestimonialsSection';
import { FAQSection }           from '@/sections/FAQSection';
import { listBlogPosts }        from '@/lib/repositories/blog';
import type { BlogPost }        from '@/types';

// Re-generate the page at most once a minute so admin blog edits surface.
export const revalidate = 60;

export default async function HomePage() {
  // Never let a DB hiccup take down the public homepage — degrade to no posts.
  let posts: BlogPost[] = [];
  try {
    const dbPosts = await listBlogPosts();
    posts = dbPosts.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      coverImageUrl: p.coverImageUrl,
      createdAt: p.createdAt.toISOString().slice(0, 10),
    }));
  } catch (err) {
    console.error('Failed to load blog posts for homepage', err);
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar transparent />
      <main className="flex-grow">
        {/* Section order mirrors the approved design (design brief §homepage). */}
        <HeroSection />
        <StatsSection />
        <ServicesSection />
        <FleetSection />
        <HowItWorksSection />
        <FlatRatesSection />
        <TestimonialsSection />
        <ServiceAreaSection />
        <FAQSection />
        <BlogSection posts={posts} limit={3} showViewAll />
      </main>
      <Footer />
      {/* Clears the always-visible mobile bar so it never covers footer content. */}
      <div aria-hidden className="h-16 md:hidden" />
      <StickyMobileBar />
    </div>
  );
}
