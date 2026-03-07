interface RouteMapProps {
  pickupAddress: string;
  dropAddress: string;
  distanceKm: number;
  travelTimeMinutes: number;
}

function RouteMap({ pickupAddress, dropAddress, distanceKm }: RouteMapProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <h4 className="text-sm font-semibold text-slate-800">Route Preview</h4>
      <p className="mt-2 text-sm text-slate-600">
        <strong>From:</strong> {pickupAddress || 'Select pickup'}
      </p>
      <p className="text-sm text-slate-600">
        <strong>To:</strong> {dropAddress || 'Select drop'}
      </p>
      <p className="mt-2 text-sm text-slate-700">
        Estimated: {distanceKm.toFixed(1)} km
      </p>
      <p className="mt-1 text-xs text-slate-500">Map preview appears here once Google Maps API integration is enabled.</p>
    </div>
  );
}

export default RouteMap;
