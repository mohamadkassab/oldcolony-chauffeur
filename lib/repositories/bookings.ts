import { Prisma, BookingStatus } from '@prisma/client';
import type { ServiceType, VehicleType } from '@prisma/client';
import { prisma } from '@/lib/prisma';

// Server-managed fields (reference, status, finalPrice, timestamps) are not
// part of the create input — they are assigned here, not by the caller.
export interface CreateBookingInput {
  serviceType: ServiceType;
  vehicleType: VehicleType;
  vehicleId?: string | null;
  pickup: string;
  dropoff: string;
  passengers: number;
  luggageCount?: number | null;
  flightNumber?: string | null;
  returnTrip?: boolean;
  returnDatetime?: Date | null;
  scheduledAt: Date;
  notes?: string | null;
  name: string;
  phone: string;
  email?: string | null;
  userId?: string | null;
}

/**
 * Build a human-friendly reference like `OC-2026-0042`, scoped per calendar
 * year. The DB unique constraint on `reference` is the real guarantee; this
 * just produces the next likely value, and createBooking retries on collision.
 */
async function nextReference(year: number): Promise<string> {
  const start = new Date(Date.UTC(year, 0, 1));
  const end = new Date(Date.UTC(year + 1, 0, 1));
  const countThisYear = await prisma.booking.count({
    where: { createdAt: { gte: start, lt: end } },
  });
  const seq = String(countThisYear + 1).padStart(4, '0');
  return `OC-${year}-${seq}`;
}

export async function createBooking(input: CreateBookingInput) {
  const year = new Date().getFullYear();

  // Retry a few times in case two bookings race for the same reference.
  for (let attempt = 0; attempt < 5; attempt++) {
    const reference = await nextReference(year);
    try {
      return await prisma.booking.create({
        data: { ...input, reference },
      });
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002' // unique constraint violation on reference
      ) {
        continue;
      }
      throw err;
    }
  }
  throw new Error('Could not allocate a unique booking reference');
}

export function getBookingById(id: string) {
  return prisma.booking.findUnique({ where: { id } });
}

export function getBookingByReference(reference: string) {
  return prisma.booking.findUnique({ where: { reference } });
}

export function listBookings(status?: BookingStatus) {
  return prisma.booking.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: 'desc' },
  });
}

export function listBookingsForUser(userId: string) {
  return prisma.booking.findMany({
    where: { userId },
    orderBy: { scheduledAt: 'desc' },
  });
}

export function listBookingsForEmail(email: string) {
  return prisma.booking.findMany({
    where: { email },
    orderBy: { scheduledAt: 'desc' },
  });
}

/** A client's rides: those linked to their account plus any guest bookings made
 *  with the same email before/without signing in. */
export function listBookingsForAccount(userId: string, email?: string | null) {
  return prisma.booking.findMany({
    where: { OR: [{ userId }, ...(email ? [{ email }] : [])] },
    orderBy: { scheduledAt: 'desc' },
  });
}

/** Count a client's non-cancelled rides (account + any guest bookings made with
 *  the same email). Drives the first-rides discount eligibility. */
export function countActiveBookingsForAccount(userId: string, email?: string | null) {
  return prisma.booking.count({
    where: {
      status: { not: BookingStatus.CANCELLED },
      OR: [{ userId }, ...(email ? [{ email }] : [])],
    },
  });
}

export function updateBookingStatus(id: string, status: BookingStatus) {
  return prisma.booking.update({ where: { id }, data: { status } });
}

/** Admin sets the final price and confirms the ride in one step. */
export function confirmBooking(id: string, finalPrice: number) {
  return prisma.booking.update({
    where: { id },
    data: { finalPrice, status: BookingStatus.CONFIRMED },
  });
}

export function cancelBooking(id: string) {
  return prisma.booking.update({
    where: { id },
    data: { status: BookingStatus.CANCELLED },
  });
}

/** Permanently remove a booking. Admin-only; irreversible. */
export function deleteBooking(id: string) {
  return prisma.booking.delete({ where: { id } });
}
