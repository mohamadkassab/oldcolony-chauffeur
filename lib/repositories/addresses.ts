import { prisma } from '@/lib/prisma';

export interface CreateAddressInput {
  label?: string | null;
  address: string;
  makeDefault?: boolean;
}

/** A user's saved addresses, default first then oldest. */
export function listAddresses(userId: string) {
  return prisma.savedAddress.findMany({
    where: { userId },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
  });
}

export async function createAddress(userId: string, input: CreateAddressInput) {
  const existing = await prisma.savedAddress.count({ where: { userId } });
  // The first address is always the default; otherwise honor the request.
  const isDefault = input.makeDefault || existing === 0;
  if (isDefault) {
    await prisma.savedAddress.updateMany({ where: { userId }, data: { isDefault: false } });
  }
  return prisma.savedAddress.create({
    data: {
      userId,
      label: input.label?.trim() || null,
      address: input.address.trim(),
      isDefault,
    },
  });
}

/** Make one address the default (ownership-scoped). */
export async function setDefaultAddress(userId: string, id: string) {
  await prisma.savedAddress.updateMany({ where: { userId }, data: { isDefault: false } });
  await prisma.savedAddress.updateMany({ where: { id, userId }, data: { isDefault: true } });
}

export async function deleteAddress(userId: string, id: string) {
  // Scope by userId so a client can only delete their own rows.
  const { count } = await prisma.savedAddress.deleteMany({ where: { id, userId } });
  if (count === 0) return;

  // If no default remains, promote the oldest surviving address.
  const stillHasDefault = await prisma.savedAddress.count({ where: { userId, isDefault: true } });
  if (stillHasDefault === 0) {
    const next = await prisma.savedAddress.findFirst({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
    if (next) {
      await prisma.savedAddress.update({ where: { id: next.id }, data: { isDefault: true } });
    }
  }
}
