// Booking types
export type TripType = 'ONE_WAY' | 'ROUND_TRIP';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface Location {
  address: string;
  lat: number;
  lng: number;
}

export interface BookingFormData {
  // Step 1
  pickupLocation: Location | null;
  dropLocation: Location | null;
  tripType: TripType;
  
  // Step 2
  departureDate: Date | null;
  departureTime: string;
  returnDate: Date | null;
  returnTime: string;
  
  // Step 3
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  passengerCount: number;
  specialInstructions: string;
  
  // Calculated
  distanceKm: number;
  travelTimeMinutes: number;
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

export interface PricingPackage {
  id: string;
  name: string;
  durationHours: number;
  includedKm: number;
  packagePrice: number;
  displayOrder: number;
}

export interface PricingResult {
  selectedPackage: PricingPackage;
  extraKm: number;
  extraKmCharge: number;
  extraHours: number;
  extraHourCharge: number;
  total: number;
  disclaimer: string;
}

export interface PopularRoute {
  id: string;
  destinationName: string;
  destinationAddress: string;
  destinationLat: number;
  destinationLng: number;
  distanceKm: number;
  travelTimeMinutes: number;
  estimatedFare: number;
}

export interface Testimonial {
  id: string;
  customerName: string;
  reviewText: string;
  rating: number;
  reviewDate: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}
