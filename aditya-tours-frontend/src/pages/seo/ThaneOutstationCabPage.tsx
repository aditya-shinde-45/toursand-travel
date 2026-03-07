import SeoLandingTemplate from '../../components/seo/SeoLandingTemplate';

function ThaneOutstationCabPage() {
  return (
    <SeoLandingTemplate
      title="Thane Outstation Cab"
      seoTitle="Outstation Cab from Thane | One Way & Round Trip"
      seoDescription="Book one-way and round-trip outstation cab from Thane for Pune, Nashik, Lonavala, and nearby destinations."
      path="/thane-outstation-cab"
      subtitle="Book outstation cab service from Thane for weekend trips, business travel, and family journeys."
      serviceAreas={['Thane', 'Mumbai', 'Navi Mumbai', 'Pune Route', 'Nashik Route']}
      faqs={[
        { question: 'Which destinations are popular?', answer: 'Pune, Nashik, Lonavala, Igatpuri, and nearby routes.' },
        { question: 'Do you offer round-trip pricing?', answer: 'Yes, round-trip bookings are supported in the flow.' },
      ]}
      points={[
        'Flexible one-way and round-trip packages',
        'Route planning assistance and driver support',
        'Ideal for Nashik, Pune, Lonavala, and nearby routes',
      ]}
    />
  );
}

export default ThaneOutstationCabPage;
