import type { PopularRoute } from '../../types/content';
import { formatCurrency, formatDuration } from '../../utils/formatting';
import { MapPin, Clock, Zap } from 'lucide-react';
import { getPopularRoutesSectionContent } from '../../services/contentSettingsService';

interface PopularRoutesProps {
  routes: PopularRoute[];
}

function PopularRoutes({ routes }: PopularRoutesProps) {
  const sectionContent = getPopularRoutesSectionContent();

  return (
    <section className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-[#1B3A5F]">{sectionContent.title}</h2>
        <p className="mt-2 text-slate-600">{sectionContent.subtitle}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {routes.map((route) => (
          <article
            key={route.id}
            className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF9933]/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative">
              <h3 className="font-bold text-[#1B3A5F]">{route.destinationName}</h3>
              <p className="mt-1 text-xs text-slate-500">{route.destinationAddress}</p>

              <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="h-4 w-4 text-[#FF9933]" />
                  <span>{route.distanceKm} km</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="h-4 w-4 text-[#FF9933]" />
                  <span>{formatDuration(route.travelTimeMinutes)}</span>
                </div>
                <div className="flex items-center gap-2 pt-2 text-sm font-semibold text-[#FF9933]">
                  <Zap className="h-4 w-4" />
                  <span>Starting {formatCurrency(route.estimatedFare)}</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default PopularRoutes;
