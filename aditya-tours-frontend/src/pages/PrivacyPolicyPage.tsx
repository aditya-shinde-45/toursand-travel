import SiteLayout from '../components/layout/SiteLayout';
import SEOHead from '../components/seo/SEOHead';

function PrivacyPolicyPage() {
  return (
    <SiteLayout>
      <SEOHead
        title="Privacy Policy | Aditya Tours and Travels"
        description="Privacy policy for booking data, communication details, and customer information handling."
        canonicalPath="/privacy-policy"
      />
      <article className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
        <p className="mt-3">We collect booking-related data to process your trip request and provide customer support.</p>
        <h2 className="mt-4 text-lg font-semibold text-slate-900">Data We Collect</h2>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>Customer details (name, phone, email)</li>
          <li>Trip details (pickup/drop, date/time, passenger count)</li>
          <li>Operational metadata for spam prevention and support</li>
        </ul>
        <h2 className="mt-4 text-lg font-semibold text-slate-900">Data Usage</h2>
        <p className="mt-2">Information is used only for booking processing, communication, and service improvements. We do not sell personal data.</p>
        <h2 className="mt-4 text-lg font-semibold text-slate-900">Contact</h2>
        <p className="mt-2">For privacy requests, contact support via the Contact page.</p>
      </article>
    </SiteLayout>
  );
}

export default PrivacyPolicyPage;
