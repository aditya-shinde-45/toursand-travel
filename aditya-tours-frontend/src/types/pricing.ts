export interface PricingPackage {
  id: string;
  packageName: string;
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
