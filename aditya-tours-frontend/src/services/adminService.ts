import type { AdminBookingsResponse, DashboardStats } from '../types/admin';
import type { BookingStatus } from '../types/booking';
import { apiRequest } from './api';

export async function adminLogin(username: string, password: string) {
  // Mock login until backend is ready
  if (username === 'admin' && password === 'admin123') {
    return {
      token: 'mock-token-' + Date.now(),
      admin: {
        id: '1',
        name: 'Admin User',
        username: 'admin'
      }
    };
  }
  throw new Error('Invalid credentials');
  
  // Uncomment when backend is ready:
  // return apiRequest<{ token: string; admin: { id: string; name: string; username: string } }>('/admin/auth/login', {
  //   method: 'POST',
  //   body: JSON.stringify({ username, password }),
  // });
}

export async function fetchDashboard(startDate?: string, endDate?: string) {
  const params = new URLSearchParams();
  if (startDate) params.set('startDate', startDate);
  if (endDate) params.set('endDate', endDate);

  return apiRequest<DashboardStats>(`/admin/analytics/dashboard?${params.toString()}`, {
    authenticated: true,
  });
}

export async function fetchAdminBookings(filters: { status?: BookingStatus; startDate?: string; endDate?: string }) {
  const params = new URLSearchParams();
  if (filters.status) params.set('status', filters.status);
  if (filters.startDate) params.set('startDate', filters.startDate);
  if (filters.endDate) params.set('endDate', filters.endDate);

  return apiRequest<AdminBookingsResponse>(`/admin/bookings?${params.toString()}`, {
    authenticated: true,
  });
}
