'use server';

import { revalidatePath } from 'next/cache';
import { BookingStatus } from '@prisma/client';
import { requireAdmin } from '@/lib/auth-dal';
import {
  confirmBooking,
  cancelBooking,
  updateBookingStatus,
  getBookingById,
  deleteBooking,
} from '@/lib/repositories/bookings';

export async function confirmBookingAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get('id') ?? '');
  const price = Number(formData.get('price'));
  if (!id || !Number.isFinite(price) || price < 0) return;

  const booking = await getBookingById(id);
  if (booking?.status !== BookingStatus.PENDING) return; // only price pending requests
  await confirmBooking(id, price);
  revalidatePath('/admin');
}

export async function cancelBookingAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get('id') ?? '');
  if (!id) return;

  const booking = await getBookingById(id);
  // Don't "cancel" a ride that's already completed or cancelled.
  if (booking?.status !== BookingStatus.PENDING && booking?.status !== BookingStatus.CONFIRMED) {
    return;
  }
  await cancelBooking(id);
  revalidatePath('/admin');
}

export async function completeBookingAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get('id') ?? '');
  if (!id) return;

  const booking = await getBookingById(id);
  if (booking?.status !== BookingStatus.CONFIRMED) return; // only confirmed rides complete
  await updateBookingStatus(id, BookingStatus.COMPLETED);
  revalidatePath('/admin');
}

export async function deleteBookingAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  await deleteBooking(id);
  revalidatePath('/admin');
}
