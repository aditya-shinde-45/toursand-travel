import { useQuery } from '@tanstack/react-query';
import { calculateFare, type FareCalculationResponse } from '../services/fareService';

interface UseFareCalculationParams {
  distanceKm: number;
  pickupLat?: number;
  pickupLng?: number;
  dropLat?: number;
  dropLng?: number;
    isRoundTrip?: boolean;
  enabled?: boolean;
}

export function useFareCalculation({
  distanceKm,
  pickupLat,
  pickupLng,
  dropLat,
  dropLng,
    isRoundTrip = false,
  enabled = true,
}: UseFareCalculationParams) {
  return useQuery<FareCalculationResponse>({
      queryKey: ['fare-calculation', distanceKm, pickupLat, pickupLng, dropLat, dropLng, isRoundTrip],
    queryFn: () =>
      calculateFare({
        distanceKm,
        pickupLat,
        pickupLng,
        dropLat,
        dropLng,
          isRoundTrip,
      }),
    enabled: enabled && distanceKm > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}
