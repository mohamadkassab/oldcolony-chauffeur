import { notFound } from 'next/navigation';
import { getBlogPostById } from '@/lib/repositories/blog';
import { PostForm } from '../../_components/PostForm';
import { updatePostAction } from '../../actions';
import { PageHeading } from '@/components/ui/PageHeading';

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getBlogPostById(id);
  if (!post) notFound();

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <PageHeading eyebrow="Admin" title="Edit post" />
      <div className="mt-6">
        <PostForm
          action={updatePostAction}
          submitLabel="Save changes"
          initial={{
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content: post.content,
            coverImageUrl: post.coverImageUrl,
          }}
        />
      </div>
    </main>
  );
}
