import type { Booking, BookingStatus } from './booking';

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  token: string;
}

export interface DashboardStats {
  totalBookings: number;
  pendingRequests: number;
  confirmedBookings: number;
  completedBookings: number;
  revenue: number;
}

export interface AdminBookingFilter {
  status?: BookingStatus;
  startDate?: string;
  endDate?: string;
}

export interface AdminBookingsResponse {
  items: Booking[];
  total: number;
  page: number;
  limit: number;
}
