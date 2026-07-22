import { Car } from 'lucide-react';
import { requireClient } from '@/lib/auth-dal';
import { listBookingsForAccount } from '@/lib/repositories/bookings';
import { ClientRideCard } from '../_components/ClientRideCard';
import { PageHeading } from '@/components/ui/PageHeading';
import { IconBadge } from '@/components/ui/IconBadge';
import { EmptyState } from '@/components/ui/EmptyState';

export default async function MyRidesPage() {
  const user = await requireClient();
  const rides = await listBookingsForAccount(user.id, user.email);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <PageHeading
        eyebrow="My Account"
        title="My Rides"
        sub="Your past and upcoming rides, their status, and invoices."
      />

      {rides.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon={<IconBadge size="lg"><Car size={24} /></IconBadge>}
          title="No rides yet"
          message="Once you book a ride, it will show up here with its status, price, and a downloadable invoice."
        />
      ) : (
        <div className="mt-8 space-y-4">
          {rides.map((ride) => (
            <ClientRideCard key={ride.id} booking={ride} />
          ))}
        </div>
      )}
    </main>
  );
}
