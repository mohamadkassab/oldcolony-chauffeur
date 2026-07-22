import { prisma } from '@/lib/prisma';

export function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export interface UpdateUserProfileInput {
  phone?: string | null;
  defaultAddress?: string | null;
}

/** Update the client-editable profile fields. */
export function updateUserProfile(id: string, data: UpdateUserProfileInput) {
  return prisma.user.update({ where: { id }, data });
}

/** Paginated list of users for the admin directory, newest first. */
export async function listUsersPaginated({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) {
  const skip = (page - 1) * pageSize;
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
    }),
    prisma.user.count(),
  ]);
  return { users, total };
}
