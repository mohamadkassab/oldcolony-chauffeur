export type Locale = 'en' | 'fr';

export enum ServiceType {
  AIRPORT = 'airport',
  CITY    = 'city',
  HOURLY  = 'hourly',
  EVENT   = 'event',
}

export enum VehicleType {
  REGULAR = 'regular',
  VIP     = 'vip',
}

export interface Vehicle {
  id: string;
  name: string;
  type: VehicleType;
  maxPassengers: number;
  maxLuggage: number;
  imageUrl: string;
  features: string[];
}

export interface Review {
  name: string;
  location: string;
  stars: number;
  text: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  createdAt: string;
  coverImageUrl: string;
  excerpt: string;
  content: string;
}

export interface BookingFormData {
  serviceType: ServiceType;
  vehicleType: VehicleType;
  vehicleId?: string;
  pickup: string;
  dropoff: string;
  passengers: number;
  luggageCount?: number;
  flightNumber?: string;
  returnTrip?: boolean;
  returnDatetime?: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
}
