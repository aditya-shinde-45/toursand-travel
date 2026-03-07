import { useQuery } from '@tanstack/react-query';
import { fetchAdminBookings } from '../../services/adminService';
import { formatCurrency } from '../../utils/formatting';

function BookingsList() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: () => fetchAdminBookings({}),
  });

  if (isLoading) return <p className="text-sm text-slate-600">Loading bookings...</p>;

  return (
    <div className="grid gap-4">
      <h2 className="text-xl font-semibold">Bookings</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left">
              <th className="py-2">Reference</th>
              <th className="py-2">Customer</th>
              <th className="py-2">Route</th>
              <th className="py-2">Status</th>
              <th className="py-2">Fare</th>
            </tr>
          </thead>
          <tbody>
            {data?.items?.map((booking) => (
              <tr key={booking.id} className="border-b border-slate-100">
                <td className="py-2">{booking.referenceNumber}</td>
                <td className="py-2">{booking.customerName}</td>
                <td className="py-2">{booking.pickupAddress} → {booking.dropAddress}</td>
                <td className="py-2">{booking.status}</td>
                <td className="py-2">{formatCurrency(booking.totalFare)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BookingsList;
