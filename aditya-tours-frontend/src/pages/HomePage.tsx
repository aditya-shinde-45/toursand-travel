import { useQuery } from '@tanstack/react-query';
import SiteLayout from '../components/layout/SiteLayout';
import HeroSection from '../components/home/HeroSection';
import VehicleDetails from '../components/home/VehicleDetails';
import PricingSection from '../components/home/PricingSection';
import PopularRoutes from '../components/home/PopularRoutes';
import HowItWorks from '../components/home/HowItWorks';
import WhyChooseUs from '../components/home/WhyChooseUs';
import Testimonials from '../components/home/Testimonials';
import FAQ from '../components/home/FAQ';
import ContactSection from '../components/home/ContactSection';
import SEOHead from '../components/seo/SEOHead';
import StructuredData from '../components/seo/StructuredData';
import { getFaqs, getPopularRoutes, getTestimonials } from '../services/contentService';
import { FAQS, POPULAR_ROUTES, TESTIMONIALS } from '../utils/constants';

const LOCAL_BUSINESS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://adityatourstravel.com/#business',
  name: 'Aditya Tours & Travels',
  url: 'https://adityatourstravel.com',
  logo: 'https://adityatourstravel.com/logo.png',
  image: 'https://adityatourstravel.com/logo.png',
  description: 'Reliable taxi, cab, and car rental services in Mumbai, Thane, and Navi Mumbai. Airport transfers, outstation trips, and city rides with professional drivers.',
  telephone: '+919969984328',
  email: 'support@adityatourstravel.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Thane',
    addressRegion: 'Maharashtra',
    postalCode: '400601',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 19.2183,
    longitude: 72.9781,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
  ],
  priceRange: '₹₹',
  currenciesAccepted: 'INR',
  paymentAccepted: 'Cash, UPI, Online Transfer',
  areaServed: [
    { '@type': 'City', name: 'Thane' },
    { '@type': 'City', name: 'Mumbai' },
    { '@type': 'City', name: 'Navi Mumbai' },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Taxi & Cab Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Taxi Service in Thane' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Taxi Service in Mumbai' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Taxi Service in Navi Mumbai' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Airport Taxi Mumbai' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Outstation Cab Service' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Car Rental Thane' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Car Rental Navi Mumbai' } },
    ],
  },
  sameAs: ['https://adityatourstravel.com'],
};

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

function HomePage() {
  const routesQuery = useQuery({ queryKey: ['popular-routes'], queryFn: getPopularRoutes });
  const testimonialsQuery = useQuery({ queryKey: ['testimonials'], queryFn: getTestimonials });
  const faqsQuery = useQuery({ queryKey: ['faqs'], queryFn: getFaqs });

  return (
    <SiteLayout>
      <SEOHead
        title="Aditya Tours & Travels | Taxi &amp; Cab Service in Mumbai, Thane &amp; Navi Mumbai"
        description="Book reliable taxi &amp; cab service in Mumbai, Thane &amp; Navi Mumbai. Airport transfers, outstation cabs, city rides with 7-seater Ertiga. 24/7 service, transparent fares. Call Aditya Tours &amp; Travels!"
        keywords="taxi service Mumbai, cab service Thane, car rental Navi Mumbai, airport taxi Mumbai, outstation cab Thane, tours and travel Mumbai, taxi near me, cab booking Mumbai, Ertiga taxi Thane, 7 seater cab, taxi Navi Mumbai, rent car Mumbai, airport transfer, Thane to Mumbai airport taxi, Navi Mumbai cab booking"
        canonicalPath="/"
      />
      <StructuredData id="home-localbusiness" data={LOCAL_BUSINESS_SCHEMA} />
      <StructuredData id="home-faq" data={FAQ_SCHEMA} />

      <div className="grid gap-6">
        <section id="home">
          <HeroSection />
        </section>
        <section id="about">
          <VehicleDetails />
        </section>
        <PopularRoutes routes={routesQuery.data || POPULAR_ROUTES} />
        <section id="services">
          <PricingSection />
        </section>
        <HowItWorks />
        <WhyChooseUs />
        <Testimonials testimonials={testimonialsQuery.data || TESTIMONIALS} />
        <FAQ faqs={faqsQuery.data || FAQS} />
        <section id="contact">
          <ContactSection />
        </section>
      </div>
    </SiteLayout>
  );
}

export default HomePage;
