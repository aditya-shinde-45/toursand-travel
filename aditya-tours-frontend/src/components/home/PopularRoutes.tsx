import { useEffect, useState } from 'react';
import type { PopularRoute } from '../../types/content';
import { formatCurrency, formatDuration } from '../../utils/formatting';
import { MapPin, Clock, Zap } from 'lucide-react';
import type { PopularRoutesSectionContent } from '../../types/content';
import { DEFAULT_POPULAR_ROUTES_SECTION_CONTENT } from '../../services/contentSettingsService';
import { getContentSection } from '../../services/contentService';
import { useNavigate } from 'react-router-dom';

interface PopularRoutesProps {
  routes: PopularRoute[];
}

function PopularRoutes({ routes }: PopularRoutesProps) {
  const [sectionContent, setSectionContent] = useState<PopularRoutesSectionContent>(
    DEFAULT_POPULAR_ROUTES_SECTION_CONTENT,
  );
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    async function loadPopularRoutesSection() {
      const data = await getContentSection<PopularRoutesSectionContent>('popular_routes_section');
      if (mounted && data) {
        setSectionContent(data);
      }
    }

    loadPopularRoutesSection();

    return () => {
      mounted = false;
    };
  }, []);

  const handleRouteClick = (route: PopularRoute) => {
    navigate('/book', {
      state: {
        prefillRoute: route,
      },
    });
  };

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
            role="button"
            tabIndex={0}
            onClick={() => handleRouteClick(route)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                handleRouteClick(route);
              }
            }}
            className="group relative cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF9933]/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative">
              <div className="mb-4 grid grid-cols-2 gap-4 md:flex md:flex-col md:gap-0">
                {/* FROM Section */}
                <div className="flex items-start gap-2 md:mb-3">
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-500">FROM</p>
                    <p className="font-semibold text-[#1B3A5F]">{route.pickupLocation}</p>
                    <p className="text-xs text-slate-500">{route.pickupAddress}</p>
                  </div>
                </div>

                {/* Arrow Divider - Hidden on mobile, shown on md+ */}
                <div className="hidden md:flex md:justify-center md:py-2">
                  <div className="rounded-full bg-[#FF9933]/10 p-2">
                    <svg className="h-4 w-4 text-[#FF9933]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                </div>

                {/* TO Section */}
                <div className="flex items-start gap-2 md:mb-4">
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-500">TO</p>
                    <p className="font-semibold text-[#1B3A5F]">{route.destinationName}</p>
                    <p className="text-xs text-slate-500">{route.destinationAddress}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-100 pt-4">
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
