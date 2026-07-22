'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth-dal';
import {
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from '@/lib/repositories/blog';
import { routing } from '@/i18n/routing';

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function revalidateBlog() {
  revalidatePath('/admin/blog');
  // The public homepage renders the latest posts, per-locale. The default locale
  // lives at the root (`localePrefix: 'as-needed'`); the others are prefixed.
  for (const locale of routing.locales) {
    revalidatePath(locale === routing.defaultLocale ? '/' : `/${locale}`);
  }
}

function readFields(formData: FormData) {
  const title = String(formData.get('title') ?? '').trim();
  return {
    title,
    slug: String(formData.get('slug') ?? '').trim() || slugify(title),
    excerpt: String(formData.get('excerpt') ?? '').trim(),
    content: String(formData.get('content') ?? ''),
    coverImageUrl: String(formData.get('coverImageUrl') ?? '').trim(),
  };
}

export async function createPostAction(formData: FormData) {
  await requireAdmin();
  const data = readFields(formData);
  if (!data.title || !data.slug) return;
  await createBlogPost(data);
  revalidateBlog();
  redirect('/admin/blog');
}

export async function updatePostAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  const data = readFields(formData);
  if (!data.title || !data.slug) return;
  await updateBlogPost(id, data);
  revalidateBlog();
  redirect('/admin/blog');
}

export async function deletePostAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  await deleteBlogPost(id);
  revalidateBlog();
  revalidatePath('/admin/blog');
}
