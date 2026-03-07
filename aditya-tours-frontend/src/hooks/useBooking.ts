import { useMutation } from '@tanstack/react-query';
import type { BookingFormData } from '../types/booking';
import { createBooking } from '../services/bookingService';
import { toIsoDateTime } from '../utils/dateTime';

export function useBooking() {
  return useMutation({
    mutationFn: async (data: BookingFormData) => {
      return createBooking({
        tripType: data.tripType,
        pickupAddress: data.pickupLocation?.address || '',
        pickupLat: data.pickupLocation?.lat || 0,
        pickupLng: data.pickupLocation?.lng || 0,
        dropAddress: data.dropLocation?.address || '',
        dropLat: data.dropLocation?.lat || 0,
        dropLng: data.dropLocation?.lng || 0,
        distanceKm: data.distanceKm,
        travelTimeMinutes: data.travelTimeMinutes,
        departureDatetime: toIsoDateTime(data.departureDate, data.departureTime),
        returnDatetime:
          data.tripType === 'ROUND_TRIP' ? toIsoDateTime(data.returnDate, data.returnTime) : undefined,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail,
        passengerCount: data.passengerCount,
        specialInstructions: data.specialInstructions || undefined,
      });
    },
  });
}
