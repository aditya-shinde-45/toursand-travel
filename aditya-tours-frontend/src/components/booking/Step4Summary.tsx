import type { BookingFlowInput } from './BookingFlow.tsx';
import { useFareCalculation } from '../../hooks/useFareCalculation';
import { formatCurrency } from '../../utils/formatting';

interface Step4SummaryProps {
  values: BookingFlowInput;
  prefillEstimatedFare?: number;
  onAgreeChange: (value: boolean) => void;
}

function Step4Summary({ values, prefillEstimatedFare, onAgreeChange }: Step4SummaryProps) {
  const isPrefilledFromPopularRoute = typeof prefillEstimatedFare === 'number' && prefillEstimatedFare > 0;
  const popularRouteTotalFare = isPrefilledFromPopularRoute
    ? (values.tripType === 'ROUND_TRIP' ? prefillEstimatedFare * 2 : prefillEstimatedFare)
    : 0;

  const fareQuery = useFareCalculation({
    distanceKm: Number(values.distanceKm),
    pickupLat: values.pickupLocation?.lat,
    pickupLng: values.pickupLocation?.lng,
    dropLat: values.dropLocation?.lat,
    dropLng: values.dropLocation?.lng,
    isRoundTrip: values.tripType === 'ROUND_TRIP',
    enabled: !isPrefilledFromPopularRoute,
  });

  const fareData = fareQuery.data;
  const isLoading = fareQuery.isLoading;
  const error = fareQuery.error;

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
        
        {!isPrefilledFromPopularRoute && isLoading && (
          <p className="mt-2 text-sm text-blue-700">Calculating fare...</p>
        )}
        
        {!isPrefilledFromPopularRoute && error && (
          <p className="mt-2 text-sm text-red-600">Failed to calculate fare. Please try again.</p>
        )}

        {isPrefilledFromPopularRoute && (
          <div className="mt-2 space-y-1">
            <div className="flex justify-between">
              <span>Distance:</span>
              <span className="font-medium">
                {Number(values.distanceKm).toFixed(1)} km
                {values.tripType === 'ROUND_TRIP' ? ` × 2 = ${(Number(values.distanceKm) * 2).toFixed(1)} km` : ''}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Fare ({values.tripType === 'ROUND_TRIP' ? 'Round Trip' : 'One Way'}):</span>
              <span>{formatCurrency(popularRouteTotalFare)}</span>
            </div>
            <div className="flex justify-between border-t border-blue-300 pt-2 font-semibold">
              <span>Total Fare:</span>
              <span className="text-lg">{formatCurrency(popularRouteTotalFare)}</span>
            </div>
            <p className="mt-2 text-xs text-blue-700">Fare locked from selected Popular Route card.</p>
          </div>
        )}
        
        {!isPrefilledFromPopularRoute && fareData && (
          <div className="mt-2 space-y-1">
            <div className="flex justify-between">
              <span>Distance:</span>
              <span className="font-medium">
                {fareData.distanceKm} km{fareData.isRoundTrip ? ` × 2 = ${fareData.effectiveDistance} km` : ''}
              </span>
            </div>
            {fareData.rangeInfo && (
              <div className="flex justify-between text-xs text-blue-600">
                <span>Range:</span>
                <span>{fareData.rangeInfo.fromKm} - {fareData.rangeInfo.toKm} km</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Base Fare:</span>
              <span>{formatCurrency(fareData.baseFare)}</span>
            </div>
            {fareData.tollCharges > 0 && (
              <div className="flex justify-between">
                <span>Toll Charges (est):</span>
                <span>{formatCurrency(fareData.tollCharges)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-blue-300 pt-2 font-semibold">
              <span>Total Fare:</span>
              <span className="text-lg">{formatCurrency(fareData.totalFare)}</span>
            </div>
            <p className="mt-2 text-xs text-blue-700">{fareData.disclaimer}</p>
          </div>
        )}
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
