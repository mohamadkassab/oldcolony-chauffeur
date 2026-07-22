import { Resend } from 'resend';
import type { BookingFormData } from '@/types';
import { formatVehicle } from '@/lib/format';
import { wrapEmail, detailTable, BRAND, type EmailRow } from '@/lib/email/layout';

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? '';
const BOOKING_FROM_EMAIL =
  process.env.BOOKING_FROM_EMAIL ?? `Old Colony Chauffeur <${BRAND.email}>`;
const BOOKING_NOTIFICATION_EMAIL =
  process.env.BOOKING_NOTIFICATION_EMAIL ?? 'info@oldcolonychauffeur.com';

function cap(value: string): string {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}

function formatDate(date?: string): string {
  return date ? new Date(date + 'T12:00:00').toLocaleDateString('en-US') : '—';
}

/** Trip + contact rows shared by the operator + client emails. */
function bookingRows(data: BookingFormData, includeContact: boolean): EmailRow[] {
  const rows: EmailRow[] = [];
  if (includeContact) {
    rows.push({ label: 'Name', value: data.name });
    rows.push({ label: 'Phone', value: data.phone });
    rows.push({ label: 'Email', value: data.email ?? '—' });
  }
  rows.push({ label: 'Service', value: cap(data.serviceType) });
  rows.push({ label: 'Vehicle', value: formatVehicle(data.vehicleId, data.vehicleType) });
  rows.push({ label: 'Pickup', value: data.pickup });
  rows.push({ label: 'Dropoff', value: data.dropoff });
  rows.push({ label: 'Passengers', value: String(data.passengers) });
  rows.push({ label: 'Date & time', value: `${formatDate(data.date)} at ${data.time}` });
  if (data.quotedRate) rows.push({ label: 'Quoted flat rate', value: `$${data.quotedRate} (tolls included)` });
  if (data.flightNumber) rows.push({ label: 'Flight', value: data.flightNumber });
  if (data.notes) rows.push({ label: 'Notes', value: data.notes });
  return rows;
}

/** Operator notification — sent to the business when a new request comes in. */
export async function sendBookingEmail(
  data: BookingFormData,
  reference?: string,
): Promise<void> {
  // Fail soft when not configured (mirrors the Telegram helper); bookings still
  // persist and other notifications still fire.
  if (!RESEND_API_KEY) return;
  const resend = new Resend(RESEND_API_KEY);

  const rows: EmailRow[] = reference
    ? [{ label: 'Reference', value: reference }, ...bookingRows(data, true)]
    : bookingRows(data, true);

  const html = wrapEmail({
    heading: 'New ride request',
    intro: 'A new booking request just came in. Review it and set the final price in the admin dashboard.',
    contentHtml: detailTable(rows),
    preheader: `New request from ${data.name}`,
  });

  // Resend returns { error } instead of throwing — surface it so failures
  // (e.g. unverified sending domain) are visible in server logs.
  const { error } = await resend.emails.send({
    from: BOOKING_FROM_EMAIL,
    to: [BOOKING_NOTIFICATION_EMAIL],
    subject: `New Ride Request — ${reference ?? data.name} — ${formatDate(data.date)}`,
    html,
  });

  if (error) console.error('Resend booking email error:', error);
}

/** Client confirmation — sent to the rider so they know the request was received. */
export async function sendBookingConfirmationEmail(
  data: BookingFormData,
  reference?: string,
): Promise<void> {
  if (!RESEND_API_KEY || !data.email) return;
  const resend = new Resend(RESEND_API_KEY);

  const intro =
    `Thanks, ${data.name.split(' ')[0] || 'there'} — we've received your ride request` +
    `${reference ? ` (${reference})` : ''}. Our team will confirm availability and send you the final price shortly. ` +
    'If anything changes, just reply to this email or call us.';

  const html = wrapEmail({
    heading: 'Your ride request is in!',
    intro,
    contentHtml: detailTable(bookingRows(data, false)),
    preheader: 'We received your ride request and will confirm shortly.',
  });

  const { error } = await resend.emails.send({
    from: BOOKING_FROM_EMAIL,
    to: [data.email],
    subject: `We received your ride request${reference ? ` — ${reference}` : ''}`,
    html,
  });

  if (error) console.error('Resend confirmation email error:', error);
}
