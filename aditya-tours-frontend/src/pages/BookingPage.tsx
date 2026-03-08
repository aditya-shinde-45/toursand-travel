import SiteLayout from '../components/layout/SiteLayout';
import BookingFlow from '../components/booking/BookingFlow';
import SEOHead from '../components/seo/SEOHead';
import { useLocation } from 'react-router-dom';
import type { PopularRoute } from '../types/content';

function BookingPage() {
  const location = useLocation();
  const prefillRoute = (location.state as { prefillRoute?: PopularRoute } | null)?.prefillRoute;

  return (
    <SiteLayout>
      <SEOHead
        title="Book Taxi in Thane | Aditya Tours and Travels"
        description="Complete 4-step taxi booking flow for local and outstation rides with transparent pricing and manual confirmation."
        canonicalPath="/book"
      />
      <div className="grid gap-4">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold">Book Your Ride</h1>
          <p className="mt-2 text-sm text-slate-600">Complete your booking in one page. No account required.</p>
        </section>
        <BookingFlow prefillRoute={prefillRoute} />
      </div>
    </SiteLayout>
  );
}

export default BookingPage;
