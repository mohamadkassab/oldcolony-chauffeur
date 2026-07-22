import { MapPin, Calendar, Download } from 'lucide-react';
import { BookingStatus } from '@prisma/client';
import type { Booking } from '@prisma/client';
import {
  formatUSD,
  formatRideDateTime,
  SERVICE_LABEL,
  VEHICLE_LABEL,
  STATUS_META,
} from '@/lib/format';
import { buttonVariants } from '@/components/ui/buttonVariants';
import { CollapsibleCard } from '../../_components/CollapsibleCard';

export function ClientRideCard({ booking }: { booking: Booking }) {
  const status = STATUS_META[booking.status];
  const finalPrice = booking.finalPrice != null ? Number(booking.finalPrice) : null;
  const canInvoice = booking.status === BookingStatus.COMPLETED && finalPrice != null;

  const summary = (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="type-caption font-mono font-semibold text-gray-400">
            {booking.reference}
          </span>
          <span className={`rounded-full px-2.5 py-0.5 type-badge font-semibold ${status.classes}`}>
            {status.label}
          </span>
        </div>
        <p className="mt-1 flex items-center gap-2 type-body-sm text-gray-500">
          <Calendar size={13} className="flex-shrink-0 text-brand-magenta" />
          {formatRideDateTime(booking.scheduledAt)}
        </p>
      </div>
      <div className="flex-shrink-0 text-right">
        {finalPrice != null ? (
          <p className="type-subheading text-brand-magenta">{formatUSD(finalPrice)}</p>
        ) : (
          <span className="type-caption text-gray-400">
            {booking.status === BookingStatus.PENDING ? 'Awaiting price' : 'Price pending'}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <CollapsibleCard summary={summary}>
      <span className="type-caption text-gray-400">
        {SERVICE_LABEL[booking.serviceType]} · {VEHICLE_LABEL[booking.vehicleType]}
      </span>

      <div className="mt-3 space-y-1.5">
        <p className="flex items-start gap-2 type-body-sm text-gray-600">
          <MapPin size={13} className="mt-0.5 flex-shrink-0 text-brand-magenta" />
          {booking.pickup}
        </p>
        <p className="flex items-start gap-2 type-body-sm text-gray-600">
          <MapPin size={13} className="mt-0.5 flex-shrink-0 text-gray-300" />
          {booking.dropoff}
        </p>
      </div>

      {canInvoice && (
        <div className="mt-4 flex justify-end">
          <a
            href={`/account/rides/${booking.id}/invoice`}
            download
            className={buttonVariants({ variant: 'outline', size: 'sm' })}
          >
            <Download size={14} />
            Invoice
          </a>
        </div>
      )}
    </CollapsibleCard>
  );
}
