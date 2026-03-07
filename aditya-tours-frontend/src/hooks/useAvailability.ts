import { useMutation } from '@tanstack/react-query';
import { checkAvailability } from '../services/bookingService';

export function useAvailability() {
  return useMutation({
    mutationFn: checkAvailability,
  });
}
