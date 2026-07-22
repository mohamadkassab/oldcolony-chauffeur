import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { Role } from '@prisma/client';
import { getUserById } from '@/lib/repositories/users';
import { listBookingsForAccount } from '@/lib/repositories/bookings';
import {
  formatUSD,
  formatRideDateTime,
  SERVICE_LABEL,
  VEHICLE_LABEL,
  STATUS_META,
} from '@/lib/format';
import { PageHeading } from '@/components/ui/PageHeading';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';

export default async function AdminUserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUserById(id);
  if (!user) notFound();

  const rides = await listBookingsForAccount(user.id, user.email);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-1.5 type-body-sm text-gray-500 transition-colors hover:text-brand-magenta"
      >
        <ArrowLeft size={15} /> Back to users
      </Link>

      <div className="mt-4">
        <PageHeading eyebrow="Client profile" title={user.name ?? user.email} />
      </div>

      {/* Profile details */}
      <Card padding="md" className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="type-subheading text-brand-dark">Details</h2>
          <span
            className={`rounded-full px-2.5 py-0.5 type-badge font-semibold ${
              user.role === Role.ADMIN
                ? 'bg-brand-magenta/10 text-brand-magenta'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {user.role}
          </span>
        </div>

        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <Detail icon={<Mail size={14} />} label="Email" value={user.email} />
          <Detail icon={<Phone size={14} />} label="Phone" value={user.phone ?? '—'} />
          <Detail
            icon={<MapPin size={14} />}
            label="Default pickup address"
            value={user.defaultAddress ?? '—'}
          />
          <Detail
            icon={<Calendar size={14} />}
            label="Joined"
            value={formatRideDateTime(user.createdAt)}
          />
        </dl>
      </Card>

      {/* Rides */}
      <h2 className="type-subheading mt-10 text-brand-dark">
        Rides <span className="type-body-sm font-normal text-gray-400">({rides.length})</span>
      </h2>

      {rides.length === 0 ? (
        <EmptyState className="mt-4" message="This client has no rides yet." />
      ) : (
        <div className="mt-4 space-y-3">
          {rides.map((ride) => {
            const status = STATUS_META[ride.status];
            const finalPrice = ride.finalPrice != null ? Number(ride.finalPrice) : null;
            return (
              <Card key={ride.id} padding="sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="type-caption font-mono font-semibold text-gray-400">
                      {ride.reference}
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 type-badge font-semibold ${status.classes}`}>
                      {status.label}
                    </span>
                  </div>
                  <span className="type-caption text-gray-400">
                    {SERVICE_LABEL[ride.serviceType]} · {VEHICLE_LABEL[ride.vehicleType]}
                  </span>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <p className="type-body-sm flex items-center gap-2 text-gray-500">
                      <Calendar size={13} className="text-brand-magenta" />
                      {formatRideDateTime(ride.scheduledAt)}
                    </p>
                    <p className="type-body-sm flex items-start gap-2 text-gray-600">
                      <MapPin size={13} className="mt-0.5 flex-shrink-0 text-brand-magenta" />
                      {ride.pickup}
                    </p>
                    <p className="type-body-sm flex items-start gap-2 text-gray-600">
                      <MapPin size={13} className="mt-0.5 flex-shrink-0 text-gray-300" />
                      {ride.dropoff}
                    </p>
                  </div>
                  <div className="sm:text-right">
                    {finalPrice != null ? (
                      <p className="type-subheading text-brand-magenta">{formatUSD(finalPrice)}</p>
                    ) : (
                      <span className="type-body-sm text-gray-400">Price pending</span>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </main>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt className="type-caption flex items-center gap-1.5 text-gray-400">
        <span className="text-brand-magenta">{icon}</span>
        {label}
      </dt>
      <dd className="type-body-sm mt-1 font-medium text-brand-dark">{value}</dd>
    </div>
  );
}
