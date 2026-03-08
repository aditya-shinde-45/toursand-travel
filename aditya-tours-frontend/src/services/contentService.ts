import type { FAQ, PopularRoute, Testimonial } from '../types/content';
import { FAQS, POPULAR_ROUTES, TESTIMONIALS } from '../utils/constants';
import { getPopularRoutesData } from './contentSettingsService';
import { apiRequest } from './api';

function normalizePopularRoute(raw: Record<string, unknown>, index: number): PopularRoute {
  return {
    id: String(raw.id ?? `route-${index + 1}`),
    pickupLocation: String(raw.pickupLocation ?? raw.pickup_location ?? ''),
    pickupAddress: String(raw.pickupAddress ?? raw.pickup_address ?? ''),
    destinationName: String(raw.destinationName ?? raw.destination_name ?? ''),
    destinationAddress: String(raw.destinationAddress ?? raw.destination_address ?? ''),
    distanceKm: Number(raw.distanceKm ?? raw.distance_km ?? 0),
    travelTimeMinutes: Number(raw.travelTimeMinutes ?? raw.travel_time_minutes ?? 0),
    estimatedFare: Number(raw.estimatedFare ?? raw.estimated_fare ?? 0),
    displayOrder: Number(raw.displayOrder ?? raw.display_order ?? index + 1),
  };
}

export async function getContentSection<T>(key: string): Promise<T | null> {
  try {
    return await apiRequest<T>(`/content/section/${key}`);
  } catch {
    return null;
  }
}

export async function getPopularRoutes() {
  try {
    const routes = await apiRequest<Record<string, unknown>[]>('/content/popular-routes');
    if (!Array.isArray(routes)) {
      return POPULAR_ROUTES;
    }

    return routes.map((route, index) => normalizePopularRoute(route, index));
  } catch {
    // Try to get from localStorage first (admin-saved routes)
    const savedRoutes = getPopularRoutesData();
    if (savedRoutes && savedRoutes.length > 0) {
      return savedRoutes;
    }
    // Fallback to constants
    return POPULAR_ROUTES;
  }
}

export async function getTestimonials() {
  try {
    return await apiRequest<Testimonial[]>('/content/testimonials');
  } catch {
    return TESTIMONIALS;
  }
}

export async function getFaqs() {
  try {
    return await apiRequest<FAQ[]>('/content/faqs');
  } catch {
    return FAQS;
  }
}

export async function submitContact(data: { name: string; email: string; phone: string; message: string; subject?: string }) {
  return apiRequest<{ message: string }>('/content/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getPricingPackages() {
  try {
    return await apiRequest<any[]>('/content/pricing');
  } catch (error) {
    console.error('Failed to fetch pricing packages:', error);
    return [];
  }
}
