import { prisma } from '@/lib/prisma';

export interface BlogPostInput {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
}

export function listBlogPosts() {
  return prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } });
}

export function getBlogPostBySlug(slug: string) {
  return prisma.blogPost.findUnique({ where: { slug } });
}

export function getBlogPostById(id: string) {
  return prisma.blogPost.findUnique({ where: { id } });
}

export function createBlogPost(input: BlogPostInput) {
  return prisma.blogPost.create({ data: input });
}

export function updateBlogPost(id: string, input: Partial<BlogPostInput>) {
  return prisma.blogPost.update({ where: { id }, data: input });
}

export function deleteBlogPost(id: string) {
  return prisma.blogPost.delete({ where: { id } });
}
