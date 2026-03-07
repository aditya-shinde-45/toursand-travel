import { usePricing } from '../../hooks/usePricing';
import { formatCurrency } from '../../utils/formatting';

interface PriceDisplayProps {
  distanceKm: number;
  travelTimeMinutes: number;
}

function PriceDisplay({ distanceKm, travelTimeMinutes }: PriceDisplayProps) {
  const pricing = usePricing(distanceKm, travelTimeMinutes);

  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
      <h4 className="text-sm font-semibold text-blue-900">Estimated Fare</h4>
      <div className="mt-2 space-y-1 text-sm text-blue-900/90">
        <p>
          Package: {pricing.selectedPackage.packageName} ({pricing.selectedPackage.includedKm} km)
        </p>
        <p>Package Price: {formatCurrency(pricing.selectedPackage.packagePrice)}</p>
        <p>
          Extra: {pricing.extraKm} km + {pricing.extraHours} hr
        </p>
        <p className="font-semibold">Total: {formatCurrency(pricing.total)}</p>
      </div>
      <p className="mt-2 text-xs text-blue-700">{pricing.disclaimer}</p>
    </div>
  );
}

export default PriceDisplay;
