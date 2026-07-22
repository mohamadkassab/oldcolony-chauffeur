import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { Role } from '@prisma/client';
import { auth } from '@/auth';

/**
 * Centralized authorization. Pages/layouts/route handlers call these rather
 * than reading the session directly, so the checks stay consistent.
 * `cache` dedupes the session lookup within a single render pass.
 */
export const getCurrentUser = cache(async () => {
  const session = await auth();
  return session?.user ?? null;
});

/** Any authenticated user (no role constraint). */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  return user;
}

/** Admin-only area. Clients are sent to their own account area. */
export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (user.role !== Role.ADMIN) redirect('/account');
  return user;
}

/** Client-only area. Admins are sent to the admin area. */
export async function requireClient() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  if (user.role === Role.ADMIN) redirect('/admin');
  return user;
}
