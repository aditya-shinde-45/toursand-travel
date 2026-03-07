import { PRICING_PACKAGES, EXTRA_HOUR_RATE, EXTRA_KM_RATE } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatting';

function PricingManager() {
  return (
    <div className="grid gap-4">
      <h2 className="text-xl font-semibold">Pricing Management</h2>
      <p className="text-sm text-slate-600">Use admin API endpoints to persist pricing changes.</p>

      <div className="grid gap-2">
        {PRICING_PACKAGES.map((pkg) => (
          <article key={pkg.id} className="rounded-lg border border-slate-200 p-3 text-sm">
            {pkg.packageName} • {pkg.durationHours} hr • {pkg.includedKm} km • {formatCurrency(pkg.packagePrice)}
          </article>
        ))}
      </div>

      <p className="text-sm text-slate-700">
        Extra KM: {formatCurrency(EXTRA_KM_RATE)} • Extra Hour: {formatCurrency(EXTRA_HOUR_RATE)}
      </p>
    </div>
  );
}

export default PricingManager;
