import type { BookingFlowInput } from './BookingFlow.tsx';
import { usePricing } from '../../hooks/usePricing';
import { formatCurrency } from '../../utils/formatting';

interface Step4SummaryProps {
  values: BookingFlowInput;
  onAgreeChange: (value: boolean) => void;
}

function Step4Summary({ values, onAgreeChange }: Step4SummaryProps) {
  const pricing = usePricing(Number(values.distanceKm), Number(values.travelTimeMinutes));

  return (
    <div className="grid gap-4 text-sm text-slate-700">
      <article className="rounded-xl border border-slate-200 bg-white p-4">
        <h4 className="text-base font-semibold text-slate-900">Trip Details</h4>
        <p className="mt-2">
          {values.pickupLocation.address} → {values.dropLocation.address}
        </p>
        <p>
          {values.tripType === 'ONE_WAY' ? 'One Way' : 'Round Trip'} • {Number(values.distanceKm).toFixed(1)} km •{' '}
          {Math.ceil(Number(values.travelTimeMinutes) / 60)} hr
        </p>
      </article>

      <article className="rounded-xl border border-slate-200 bg-white p-4">
        <h4 className="text-base font-semibold text-slate-900">Customer</h4>
        <p className="mt-2">{values.customerName}</p>
        <p>{values.customerPhone}</p>
        <p>{values.customerEmail}</p>
        <p>{Number(values.passengerCount)} passengers</p>
      </article>

      <article className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <h4 className="text-base font-semibold text-blue-900">Fare Breakdown</h4>
        <p className="mt-2">
          {pricing.selectedPackage.packageName}: {formatCurrency(pricing.selectedPackage.packagePrice)}
        </p>
        <p>
          Extra charges: {formatCurrency(pricing.extraKmCharge + pricing.extraHourCharge)}
        </p>
        <p className="font-semibold">Total: {formatCurrency(pricing.total)}</p>
      </article>

      <label className="flex items-start gap-2 rounded-lg border border-slate-200 p-3">
        <input
          type="checkbox"
          checked={values.agreeTerms}
          onChange={(event) => onAgreeChange(event.target.checked)}
          className="mt-1"
        />
        <span>I agree to Terms & Conditions and understand final fare may vary.</span>
      </label>
    </div>
  );
}

export default Step4Summary;
