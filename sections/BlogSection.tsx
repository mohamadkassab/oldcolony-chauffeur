import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { FallbackImage } from '@/components/ui/FallbackImage';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Link } from '@/i18n/navigation';
import { BlogPost } from '@/types';

export function BlogSection({ posts: allPosts, limit, showViewAll }: { posts: BlogPost[]; limit?: number; showViewAll?: boolean }) {
  const t     = useTranslations('blog');
  const posts = limit ? allPosts.slice(0, limit) : allPosts;
  // Only surface the "view all" CTA when the teaser is actually hiding posts.
  const hasMore = limit != null && allPosts.length > limit;

  return (
    <Section id="blog" tone="white">
      <SectionHeader eyebrow={t('badge')} title={t('title')} align="left" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <article key={post.id} className="group">
              {/* Each post has its own indexable page — cards are plain links. */}
              <Link href={{ pathname: '/blog/[slug]', params: { slug: post.slug } }} className="block">
                <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100 mb-4">
                  <FallbackImage
                    src={post.coverImageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    fallbackSrc="https://placehold.co/640x360/FFF0F6/C2185B?text=Blog"
                  />
                </div>
                <time className="type-caption text-gray-400 mb-2 block">{post.createdAt}</time>
                <h3 className="type-subheading font-semibold text-brand-dark mb-2 group-hover:text-brand-magenta transition-colors leading-snug">
                  {post.title}
                </h3>
                <p className="type-body-sm text-gray-500 mb-4">{post.excerpt}</p>
                <span className="inline-flex items-center gap-1.5 text-brand-magenta type-caption font-semibold group-hover:gap-3 transition-all">
                  {t('readMore')} <ArrowRight size={12} />
                </span>
              </Link>
            </article>
          ))}
      </div>

      {showViewAll && hasMore && (
        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 border border-brand-border text-gray-600 hover:border-brand-magenta hover:text-brand-magenta type-cta font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 cursor-pointer"
          >
            {t('viewAll')} <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </Section>
  );
}
