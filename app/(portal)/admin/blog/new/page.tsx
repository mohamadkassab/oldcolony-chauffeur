import { PostForm } from '../_components/PostForm';
import { createPostAction } from '../actions';
import { PageHeading } from '@/components/ui/PageHeading';

export default function NewBlogPostPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <PageHeading eyebrow="Admin" title="New post" />
      <div className="mt-6">
        <PostForm action={createPostAction} submitLabel="Create post" />
      </div>
    </main>
  );
}
