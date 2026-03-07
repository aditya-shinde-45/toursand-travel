import { Link } from 'react-router-dom';
import SiteLayout from '../layout/SiteLayout';
import SEOHead from './SEOHead';
import StructuredData from './StructuredData';

interface SeoLandingTemplateProps {
  title: string;
  seoTitle: string;
  seoDescription: string;
  path: string;
  subtitle: string;
  serviceAreas: string[];
  faqs: Array<{ question: string; answer: string }>;
  points: string[];
}

function SeoLandingTemplate({ title, seoTitle, seoDescription, path, subtitle, serviceAreas, faqs, points }: SeoLandingTemplateProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: title,
    provider: {
      '@type': 'LocalBusiness',
      name: 'Aditya Tours & Travels',
      areaServed: 'Thane, Maharashtra',
      telephone: '+91-9876543210',
    },
    areaServed: serviceAreas,
  };

  return (
    <SiteLayout>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        canonicalPath={path}
        keywords="thane taxi service, airport taxi thane, outstation cab thane, ertiga cab thane"
      />
      <StructuredData id={`seo-${path}`} data={structuredData} />

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Why Choose Our Service</h2>
          <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-slate-700">
            {points.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h3 className="mt-6 text-lg font-semibold">Service Areas in Thane</h3>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {serviceAreas.map((area) => (
              <span key={area} className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                {area}
              </span>
            ))}
          </div>

          <h3 className="mt-6 text-lg font-semibold">FAQs</h3>
          <div className="mt-3 grid gap-3 text-sm text-slate-700">
            {faqs.map((item) => (
              <article key={item.question} className="rounded-lg border border-slate-200 p-3">
                <h4 className="font-semibold">{item.question}</h4>
                <p className="mt-1">{item.answer}</p>
              </article>
            ))}
          </div>
        </article>

        <aside className="rounded-xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
          <h3 className="text-lg font-semibold">Need a quick booking?</h3>
          <p className="mt-2 text-sm text-slate-700">Get fast confirmation for local, airport, and outstation rides.</p>
          <div className="mt-4">
            <Link
              to="/book"
              className="inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Book Now
            </Link>
          </div>
        </aside>
      </div>
    </SiteLayout>
  );
}

export default SeoLandingTemplate;
