import { NextRequest, NextResponse } from 'next/server';
import { ServiceType, VehicleType } from '@prisma/client';
import { sendTelegramMessage } from '@/lib/telegram';
import { sendBookingEmail, sendBookingConfirmationEmail } from '@/lib/email';
import { verifyRecaptcha } from '@/lib/recaptcha';
import { createBooking } from '@/lib/repositories/bookings';
import { formatVehicle } from '@/lib/format';
import { auth } from '@/auth';
import type { BookingFormData } from '@/types';

const SERVICE_TYPES = new Set<string>(Object.values(ServiceType));
const VEHICLE_TYPES = new Set<string>(Object.values(VehicleType));

/** Combine the form's date ('YYYY-MM-DD') + time ('HH:MM') into a stable
 *  wall-clock instant (encoded as UTC) so it round-trips regardless of server TZ. */
function toScheduledAt(date?: string, time?: string): Date | null {
  if (!date) return null;
  const d = new Date(`${date}T${time || '00:00'}:00.000Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function toDateOrNull(datetimeLocal?: string): Date | null {
  if (!datetimeLocal) return null;
  const d = new Date(`${datetimeLocal}:00.000Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as BookingFormData & {
    recaptchaToken?: string;
    company?: string;
  };

  // Honeypot: humans never see/fill the `company` field; bots do. Drop silently.
  if (body.company) {
    return NextResponse.json({ success: true });
  }

  if (!body.name || !body.phone || !body.pickup || !body.dropoff) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Reject anything without a valid reCAPTCHA token (blocks direct API spam).
  const human = await verifyRecaptcha(body.recaptchaToken);
  if (!human) {
    return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
  }

  // Coerce enums to the DB contract; fall back to sane defaults.
  const serviceType = SERVICE_TYPES.has(body.serviceType)
    ? (body.serviceType as ServiceType)
    : ServiceType.city;
  const vehicleType = VEHICLE_TYPES.has(body.vehicleType)
    ? (body.vehicleType as VehicleType)
    : VehicleType.vip;

  const scheduledAt = toScheduledAt(body.date, body.time) ?? new Date();

  // Link to the signed-in user (and use their verified email) when available.
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const email = session?.user?.email ?? body.email ?? null;

  let reference = '';
  try {
    const booking = await createBooking({
      serviceType,
      vehicleType,
      vehicleId: body.vehicleId ?? null,
      pickup: body.pickup,
      dropoff: body.dropoff,
      passengers: body.passengers,
      luggageCount: body.luggageCount ?? null,
      flightNumber: body.flightNumber ?? null,
      returnTrip: body.returnTrip ?? false,
      returnDatetime: toDateOrNull(body.returnDatetime),
      scheduledAt,
      notes: body.notes ?? null,
      name: body.name,
      phone: body.phone,
      email,
      userId,
    });
    reference = booking.reference;
  } catch (err) {
    console.error('Failed to persist booking', err);
    return NextResponse.json({ error: 'Could not save booking' }, { status: 500 });
  }

  // Notify the operator + confirm to the client (best-effort; never block the
  // response). Email via Resend (replaces the old client-side EmailJS path, so
  // reCAPTCHA is verified exactly once — here).
  const emailData = { ...body, email: email ?? undefined };
  await sendBookingEmail(emailData, reference).catch((err) =>
    console.error('Booking email failed', err),
  );
  await sendBookingConfirmationEmail(emailData, reference).catch((err) =>
    console.error('Booking confirmation email failed', err),
  );

  const date = scheduledAt.toLocaleDateString('en-US', { timeZone: 'UTC' });
  const telegramText = [
    '<b>🚗 New Ride Request</b>',
    `<b>Ref:</b> ${reference}`,
    `<b>Name:</b> ${body.name}`,
    `<b>Phone:</b> ${body.phone}`,
    `<b>Email:</b> ${email ?? '—'}`,
    `<b>From:</b> ${body.pickup}`,
    `<b>To:</b> ${body.dropoff}`,
    `<b>Service:</b> ${serviceType} | <b>Vehicle:</b> ${formatVehicle(body.vehicleId, vehicleType)}`,
    `<b>Passengers:</b> ${body.passengers}`,
    `<b>Date:</b> ${date} at ${body.time}`,
    body.notes ? `<b>Notes:</b> ${body.notes}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  await sendTelegramMessage(telegramText).catch(() => {});

  return NextResponse.json({ success: true, reference });
}
