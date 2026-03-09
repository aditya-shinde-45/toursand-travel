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
  serviceAreasTitle?: string;
  faqs: Array<{ question: string; answer: string }>;
  points: string[];
  keywords?: string;
}

function SeoLandingTemplate({ title, seoTitle, seoDescription, path, subtitle, serviceAreas, serviceAreasTitle, faqs, points, keywords }: SeoLandingTemplateProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: title,
    provider: {
      '@type': 'LocalBusiness',
      '@id': 'https://adityatourstravel.com/#business',
      name: 'Aditya Tours & Travels',
      url: 'https://adityatourstravel.com',
      logo: 'https://adityatourstravel.com/logo.png',
      telephone: '+919969984328',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Thane',
        addressRegion: 'Maharashtra',
        postalCode: '400601',
        addressCountry: 'IN',
      },
      areaServed: [
        { '@type': 'City', name: 'Thane' },
        { '@type': 'City', name: 'Mumbai' },
        { '@type': 'City', name: 'Navi Mumbai' },
      ],
    },
    areaServed: serviceAreas,
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  return (
    <SiteLayout>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        canonicalPath={path}
        keywords={keywords ?? 'taxi service Mumbai Thane Navi Mumbai, cab booking, airport taxi, outstation cab, car rental, tours and travel'}
      />
      <StructuredData id={`seo-service-${path}`} data={structuredData} />
      <StructuredData id={`seo-faq-${path}`} data={faqSchema} />

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

          <h3 className="mt-6 text-lg font-semibold">{serviceAreasTitle ?? 'Service Areas'}</h3>
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

        <aside className="rounded-xl border border-[#FF9933]/30 bg-[#FF9933]/5 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-[#1B3A5F]">Need a quick booking?</h3>
          <p className="mt-2 text-sm text-slate-700">Get fast confirmation for local, airport, and outstation rides across Mumbai, Thane &amp; Navi Mumbai.</p>
          <div className="mt-4 grid gap-2">
            <Link
              to="/book"
              className="inline-flex justify-center rounded-lg bg-[#FF9933] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#e68a2e]"
            >
              Book Now
            </Link>
            <a
              href="tel:+919969984328"
              className="inline-flex justify-center rounded-lg border border-[#1B3A5F] px-4 py-2.5 text-sm font-semibold text-[#1B3A5F] transition hover:bg-[#1B3A5F]/5"
            >
              Call Now
            </a>
          </div>
        </aside>
      </div>
    </SiteLayout>
  );
}

export default SeoLandingTemplate;
