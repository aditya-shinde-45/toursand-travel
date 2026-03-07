import SiteLayout from '../components/layout/SiteLayout';
import TrackBooking from '../components/tracking/TrackBooking';
import SEOHead from '../components/seo/SEOHead';

function TrackBookingPage() {
  return (
    <SiteLayout>
      <SEOHead
        title="Track Booking | Aditya Tours and Travels"
        description="Track your taxi booking status using booking reference number and email."
        canonicalPath="/track"
      />
      <div className="grid gap-4">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold">Track Booking</h1>
          <p className="mt-2 text-sm text-slate-600">Enter reference number and email to view booking status.</p>
        </section>
        <TrackBooking />
      </div>
    </SiteLayout>
  );
}

export default TrackBookingPage;
