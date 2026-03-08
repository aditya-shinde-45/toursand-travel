import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAdminBookings, updateBookingStatus } from '../../services/adminService';
import { formatCurrency } from '../../utils/formatting';
import type { Booking, BookingStatus } from '../../types/booking';
import { Calendar, MapPin, User, Phone, Mail, Users, Clock, Package, ChevronDown, ChevronUp, X } from 'lucide-react';

function BookingsList() {
  const queryClient = useQueryClient();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updateModal, setUpdateModal] = useState<{ booking: Booking | null; isOpen: boolean }>({
    booking: null,
    isOpen: false,
  });
  const [newStatus, setNewStatus] = useState<BookingStatus>('PENDING');
  const [updateReason, setUpdateReason] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: () => fetchAdminBookings({}),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status, reason }: { id: string; status: BookingStatus; reason?: string }) =>
      updateBookingStatus(id, status, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
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

  if (isLoading) return <p className="text-sm text-slate-600">Loading bookings...</p>;

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Bookings ({data?.total || 0})</h2>
      </div>

      <div className="space-y-3">
        {data?.items?.map((booking) => (
          <div key={booking.id} className="rounded-lg border border-slate-200 bg-white shadow-sm">
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
                  <div className="space-y-3">
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

                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">Passengers:</span>
                      <span className="font-medium">{booking.passengerCount}</span>
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div className="space-y-3">
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
                      <div className="mt-3 rounded-lg bg-white p-3">
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

        {(!data?.items || data.items.length === 0) && (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
            <p className="text-slate-600">No bookings found</p>
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
    </div>
  );
}

export default BookingsList;
