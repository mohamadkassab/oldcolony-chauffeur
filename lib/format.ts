import { BookingStatus, ServiceType, VehicleType } from '@prisma/client';
import { FLEET } from '@/lib/data';

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/** Bookings store wall-clock time encoded as UTC, so always render in UTC. */
export function formatRideDateTime(d: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
  }).format(d);
}

export const SERVICE_LABEL: Record<ServiceType, string> = {
  [ServiceType.airport]: 'Airport',
  [ServiceType.city]: 'City',
  [ServiceType.hourly]: 'Hourly',
  [ServiceType.event]: 'Event',
};

export const VEHICLE_LABEL: Record<VehicleType, string> = {
  [VehicleType.regular]: 'Regular',
  [VehicleType.vip]: 'VIP',
};

/**
 * "GLE 450 - VIP" — the car's name followed by its class. Falls back to just the
 * class label when the vehicle isn't found (e.g. older/guest bookings with no
 * vehicleId). Accepts the type as a string so it works with both the Prisma and
 * `@/types` VehicleType enums (identical string values).
 */
export function formatVehicle(
  vehicleId: string | null | undefined,
  vehicleType: string,
): string {
  const typeLabel = VEHICLE_LABEL[vehicleType as VehicleType] ?? vehicleType;
  const vehicle = vehicleId ? FLEET.find((v) => v.id === vehicleId) : undefined;
  return vehicle ? `${vehicle.name} - ${typeLabel}` : typeLabel;
}

export const STATUS_META: Record<BookingStatus, { label: string; classes: string }> = {
  [BookingStatus.PENDING]: {
    label: 'Pending',
    classes: 'bg-amber-100 text-amber-700',
  },
  [BookingStatus.CONFIRMED]: {
    label: 'Confirmed',
    classes: 'bg-blue-100 text-blue-700',
  },
  [BookingStatus.COMPLETED]: {
    label: 'Completed',
    classes: 'bg-green-100 text-green-700',
  },
  [BookingStatus.CANCELLED]: {
    label: 'Cancelled',
    classes: 'bg-gray-100 text-gray-500',
  },
};
