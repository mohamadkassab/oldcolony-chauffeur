import { BookingStatus, Role } from '@prisma/client';
import { getCurrentUser } from '@/lib/auth-dal';
import { getBookingById } from '@/lib/repositories/bookings';
import { renderInvoicePdf } from '@/lib/invoice/renderInvoice';

// react-pdf needs the Node runtime.
export const runtime = 'nodejs';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) return new Response('Unauthorized', { status: 401 });

  const { id } = await params;
  const booking = await getBookingById(id);
  if (!booking) return new Response('Not found', { status: 404 });

  // Only the owning client (matched by account or email) — or an admin — may
  // download. Guards against enumerating other people's invoices by id.
  const owns =
    booking.userId === user.id ||
    (!!booking.email && !!user.email && booking.email.toLowerCase() === user.email.toLowerCase());
  if (user.role !== Role.ADMIN && !owns) {
    return new Response('Forbidden', { status: 403 });
  }

  if (booking.status !== BookingStatus.COMPLETED || booking.finalPrice == null) {
    return new Response('Invoice not available for this booking yet', { status: 400 });
  }

  const pdf = await renderInvoicePdf(booking);
  return new Response(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="invoice-${booking.reference}.pdf"`,
      'Cache-Control': 'private, no-store',
    },
  });
}
