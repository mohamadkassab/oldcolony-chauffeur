import { CITY_PAGES, type CityPage } from '@/lib/cities-content';
import { FLEET } from '@/lib/data';

// Instant-quote helper for the booking form: when a trip is between a corridor
// town and Logan, we can show the published flat rate before the user submits.
// Detection is intentionally conservative — string matching on the typed
// addresses — and every surfaced quote carries "final price confirmed with
// your booking" copy, so a false positive is a soft failure, not a promise.

export type VehicleClass = 'sedan' | 'suv';

const LOGAN_RX = /\blogan\b|\bBOS\b|boston[\s,-]*(intl|international)?[\s,-]*airport|airport[\s,-]*boston/i;

export function isLoganAddress(address: string): boolean {
  return LOGAN_RX.test(address);
}

export function matchCorridorTown(address: string): CityPage | undefined {
  const a = address.toLowerCase();
  return CITY_PAGES.find((c) => a.includes(c.name.toLowerCase()));
}

/** Sedan (3 pax) vs SUV pricing class for a fleet vehicle. */
export function vehicleClassOf(vehicleId: string | undefined): VehicleClass {
  const v = FLEET.find((f) => f.id === vehicleId);
  return v && v.maxPassengers <= 3 ? 'sedan' : 'suv';
}

export interface LoganQuote {
  town: CityPage;
  sedanRate: number;
  suvRate: number;
}

/** Published flat rate for a corridor-town ↔ Logan trip, or null when the
 *  addresses don't clearly match one (out-of-corridor trips are phone-quoted). */
export function getLoganQuote(pickup: string, dropoff: string): LoganQuote | null {
  const p = pickup ?? '';
  const d = dropoff ?? '';

  let town: CityPage | undefined;
  if (isLoganAddress(p)) town = matchCorridorTown(d);
  else if (isLoganAddress(d)) town = matchCorridorTown(p);
  if (!town) return null;

  return { town, sedanRate: town.sedanRate, suvRate: town.suvRate };
}
