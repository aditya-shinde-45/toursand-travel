import SeoLandingTemplate from '../../components/seo/SeoLandingTemplate';

function ThaneAirportTaxiPage() {
  return (
    <SeoLandingTemplate
      title="Thane Airport Taxi"
      seoTitle="Thane to Mumbai Airport Taxi | Reliable Airport Transfer"
      seoDescription="Book punctual airport taxi from Thane to Mumbai Airport with luggage-friendly Ertiga cab service."
      path="/thane-airport-taxi"
      subtitle="Pre-scheduled airport transfers from Thane to Mumbai airport with on-time driver coordination."
      serviceAreas={['Thane West', 'Majiwada', 'Ghodbunder', 'Naupada', 'Kasarvadavali']}
      faqs={[
        { question: 'Do you support early morning flights?', answer: 'Yes, pre-scheduled pickups are available 24/7.' },
        { question: 'Can I book return pickup from airport?', answer: 'Yes, return pickup can be added in round-trip bookings.' },
      ]}
      points={[
        'Punctual pickups for early morning and late-night flights',
        'Live driver coordination for terminal drop and pickup',
        'Comfortable luggage-friendly vehicles',
      ]}
    />
  );
}

export default ThaneAirportTaxiPage;
