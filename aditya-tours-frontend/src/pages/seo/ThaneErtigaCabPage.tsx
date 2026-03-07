import SeoLandingTemplate from '../../components/seo/SeoLandingTemplate';

function ThaneErtigaCabPage() {
  return (
    <SeoLandingTemplate
      title="Thane Ertiga Cab"
      seoTitle="Ertiga Cab in Thane | 7 Seater Taxi Booking"
      seoDescription="Book spacious 7-seater Ertiga cab in Thane for airport, family, and outstation travel with transparent pricing."
      path="/thane-ertiga-cab"
      subtitle="Spacious Ertiga cab booking in Thane for families, airport trips, and outstation comfort travel."
      serviceAreas={['Thane West', 'Thane East', 'Ghodbunder Road', 'Majiwada', 'Kopri']}
      faqs={[
        { question: 'How many passengers can Ertiga carry?', answer: 'Up to 7 passengers including family/group travel.' },
        { question: 'Is Ertiga good for airport luggage?', answer: 'Yes, it supports practical luggage space for airport transfers.' },
      ]}
      points={[
        'Ideal 6-7 seater option for family and group rides',
        'Good luggage capacity for airport and long routes',
        'Comfortable interiors and dependable long-distance travel',
      ]}
    />
  );
}

export default ThaneErtigaCabPage;
