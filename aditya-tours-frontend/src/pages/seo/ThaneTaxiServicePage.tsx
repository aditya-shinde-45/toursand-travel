import SeoLandingTemplate from '../../components/seo/SeoLandingTemplate';

function ThaneTaxiServicePage() {
  return (
    <SeoLandingTemplate
      title="Thane Taxi Service"
      seoTitle="Taxi Service in Thane | Book Reliable Cab - Aditya Tours"
      seoDescription="Looking for taxi service in Thane? Book reliable Ertiga cab for city rides, airport transfers, and outstation travel."
      path="/thane-taxi-service"
      subtitle="Affordable and reliable taxi service for daily commutes, city rides, and custom trips in Thane."
      serviceAreas={['Thane West', 'Thane East', 'Ghodbunder Road', 'Majiwada', 'Naupada', 'Kopri', 'Vartak Nagar']}
      faqs={[
        { question: 'How do I book a taxi in Thane?', answer: 'Use our online booking form and submit trip details in 4 easy steps.' },
        { question: 'Do you provide airport transfers?', answer: 'Yes, we offer Thane to Mumbai Airport and return transfers.' },
      ]}
      points={[
        '24/7 booking support with planned pickups',
        'Clean, AC vehicles with professional drivers',
        'Transparent fare estimates and route guidance',
      ]}
    />
  );
}

export default ThaneTaxiServicePage;
