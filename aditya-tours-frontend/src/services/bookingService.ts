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
  totalFare: number;
}

export async function checkAvailability(input: AvailabilityInput) {
  const endDateTime = input.returnDatetime || 
    new Date(new Date(input.departureDatetime).getTime() + (input.travelTimeMinutes * 60000)).toISOString();

  return apiRequest<{ available: boolean }>('/bookings/check-availability', {
    method: 'POST',
    body: JSON.stringify({
      startDateTime: input.departureDatetime,
      endDateTime
    }),
  });
}

export async function createBooking(payload: BookingPayload) {
  const response = await apiRequest<any>('/bookings', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return { referenceNumber: response.reference_number };
}

export async function trackBooking(referenceNumber: string, _email: string) {
  return apiRequest<BookingTrackResult>(
    `/bookings/track/${encodeURIComponent(referenceNumber)}`,
  );
}

export async function getPricingEstimate(distanceKm: number, durationHours: number) {
  return apiRequest<PricingResult>(
    `/pricing/calculate?distanceKm=${distanceKm}&durationHours=${durationHours}`,
  );
}
