export type TripType = 'ONE_WAY' | 'ROUND_TRIP';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface Location {
  address: string;
  lat: number;
  lng: number;
}

export interface BookingFormData {
  pickupLocation: Location | null;
  dropLocation: Location | null;
  tripType: TripType;
  departureDate: string;
  departureTime: string;
  returnDate: string;
  returnTime: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  passengerCount: number;
  specialInstructions: string;
  distanceKm: number;
  travelTimeMinutes: number;
  prefillEstimatedFare?: number;
  agreeTerms?: boolean;
  honeypot?: string;
}

export interface Booking {
  id: string;
  referenceNumber: string;
  status: BookingStatus;
  tripType: TripType;
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  dropAddress: string;
  dropLat: number;
  dropLng: number;
  distanceKm: number;
  travelTimeMinutes: number;
  departureDatetime: string;
  returnDatetime: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  passengerCount: number;
  specialInstructions: string | null;
  totalFare: number;
  createdAt: string;
}

export interface AvailabilityResult {
  available: boolean;
  reason?: string;
  suggestedDates?: string[];
}
