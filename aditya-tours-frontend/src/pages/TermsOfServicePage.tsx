import SiteLayout from '../components/layout/SiteLayout';
import SEOHead from '../components/seo/SEOHead';

function TermsOfServicePage() {
  return (
    <SiteLayout>
      <SEOHead
        title="Terms of Service | Aditya Tours and Travels"
        description="Terms covering booking confirmation, pricing, cancellation, and customer responsibilities."
        canonicalPath="/terms-of-service"
      />
      <article className="max-w-none rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Terms of Service</h1>
        <ul className="list-inside list-disc space-y-2">
          <li>Fare estimates are indicative and may vary based on route, tolls, waiting, and time changes.</li>
          <li>Round-trip and outstation bookings may require advance confirmation and partial payment.</li>
          <li>Cancellation and rescheduling charges may apply depending on notice period.</li>
          <li>Passengers are expected to follow local laws and maintain respectful behavior during rides.</li>
          <li>For disputes, contact support first for assisted resolution.</li>
        </ul>
      </article>
    </SiteLayout>
  );
}

export default TermsOfServicePage;
