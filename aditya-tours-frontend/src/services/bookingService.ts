import type { BookingTrackResult } from '../types/booking';
import type { PricingResult } from '../types/pricing';
import { apiRequest } from './api';

interface AvailabilityInput {
  departureDatetime: string;
  returnDatetime?: string;
  travelTimeMinutes: number;
}

interface BookingPayload {
  tripType: 'ONE_WAY' | 'ROUND_TRIP';
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  dropAddress: string;
  dropLat: number;
  dropLng: number;
  distanceKm: number;
  travelTimeMinutes: number;
  departureDatetime: string;
  returnDatetime?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  passengerCount: number;
  specialInstructions?: string;
}

export async function checkAvailability(input: AvailabilityInput) {
  const query = new URLSearchParams({
    departureDatetime: input.departureDatetime,
    travelTimeMinutes: String(input.travelTimeMinutes),
  });

  if (input.returnDatetime) {
    query.set('returnDatetime', input.returnDatetime);
  }

  return apiRequest<{ available: boolean; reason?: string; suggestedDates?: string[] }>(
    `/bookings/check-availability?${query.toString()}`,
  );
}

export async function createBooking(payload: BookingPayload) {
  return apiRequest<{ referenceNumber: string }>('/bookings', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function trackBooking(referenceNumber: string, email: string) {
  return apiRequest<BookingTrackResult>(
    `/bookings/track/${encodeURIComponent(referenceNumber)}?email=${encodeURIComponent(email)}`,
  );
}

export async function getPricingEstimate(distanceKm: number, durationHours: number) {
  return apiRequest<PricingResult>(
    `/pricing/calculate?distanceKm=${distanceKm}&durationHours=${durationHours}`,
  );
}
