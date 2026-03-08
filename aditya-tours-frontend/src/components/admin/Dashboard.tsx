import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchDashboard, fetchAdminBookings, updateBookingStatus } from '../../services/adminService';
import { formatCurrency } from '../../utils/formatting';
import { TrendingUp, Calendar, CheckCircle, Clock, DollarSign, Users, ChevronDown, ChevronUp, MapPin, User, Phone, Mail, Package, X } from 'lucide-react';
import type { Booking, BookingStatus } from '../../types/booking';
import { Link } from 'react-router-dom';

function Dashboard() {
  const queryClient = useQueryClient();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updateModal, setUpdateModal] = useState<{ booking: Booking | null; isOpen: boolean }>({
    booking: null,
    isOpen: false,
  });
  const [newStatus, setNewStatus] = useState<BookingStatus>('PENDING');
  const [updateReason, setUpdateReason] = useState('');

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => fetchDashboard(),
  });

  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ['admin-bookings-recent'],
    queryFn: () => fetchAdminBookings({}),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status, reason }: { id: string; status: BookingStatus; reason?: string }) =>
      updateBookingStatus(id, status, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings-recent'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      setUpdateModal({ booking: null, isOpen: false });
      setUpdateReason('');
    },
  });

  const handleUpdateClick = (booking: Booking) => {
    setUpdateModal({ booking, isOpen: true });
    setNewStatus(booking.status);
    setUpdateReason('');
  };

  const handleUpdateSubmit = () => {
    if (updateModal.booking) {
      updateMutation.mutate({
        id: updateModal.booking.id,
        status: newStatus,
        reason: updateReason || undefined,
      });
    }
  };

  // Mock data until backend is ready
  const stats = statsData || {
    totalBookings: 45,
    pendingRequests: 8,
    confirmedBookings: 32,
    completedBookings: 5,
    revenue: 125000,
    todayBookings: 3,
    monthlyRevenue: 450000,
  };

  const monthlyRevenue = 'monthlyRevenue' in stats ? stats.monthlyRevenue : stats.revenue;
  const recentBookings = bookingsData?.items?.slice(0, 5) || [];

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const formatDateTime = (dateTimeStr: string) => {
    try {
      const date = new Date(dateTimeStr);
      return date.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateTimeStr;
    }
  };

  if (statsLoading) return <p className="text-sm text-slate-600">Loading dashboard...</p>;

  return (
    <div className="grid gap-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
        <p className="text-sm text-slate-600">Welcome back! Here's your business overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-xl border border-slate-200 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-600">Total Bookings</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{stats.totalBookings}</p>
              <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +12% from last month
              </p>
            </div>
            <div className="rounded-full bg-blue-100 p-3">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-gradient-to-br from-orange-50 to-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-600">Pending Requests</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{stats.pendingRequests}</p>
              <p className="mt-1 text-xs text-slate-500">Needs attention</p>
            </div>
            <div className="rounded-full bg-orange-100 p-3">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-gradient-to-br from-green-50 to-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-600">Confirmed</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{stats.confirmedBookings}</p>
              <p className="mt-1 text-xs text-slate-500">Active bookings</p>
            </div>
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-600">Monthly Revenue</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{formatCurrency(monthlyRevenue)}</p>
              <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +18% from last month
              </p>
            </div>
            <div className="rounded-full bg-emerald-100 p-3">
              <DollarSign className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </article>
      </div>

      {/* Recent Bookings */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Recent Bookings</h3>
          <Link to="/admin/bookings" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All →
          </Link>
        </div>

        {bookingsLoading ? (
          <p className="text-sm text-slate-600">Loading bookings...</p>
        ) : recentBookings.length > 0 ? (
          <div className="space-y-3">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="rounded-lg border border-slate-200 bg-white">
                {/* Header Row */}
                <div className="flex items-center justify-between gap-4 p-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-mono text-sm font-semibold text-[#1B3A5F]">{booking.referenceNumber}</p>
                      <p className="text-xs text-slate-500">{formatDateTime(booking.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                    <p className="font-semibold text-[#1B3A5F]">{formatCurrency(booking.totalFare)}</p>
                    <button
                      onClick={() => setExpandedId(expandedId === booking.id ? null : booking.id)}
                      className="rounded-lg p-2 hover:bg-slate-100"
                    >
                      {expandedId === booking.id ? (
                        <ChevronUp className="h-5 w-5 text-slate-600" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-slate-600" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="border-t border-slate-100 px-4 py-3">
                  <div className="grid gap-2 md:grid-cols-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-700">{booking.pickupAddress}</p>
                        <p className="truncate text-xs text-slate-500">→ {booking.dropAddress}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <User className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" />
                      <div>
                        <p className="text-sm font-medium text-slate-700">{booking.customerName}</p>
                        <p className="text-xs text-slate-500">{booking.customerPhone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedId === booking.id && (
                  <div className="border-t border-slate-100 bg-slate-50 p-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      {/* Trip Details */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-[#1B3A5F]">Trip Details</h4>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-600">Departure:</span>
                          <span className="font-medium">{formatDateTime(booking.departureDatetime)}</span>
                        </div>

                        {booking.returnDatetime && (
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            <span className="text-slate-600">Return:</span>
                            <span className="font-medium">{formatDateTime(booking.returnDatetime)}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-sm">
                          <Package className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-600">Type:</span>
                          <span className="font-medium">{booking.tripType.replace('_', ' ')}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-600">Distance:</span>
                          <span className="font-medium">{booking.distanceKm} km</span>
                          <span className="text-slate-400">•</span>
                          <span className="font-medium">{booking.travelTimeMinutes} min</span>
                        </div>
                      </div>

                      {/* Customer Details */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-[#1B3A5F]">Customer Details</h4>
                        
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-slate-400" />
                          <span className="font-medium">{booking.customerName}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-slate-400" />
                          <a href={`tel:${booking.customerPhone}`} className="font-medium text-[#1B3A5F] hover:underline">
                            {booking.customerPhone}
                          </a>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-slate-400" />
                          <a href={`mailto:${booking.customerEmail}`} className="font-medium text-[#1B3A5F] hover:underline">
                            {booking.customerEmail}
                          </a>
                        </div>

                        {booking.specialInstructions && (
                          <div className="mt-2 rounded-lg bg-white p-3">
                            <p className="text-xs font-semibold text-slate-600">Special Instructions:</p>
                            <p className="mt-1 text-sm text-slate-700">{booking.specialInstructions}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => handleUpdateClick(booking)}
                        className="rounded-lg bg-[#1B3A5F] px-4 py-2 text-sm font-medium text-white hover:bg-[#2d4a72]"
                      >
                        Update Status
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
            <p className="text-slate-600">No recent bookings</p>
          </div>
        )}
      </div>

      {/* Update Status Modal */}
      {updateModal.isOpen && updateModal.booking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#1B3A5F]">Update Booking Status</h3>
              <button
                onClick={() => setUpdateModal({ booking: null, isOpen: false })}
                className="rounded-lg p-1 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-slate-600">Booking: {updateModal.booking.referenceNumber}</p>
              <p className="text-sm text-slate-600">Customer: {updateModal.booking.customerName}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as BookingStatus)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-[#1B3A5F] focus:outline-none"
                >
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Reason/Notes (Optional)
                </label>
                <textarea
                  value={updateReason}
                  onChange={(e) => setUpdateReason(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-[#1B3A5F] focus:outline-none"
                  placeholder="Enter reason for status change..."
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setUpdateModal({ booking: null, isOpen: false })}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSubmit}
                disabled={updateMutation.isPending}
                className="flex-1 rounded-lg bg-[#1B3A5F] px-4 py-2 font-medium text-white hover:bg-[#2d4a72] disabled:opacity-50"
              >
                {updateMutation.isPending ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-3">
        <button className="rounded-xl border-2 border-dashed border-slate-300 p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition">
          <Users className="h-8 w-8 mx-auto text-slate-400" />
          <p className="mt-2 text-sm font-medium text-slate-700">Add New Booking</p>
        </button>
        <button className="rounded-xl border-2 border-dashed border-slate-300 p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition">
          <Calendar className="h-8 w-8 mx-auto text-slate-400" />
          <p className="mt-2 text-sm font-medium text-slate-700">View Calendar</p>
        </button>
        <button className="rounded-xl border-2 border-dashed border-slate-300 p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition">
          <DollarSign className="h-8 w-8 mx-auto text-slate-400" />
          <p className="mt-2 text-sm font-medium text-slate-700">Generate Report</p>
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
