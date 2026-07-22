import Link from 'next/link';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { listBlogPosts } from '@/lib/repositories/blog';
import { Button } from '@/components/ui/Button';
import { PageHeading } from '@/components/ui/PageHeading';
import { Card } from '@/components/ui/Card';
import { ConfirmSubmit } from '../../_components/ConfirmSubmit';
import { deletePostAction } from './actions';

export default async function AdminBlogPage() {
  const posts = await listBlogPosts();

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex items-end justify-between gap-4">
        <PageHeading eyebrow="Admin" title="Blog posts" sub={`${posts.length} posts`} />
        <Link href="/admin/blog/new">
          <Button size="sm">
            <Plus size={14} /> New post
          </Button>
        </Link>
      </div>

      <Card padding="none" className="mt-6 divide-y divide-brand-border overflow-hidden">
        {posts.map((post) => (
          <div key={post.id} className="flex items-center gap-4 p-4">
            <div className="h-14 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.coverImageUrl} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-grow">
              <p className="type-body-sm truncate font-semibold text-brand-dark">{post.title}</p>
              <p className="type-caption truncate text-gray-400">
                /{post.slug} · {post.createdAt.toISOString().slice(0, 10)}
              </p>
            </div>
            <Link
              href={`/admin/blog/${post.id}/edit`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-brand-border px-3 py-1.5 type-caption font-semibold text-gray-600 transition-colors hover:border-brand-magenta hover:text-brand-magenta"
            >
              <Pencil size={13} /> Edit
            </Link>
            <ConfirmSubmit
              action={deletePostAction}
              id={post.id}
              title="Delete this post?"
              message={`"${post.title}" will be permanently removed from the site. This cannot be undone.`}
              confirmLabel="Delete post"
              triggerClassName="inline-flex items-center gap-1.5 rounded-lg border border-brand-border px-3 py-1.5 type-caption font-semibold text-gray-500 transition-colors hover:border-red-400 hover:text-red-500 cursor-pointer"
            >
              <Trash2 size={13} /> Delete
            </ConfirmSubmit>
          </div>
        ))}
      </Card>
    </main>
  );
}
