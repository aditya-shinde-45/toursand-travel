import { useQuery } from '@tanstack/react-query';
import { fetchDashboard } from '../../services/adminService';
import { formatCurrency } from '../../utils/formatting';
import { TrendingUp, Calendar, CheckCircle, Clock, DollarSign, Users } from 'lucide-react';

function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => fetchDashboard(),
  });

  // Mock data until backend is ready
  const stats = data || {
    totalBookings: 45,
    pendingRequests: 8,
    confirmedBookings: 32,
    completedBookings: 5,
    revenue: 125000,
    todayBookings: 3,
    monthlyRevenue: 450000,
  };

  const recentBookings = [
    { id: 'BK12345', customer: 'Rajesh Kumar', route: 'Thane → Mumbai Airport', status: 'Confirmed', amount: 2500 },
    { id: 'BK12346', customer: 'Priya Sharma', route: 'Powai → Pune', status: 'Pending', amount: 4500 },
    { id: 'BK12347', customer: 'Amit Patel', route: 'Thane → Lonavala', status: 'Confirmed', amount: 3200 },
  ];

  if (isLoading) return <p className="text-sm text-slate-600">Loading dashboard...</p>;

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
              <p className="mt-2 text-3xl font-bold text-slate-900">{formatCurrency(stats.monthlyRevenue)}</p>
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
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All →</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="pb-3 text-left text-xs font-medium text-slate-600">Booking ID</th>
                <th className="pb-3 text-left text-xs font-medium text-slate-600">Customer</th>
                <th className="pb-3 text-left text-xs font-medium text-slate-600">Route</th>
                <th className="pb-3 text-left text-xs font-medium text-slate-600">Status</th>
                <th className="pb-3 text-right text-xs font-medium text-slate-600">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 text-sm font-medium text-slate-900">{booking.id}</td>
                  <td className="py-3 text-sm text-slate-700">{booking.customer}</td>
                  <td className="py-3 text-sm text-slate-600">{booking.route}</td>
                  <td className="py-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      booking.status === 'Confirmed' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-3 text-right text-sm font-medium text-slate-900">
                    {formatCurrency(booking.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
