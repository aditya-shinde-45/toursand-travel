import type { AdminBookingsResponse, DashboardStats } from '../types/admin';
import type { Booking, BookingStatus } from '../types/booking';
import type { PricingSectionContent } from '../types/content';
import { apiRequest } from './api';

export async function adminLogin(username: string, password: string) {
  return apiRequest<{ token: string; admin: { id: string; name: string; username: string; email: string } }>('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export async function fetchDashboard(startDate?: string, endDate?: string) {
  const params = new URLSearchParams();
  if (startDate) params.set('startDate', startDate);
  if (endDate) params.set('endDate', endDate);

  return apiRequest<DashboardStats>(`/admin/dashboard/stats?${params.toString()}`, {
    authenticated: true,
  });
}

function normalizeBooking(raw: Record<string, unknown>): Booking {
  return {
    id: String(raw.id ?? ''),
    referenceNumber: String(raw.referenceNumber ?? raw.reference_number ?? ''),
    status: String(raw.status ?? 'PENDING') as BookingStatus,
    tripType: String(raw.tripType ?? raw.trip_type ?? 'ONE_WAY') as Booking['tripType'],
    pickupAddress: String(raw.pickupAddress ?? raw.pickup_address ?? ''),
    pickupLat: Number(raw.pickupLat ?? raw.pickup_lat ?? 0),
    pickupLng: Number(raw.pickupLng ?? raw.pickup_lng ?? 0),
    dropAddress: String(raw.dropAddress ?? raw.drop_address ?? ''),
    dropLat: Number(raw.dropLat ?? raw.drop_lat ?? 0),
    dropLng: Number(raw.dropLng ?? raw.drop_lng ?? 0),
    distanceKm: Number(raw.distanceKm ?? raw.distance_km ?? 0),
    travelTimeMinutes: Number(raw.travelTimeMinutes ?? raw.travel_time_minutes ?? 0),
    departureDatetime: String(raw.departureDatetime ?? raw.departure_datetime ?? ''),
    returnDatetime: raw.returnDatetime ?? raw.return_datetime ? String(raw.returnDatetime ?? raw.return_datetime) : null,
    customerName: String(raw.customerName ?? raw.customer_name ?? ''),
    customerPhone: String(raw.customerPhone ?? raw.customer_phone ?? ''),
    customerEmail: String(raw.customerEmail ?? raw.customer_email ?? ''),
    passengerCount: Number(raw.passengerCount ?? raw.passenger_count ?? 0),
    specialInstructions:
      raw.specialInstructions !== undefined || raw.special_instructions !== undefined
        ? String(raw.specialInstructions ?? raw.special_instructions)
        : null,
    totalFare: Number(raw.totalFare ?? raw.total_fare ?? 0),
    createdAt: String(raw.createdAt ?? raw.created_at ?? ''),
  };
}

export async function fetchAdminBookings(filters: { status?: BookingStatus; startDate?: string; endDate?: string }) {
  const params = new URLSearchParams();
  if (filters.status) params.set('status', filters.status);
  if (filters.startDate) params.set('startDate', filters.startDate);
  if (filters.endDate) params.set('endDate', filters.endDate);

  const raw = await apiRequest<AdminBookingsResponse | Record<string, unknown>[]>(`/admin/bookings?${params.toString()}`, {
    authenticated: true,
  });

  if (Array.isArray(raw)) {
    return {
      items: raw.map((item) => normalizeBooking(item)),
      total: raw.length,
      page: 1,
      limit: raw.length || 20,
    };
  }

  if (raw && Array.isArray(raw.items)) {
    return {
      items: raw.items.map((item) => normalizeBooking(item as unknown as Record<string, unknown>)),
      total: Number(raw.total ?? raw.items.length ?? 0),
      page: Number(raw.page ?? 1),
      limit: Number(raw.limit ?? 20),
    };
  }

  return {
    items: [],
    total: 0,
    page: 1,
    limit: 20,
  };
}

// Pricing Management API
export async function fetchPricingSettings() {
  return apiRequest<PricingSectionContent>('/admin/settings/pricing', {
    authenticated: true,
  });
}

export async function updatePricingSettings(content: PricingSectionContent) {
  return apiRequest<{ success: boolean; message: string }>('/admin/settings/pricing', {
    method: 'PUT',
    body: JSON.stringify(content),
    authenticated: true,
  });
}

export async function resetPricingSettings() {
  return apiRequest<PricingSectionContent>('/admin/settings/pricing/reset', {
    method: 'POST',
    authenticated: true,
  });
}

export async function getAdminContentSection<T>(key: string) {
  return apiRequest<T | null>(`/admin/content/section/${key}`, {
    authenticated: true,
  });
}

export async function updateAdminContentSection<T>(key: string, data: T) {
  return apiRequest<{ section_key: string; section_data: T; updated_at: string }>(`/admin/content/section/${key}`, {
    method: 'PUT',
    body: JSON.stringify(data),
    authenticated: true,
  });
}

export interface PricingRangeRow {
  id?: string;
  from_km?: number;
  to_km?: number;
  fromKm?: number;
  toKm?: number;
  price: number;
  display_order?: number;
  displayOrder?: number;
  is_active?: boolean;
  isActive?: boolean;
}

export interface PricingRangesPayload {
  title: string;
  subtitle: string;
  ranges: PricingRangeRow[];
}

export async function fetchAdminPricingRanges() {
  return apiRequest<PricingRangesPayload>('/admin/pricing-ranges', {
    authenticated: true,
  });
}

export async function updateAdminPricingRanges(data: PricingRangesPayload) {
  return apiRequest<PricingRangesPayload>('/admin/pricing-ranges', {
    method: 'PUT',
    body: JSON.stringify(data),
    authenticated: true,
  });
}

export async function updateBookingStatus(bookingId: string, status: BookingStatus, reason?: string) {
  return apiRequest<any>(`/admin/bookings/${bookingId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, reason }),
    authenticated: true,
  });
}

export async function getBookingHistory(bookingId: string) {
  return apiRequest<any[]>(`/admin/bookings/${bookingId}/history`, {
    authenticated: true,
  });
}

export async function getContactSubmissions(unreadOnly: boolean = false) {
  const params = new URLSearchParams();
  if (unreadOnly) params.set('unreadOnly', 'true');

  return apiRequest<any[]>(`/admin/contacts?${params.toString()}`, {
    authenticated: true,
  });
}
