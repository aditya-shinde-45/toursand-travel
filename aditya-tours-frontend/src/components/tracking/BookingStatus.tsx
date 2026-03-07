import type { BookingTrackResult } from '../../types/booking';

interface BookingStatusProps {
  result: BookingTrackResult;
}

function BookingStatus({ result }: BookingStatusProps) {
  const colorMap: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
    CONFIRMED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    CANCELLED: 'bg-red-100 text-red-700 border-red-200',
    COMPLETED: 'bg-blue-100 text-blue-700 border-blue-200',
  };

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold">Booking Status</h3>
      <span className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${colorMap[result.status]}`}>
        {result.status}
      </span>
      <div className="mt-3 space-y-1 text-sm text-slate-700">
        <p>
          <strong>Reference:</strong> {result.referenceNumber}
        </p>
        <p>
          <strong>Customer:</strong> {result.customerName}
        </p>
        <p>
          <strong>Trip:</strong> {result.tripSummary}
        </p>
        <p>
          <strong>Support:</strong> {result.supportPhone}
        </p>
      </div>
    </article>
  );
}

export default BookingStatus;
