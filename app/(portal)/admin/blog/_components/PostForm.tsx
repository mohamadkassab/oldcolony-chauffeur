'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { TextInput, Textarea, FieldLabel } from '@/components/ui/Field';

interface PostFormProps {
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
  initial?: {
    id?: string;
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    coverImageUrl?: string;
  };
}

export function PostForm({ action, submitLabel, initial }: PostFormProps) {
  const [content, setContent] = useState(initial?.content ?? '');
  const [coverImageUrl, setCoverImageUrl] = useState(initial?.coverImageUrl ?? '');
  const [title, setTitle] = useState(initial?.title ?? '');

  return (
    <form action={action} className="grid gap-8 lg:grid-cols-2">
      {/* Editor */}
      <div className="space-y-4">
        {initial?.id && <input type="hidden" name="id" value={initial.id} />}

        <div>
          <FieldLabel label="Title" />
          <TextInput
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <FieldLabel label="Slug (URL) — leave blank to auto-generate" />
          <TextInput name="slug" defaultValue={initial?.slug} placeholder="my-post-title" />
        </div>

        <div>
          <FieldLabel label="Cover image URL" />
          <TextInput
            name="coverImageUrl"
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
            placeholder="/blogs/example.avif or https://…"
          />
        </div>

        <div>
          <FieldLabel label="Excerpt" />
          <Textarea name="excerpt" defaultValue={initial?.excerpt} rows={2} />
        </div>

        <div>
          <FieldLabel label="Content (HTML)" />
          <Textarea
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={14}
            placeholder="<p>Write your post…</p>"
            className="font-mono"
          />
        </div>

        <Button type="submit">{submitLabel}</Button>
      </div>

      {/* Live preview */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <p className="type-label mb-1.5 font-semibold text-gray-600">Preview</p>
        <div className="overflow-hidden rounded-2xl border border-brand-border bg-white">
          <div className="aspect-[16/9] bg-gray-100">
            {coverImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverImageUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center type-body-sm text-gray-400">
                Cover image
              </div>
            )}
          </div>
          <div className="p-6">
            <h2 className="type-subheading font-semibold text-brand-dark">{title || 'Post title'}</h2>
            <div
              className="mt-3 space-y-3 type-body-sm text-gray-600"
              dangerouslySetInnerHTML={{ __html: content || '<p>Your content preview…</p>' }}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
