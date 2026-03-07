import { useMemo } from 'react';
import type { PricingResult } from '../types/pricing';
import { EXTRA_HOUR_RATE, EXTRA_KM_RATE, PRICING_PACKAGES } from '../utils/constants';

function pickPackage(durationHours: number, distanceKm: number) {
  const ordered = [...PRICING_PACKAGES].sort((a, b) => a.displayOrder - b.displayOrder);
  return (
    ordered.find((pkg) => pkg.durationHours >= durationHours && pkg.includedKm >= distanceKm)
    || ordered[ordered.length - 1]
  );
}

export function calculatePricing(distanceKm: number, durationHours: number): PricingResult {
  const selectedPackage = pickPackage(durationHours, distanceKm);
  const extraKm = Math.max(0, Math.ceil(distanceKm - selectedPackage.includedKm));
  const extraHours = Math.max(0, Math.ceil(durationHours - selectedPackage.durationHours));
  const extraKmCharge = extraKm * EXTRA_KM_RATE;
  const extraHourCharge = extraHours * EXTRA_HOUR_RATE;
  const total = selectedPackage.packagePrice + extraKmCharge + extraHourCharge;

  return {
    selectedPackage,
    extraKm,
    extraKmCharge,
    extraHours,
    extraHourCharge,
    total,
    disclaimer: 'Final fare may vary based on actual route, waiting, tolls, and parking.',
  };
}

export function usePricing(distanceKm: number, travelTimeMinutes: number) {
  return useMemo(() => {
    const durationHours = Math.max(1, Math.ceil(travelTimeMinutes / 60));
    return calculatePricing(distanceKm, durationHours);
  }, [distanceKm, travelTimeMinutes]);
}
