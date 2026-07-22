import Link from 'next/link';
import { MapPin, Phone, Mail, Users, Plane, Calendar, Download, ExternalLink } from 'lucide-react';
import { BookingStatus } from '@prisma/client';
import type { Booking } from '@prisma/client';
import { Button } from '@/components/ui/Button';
import { buttonVariants } from '@/components/ui/buttonVariants';
import {
  formatUSD,
  formatRideDateTime,
  formatVehicle,
  SERVICE_LABEL,
  STATUS_META,
} from '@/lib/format';
import {
  confirmBookingAction,
  cancelBookingAction,
  completeBookingAction,
  deleteBookingAction,
} from '../actions';
import { ConfirmSubmit } from '../../_components/ConfirmSubmit';
import { CollapsibleCard } from '../../_components/CollapsibleCard';
import { TextInput, FieldLabel } from '@/components/ui/Field';

const OUTLINE_BTN = buttonVariants({ variant: 'outline', size: 'sm' });

export function BookingCard({
  booking,
  ride,
}: {
  booking: Booking;
  ride?: { position: number; total: number };
}) {
  const status = STATUS_META[booking.status];
  const finalPrice = booking.finalPrice != null ? Number(booking.finalPrice) : null;

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
        <p className="mt-1 truncate type-subheading text-brand-dark">{booking.name}</p>
      </div>
      <div className="flex-shrink-0 text-right">
        <p className="type-caption text-gray-400">{formatRideDateTime(booking.scheduledAt)}</p>
        {finalPrice != null && (
          <p className="type-subheading text-brand-magenta">{formatUSD(finalPrice)}</p>
        )}
      </div>
    </div>
  );

  return (
    <CollapsibleCard summary={summary} defaultOpen={booking.status === BookingStatus.PENDING}>
      <span className="type-caption text-gray-400">
        {SERVICE_LABEL[booking.serviceType]} · {formatVehicle(booking.vehicleId, booking.vehicleType)}
      </span>

      {/* Ride-count context for the operator (signed-in customers only) */}
      {ride && (
        <p className="mt-3 type-caption text-gray-400">
          Customer&apos;s ride #{ride.position} · {ride.total} rides total
        </p>
      )}

      {/* Customer + trip */}
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          {booking.userId && (
            <Link
              href={`/admin/users/${booking.userId}`}
              className="inline-flex items-center gap-1.5 type-body-sm font-medium text-brand-magenta transition-colors hover:underline"
            >
              <ExternalLink size={13} /> View customer profile
            </Link>
          )}
          <p className="flex items-center gap-2 type-body-sm text-gray-500">
            <Phone size={13} className="text-brand-magenta" /> {booking.phone}
          </p>
          {booking.email && (
            <p className="flex items-center gap-2 type-body-sm text-gray-500">
              <Mail size={13} className="text-brand-magenta" /> {booking.email}
            </p>
          )}
          <p className="flex items-center gap-2 type-body-sm text-gray-500">
            <Users size={13} className="text-brand-magenta" /> {booking.passengers} passenger
            {booking.passengers === 1 ? '' : 's'}
            {booking.luggageCount ? ` · ${booking.luggageCount} bags` : ''}
          </p>
          {booking.flightNumber && (
            <p className="flex items-center gap-2 type-body-sm text-gray-500">
              <Plane size={13} className="text-brand-magenta" /> {booking.flightNumber}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <p className="flex items-center gap-2 type-body-sm text-gray-500">
            <Calendar size={13} className="text-brand-magenta" />
            {formatRideDateTime(booking.scheduledAt)}
          </p>
          <p className="flex items-start gap-2 type-body-sm text-gray-600">
            <MapPin size={13} className="mt-0.5 flex-shrink-0 text-brand-magenta" />
            {booking.pickup}
          </p>
          <p className="flex items-start gap-2 type-body-sm text-gray-600">
            <MapPin size={13} className="mt-0.5 flex-shrink-0 text-gray-300" />
            {booking.dropoff}
          </p>
        </div>
      </div>

      {booking.notes && (
        <p className="mt-3 rounded-lg bg-brand-blush px-3 py-2 type-body-sm text-gray-600">
          {booking.notes}
        </p>
      )}

      {/* Price + actions */}
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4 border-t border-brand-border pt-4">
        {finalPrice != null ? (
          <div>
            <p className="type-caption text-gray-400">Price</p>
            <p className="type-subheading text-brand-magenta">{formatUSD(finalPrice)}</p>
          </div>
        ) : <span />}

        <div className="flex flex-wrap items-end gap-2">
          {booking.status === BookingStatus.PENDING && (
            <>
              <form action={confirmBookingAction} className="flex items-end gap-2">
                <input type="hidden" name="id" value={booking.id} />
                <div>
                  <FieldLabel label="Set price ($)" />
                  <TextInput
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="0.00"
                    fullWidth={false}
                    className="w-28"
                  />
                </div>
                <Button type="submit" size="sm">Confirm</Button>
              </form>
              <ConfirmSubmit
                action={cancelBookingAction}
                id={booking.id}
                title="Discard this request?"
                message={`Booking ${booking.reference} from ${booking.name} will be marked cancelled.`}
                confirmLabel="Discard"
                triggerClassName={OUTLINE_BTN}
              >
                Discard
              </ConfirmSubmit>
            </>
          )}

          {booking.status === BookingStatus.CONFIRMED && (
            <>
              <form action={completeBookingAction}>
                <input type="hidden" name="id" value={booking.id} />
                <Button type="submit" size="sm">Mark completed</Button>
              </form>
              <ConfirmSubmit
                action={cancelBookingAction}
                id={booking.id}
                title="Cancel this ride?"
                message={`Confirmed booking ${booking.reference} from ${booking.name} will be marked cancelled.`}
                confirmLabel="Cancel ride"
                triggerClassName={OUTLINE_BTN}
              >
                Cancel
              </ConfirmSubmit>
            </>
          )}

          {booking.status === BookingStatus.COMPLETED && finalPrice != null && (
            <a
              href={`/account/rides/${booking.id}/invoice`}
              download
              className={OUTLINE_BTN}
            >
              <Download size={14} />
              Invoice
            </a>
          )}

          {/* Permanent delete — only once a booking is cancelled, so live
              (pending/confirmed/completed) rides can't be wiped by mistake. */}
          {booking.status === BookingStatus.CANCELLED && (
            <ConfirmSubmit
              action={deleteBookingAction}
              id={booking.id}
              title="Delete this booking?"
              message={`Booking ${booking.reference} from ${booking.name} will be permanently deleted. This cannot be undone.`}
              confirmLabel="Delete"
              triggerClassName={buttonVariants({ variant: 'danger', size: 'sm' })}
            >
              Delete
            </ConfirmSubmit>
          )}
        </div>
      </div>
    </CollapsibleCard>
  );
}
