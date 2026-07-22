import Link from 'next/link';
import { BookingStatus } from '@prisma/client';
import { listBookings } from '@/lib/repositories/bookings';
import { STATUS_META } from '@/lib/format';
import { BookingCard } from './_components/BookingCard';
import { PageHeading } from '@/components/ui/PageHeading';
import { EmptyState } from '@/components/ui/EmptyState';

const TABS: { key: BookingStatus | 'ALL'; label: string }[] = [
  { key: BookingStatus.PENDING, label: 'Pending' },
  { key: BookingStatus.CONFIRMED, label: 'Confirmed' },
  { key: BookingStatus.COMPLETED, label: 'Completed' },
  { key: BookingStatus.CANCELLED, label: 'Cancelled' },
  { key: 'ALL', label: 'All' },
];

function isStatus(v: string | undefined): v is BookingStatus {
  return !!v && v in STATUS_META;
}

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const active: string = isStatus(status) ? status : BookingStatus.PENDING;

  const all = await listBookings();
  const counts = all.reduce<Record<string, number>>((acc, b) => {
    acc[b.status] = (acc[b.status] ?? 0) + 1;
    return acc;
  }, {});

  // First-rides discount: number each signed-in customer's non-cancelled rides
  // by request order so the admin can see which requests still qualify for the
  // $50 offer. Computed in-memory from the already-loaded bookings (no extra
  // queries). Guest bookings (no userId) and cancelled rides are excluded.
  const ridePositions = new Map<string, { position: number; total: number }>();
  const byCustomer = new Map<string, typeof all>();
  for (const b of all) {
    if (!b.userId || b.status === BookingStatus.CANCELLED) continue;
    const list = byCustomer.get(b.userId) ?? [];
    list.push(b);
    byCustomer.set(b.userId, list);
  }
  for (const list of byCustomer.values()) {
    const ordered = [...list].sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
    );
    ordered.forEach((b, i) =>
      ridePositions.set(b.id, { position: i + 1, total: ordered.length }),
    );
  }

  const bookings = active === 'ALL' ? all : all.filter((b) => b.status === active);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <PageHeading
        eyebrow="Admin"
        title="Booking requests"
        sub="Review ride requests, set the final price, and confirm or discard them."
      />

      {/* Status tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const isActive = tab.key === active;
          const count = tab.key === 'ALL' ? all.length : (counts[tab.key] ?? 0);
          return (
            <Link
              key={tab.key}
              href={tab.key === BookingStatus.PENDING ? '/admin' : `/admin?status=${tab.key}`}
              className={`rounded-full px-4 py-1.5 type-nav font-medium transition-colors ${
                isActive
                  ? 'bg-brand-magenta text-white'
                  : 'bg-brand-light text-gray-600 hover:bg-brand-border'
              }`}
            >
              {tab.label}
              <span className={isActive ? 'text-white/80' : 'text-gray-400'}> ({count})</span>
            </Link>
          );
        })}
      </div>

      {/* List */}
      <div className="mt-6 space-y-4">
        {bookings.length === 0 ? (
          <EmptyState message="No bookings here." />
        ) : (
          bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              ride={ridePositions.get(booking.id)}
            />
          ))
        )}
      </div>
    </main>
  );
}
