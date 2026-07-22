import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Calendar, ArrowLeft, Phone } from 'lucide-react';
import { Navbar }             from '@/components/layout/Navbar';
import { Footer }             from '@/components/layout/Footer';
import { StickyMobileBar }    from '@/components/layout/StickyMobileBar';
import { FallbackImage }      from '@/components/ui/FallbackImage';
import { ButtonLink }         from '@/components/ui/ButtonLink';
import { Link }               from '@/i18n/navigation';
import { getBlogPostBySlug }  from '@/lib/repositories/blog';

const BASE_URL = 'https://oldcolonychauffeur.com';

// Re-generate at most once a minute so admin edits surface without a redeploy.
export const revalidate = 60;

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug).catch(() => null);
  if (!post) return {};

  return {
    title: `${post.title} | Old Colony Chauffeur`,
    description: post.excerpt,
    alternates: {
      canonical: `${BASE_URL}/blog/${post.slug}`,
      languages: {
        // Default locale (en) is served at the root, not `/en`.
        'en': `${BASE_URL}/blog/${post.slug}`,
        'fr': `${BASE_URL}/fr/blog/${post.slug}`,
        'x-default': `${BASE_URL}/blog/${post.slug}`,
      },
    },
    openGraph: {
      type: 'article',
      url: `${BASE_URL}/blog/${post.slug}`,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.createdAt.toISOString(),
      images: [{ url: `${BASE_URL}${post.coverImageUrl}`, alt: post.title }],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug).catch(() => null);
  if (!post) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: `${BASE_URL}${post.coverImageUrl}`,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    url: `${BASE_URL}/blog/${post.slug}`,
    author: { '@type': 'Organization', name: 'Old Colony Chauffeur', url: BASE_URL },
    publisher: { '@type': 'Organization', name: 'Old Colony Chauffeur', url: BASE_URL },
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="flex-grow pt-24 pb-20">
        <article className="max-w-3xl mx-auto px-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 type-caption font-semibold text-brand-magenta hover:text-brand-pink transition-colors"
          >
            <ArrowLeft size={14} /> All posts
          </Link>

          <div className="mt-6 aspect-[2/1] rounded-2xl overflow-hidden bg-gray-100">
            <FallbackImage
              src={post.coverImageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
              fallbackSrc="https://placehold.co/800x400/FFF0F6/C2185B?text=Blog"
            />
          </div>

          <div className="mt-8 flex items-center gap-1.5 type-caption text-gray-400">
            <Calendar size={12} />
            {post.createdAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
          <h1 className="mt-3 font-serif text-3xl md:text-4xl font-bold text-brand-dark leading-tight">
            {post.title}
          </h1>

          <div
            className="mt-8 text-gray-600 type-body-sm leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: post.content || `<p>${post.excerpt}</p>` }}
          />

          <div className="mt-12 pt-8 border-t border-brand-border">
            <ButtonLink href="tel:+17812345451" fullWidth>
              <Phone size={15} /> Request a Ride Now
            </ButtonLink>
          </div>
        </article>
      </main>
      <Footer />
      {/* Clears the always-visible mobile bar so it never covers footer content. */}
      <div aria-hidden className="h-16 md:hidden" />
      <StickyMobileBar />
    </div>
  );
}
