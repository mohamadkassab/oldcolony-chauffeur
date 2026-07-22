import type { Metadata } from 'next';
import { Navbar }          from '@/components/layout/Navbar';
import { Footer }          from '@/components/layout/Footer';
import { StickyMobileBar } from '@/components/layout/StickyMobileBar';
import { BlogSection }     from '@/sections/BlogSection';
import { listBlogPosts }   from '@/lib/repositories/blog';
import type { BlogPost }   from '@/types';

const BASE_URL = 'https://oldcolonychauffeur.com';

export const metadata: Metadata = {
  title: 'Boston Car Service Blog | Travel Tips & Logan Airport Guides | Old Colony Chauffeur',
  description: 'The Old Colony Chauffeur blog — Boston car service tips, Logan Airport travel guides, and local transportation insights across Greater Boston.',
  alternates: {
    canonical: `${BASE_URL}/blog`,
    languages: {
      // Default locale (en) is served at the root, not `/en`.
      'en': `${BASE_URL}/blog`,
      'fr': `${BASE_URL}/fr/blog`,
      'x-default': `${BASE_URL}/blog`,
    },
  },
};

// Re-generate at most once a minute so new admin posts surface without a redeploy.
export const revalidate = 60;

export default async function BlogPage() {
  // Never let a DB hiccup take down the page — degrade to an empty list.
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
    console.error('Failed to load blog posts', err);
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow">
        {/* No `limit` — the listing shows every post. */}
        <BlogSection posts={posts} />
      </main>
      <Footer />
      {/* Clears the always-visible mobile bar so it never covers footer content. */}
      <div aria-hidden className="h-16 md:hidden" />
      <StickyMobileBar />
    </div>
  );
}
