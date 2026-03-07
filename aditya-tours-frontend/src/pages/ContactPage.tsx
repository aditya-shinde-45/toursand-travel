import SiteLayout from '../components/layout/SiteLayout';
import ContactSection from '../components/home/ContactSection';
import SEOHead from '../components/seo/SEOHead';

function ContactPage() {
  return (
    <SiteLayout>
      <SEOHead
        title="Contact Aditya Tours and Travels"
        description="Reach Aditya Tours for taxi booking support, route details, and service inquiries."
        canonicalPath="/contact"
      />
      <div className="grid gap-4">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold">Contact Us</h1>
          <p className="mt-2 text-sm text-slate-600">Phone, WhatsApp, and contact form support for bookings and inquiries.</p>
        </section>
        <ContactSection />
      </div>
    </SiteLayout>
  );
}

export default ContactPage;
