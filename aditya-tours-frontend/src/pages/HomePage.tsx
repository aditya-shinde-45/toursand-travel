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

function HomePage() {
  const routesQuery = useQuery({ queryKey: ['popular-routes'], queryFn: getPopularRoutes });
  const testimonialsQuery = useQuery({ queryKey: ['testimonials'], queryFn: getTestimonials });
  const faqsQuery = useQuery({ queryKey: ['faqs'], queryFn: getFaqs });

  return (
    <SiteLayout>
      <SEOHead
        title="Aditya Tours and Travels - Taxi Service in Thane | Ertiga Cab Booking"
        description="Book reliable Thane taxi service with Aditya Tours and Travels. Airport transfers, outstation cabs, and comfortable 7-seater Ertiga rides."
        keywords="Thane taxi service, Ertiga cab, airport taxi Thane, outstation cab Thane"
        canonicalPath="/"
      />
      <StructuredData
        id="home-localbusiness"
        data={{
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: 'Aditya Tours & Travels',
          areaServed: 'Thane, Maharashtra',
          telephone: '+91-9876543210',
        }}
      />

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
