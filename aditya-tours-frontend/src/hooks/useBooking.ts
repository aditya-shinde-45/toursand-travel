import { useMutation } from '@tanstack/react-query';
import type { BookingFormData } from '../types/booking';
import { createBooking } from '../services/bookingService';
import { calculateFare } from '../services/fareService';
import { toIsoDateTime } from '../utils/dateTime';

export function useBooking() {
  return useMutation({
    mutationFn: async (data: BookingFormData) => {
      let totalFare = 0;

      if (typeof data.prefillEstimatedFare === 'number' && data.prefillEstimatedFare > 0) {
        totalFare = data.tripType === 'ROUND_TRIP'
          ? data.prefillEstimatedFare * 2
          : data.prefillEstimatedFare;
      } else {
        try {
          const fareResult = await calculateFare({
            distanceKm: data.distanceKm,
            pickupLat: data.pickupLocation?.lat,
            pickupLng: data.pickupLocation?.lng,
            dropLat: data.dropLocation?.lat,
            dropLng: data.dropLocation?.lng,
            isRoundTrip: data.tripType === 'ROUND_TRIP',
          });
          totalFare = fareResult.totalFare;
        } catch (error) {
          console.error('Failed to calculate fare, using fallback:', error);
          const baseRate = 100;
          const perKmRate = 15;
          const effectiveDistance = data.tripType === 'ROUND_TRIP' ? data.distanceKm * 2 : data.distanceKm;
          totalFare = Math.round((baseRate + effectiveDistance * perKmRate) * data.passengerCount);
        }
      }

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
        totalFare,
      });
    },
  });
}
