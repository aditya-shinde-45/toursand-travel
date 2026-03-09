import SeoLandingTemplate from '../../components/seo/SeoLandingTemplate';

function MumbaiTaxiServicePage() {
  return (
    <SeoLandingTemplate
      title="Mumbai Taxi Service"
      seoTitle="Taxi Service in Mumbai | Book Reliable Cab - Aditya Tours & Travels"
      seoDescription="Book reliable taxi service in Mumbai for airport transfers, city rides, and outstation travel. Serving Andheri, Bandra, Dadar, Borivali, Thane, Navi Mumbai & all Mumbai suburbs. 24/7 service."
      path="/mumbai-taxi-service"
      subtitle="Professional taxi service across Mumbai for every occasion — airport drops, business trips, outstation journeys, and more."
      serviceAreasTitle="Service Areas in Mumbai"
      serviceAreas={['Andheri', 'Bandra', 'Dadar', 'Borivali', 'Malad', 'Vikhroli', 'Kurla', 'Mulund', 'Powai', 'Ghatkopar', 'Chembur', 'Thane', 'Navi Mumbai', 'Panvel']}
      keywords="taxi service Mumbai, cab service Mumbai, airport taxi Mumbai, Mumbai cab booking, outstation cab Mumbai, car rental Mumbai, taxi near me Mumbai, Mumbai airport transfer, best cab service Mumbai, 7 seater cab Mumbai"
      faqs={[
        { question: 'Do you provide taxi service all over Mumbai?', answer: 'Yes, we cover all Mumbai suburbs including Western Line, Central Line, Harbour Line areas and Navi Mumbai.' },
        { question: 'How do I book a Mumbai taxi?', answer: 'Book online via our website, call us, or WhatsApp. Booking is confirmed instantly.' },
        { question: 'What types of vehicles are available?', answer: 'We offer clean, AC Maruti Suzuki Ertiga 7-seater cabs suitable for families, airport trips, and outstation travel.' },
        { question: 'Do you offer Mumbai to airport taxi?', answer: 'Yes, we cover Mumbai Airport T1, T2 from anywhere in Mumbai, Thane, and Navi Mumbai.' },
        { question: 'What are the cab charges in Mumbai?', answer: 'Local fares start from ₹1,200. Outstation trips are charged by distance. All fares are transparent with no hidden costs.' },
      ]}
      points={[
        '24/7 cab service throughout Mumbai and suburbs',
        'Clean, spacious 7-seater Ertiga with AC',
        'Airport transfers for Mumbai T1 and T2',
        'Professional, verified, and punctual drivers',
        'Transparent flat-rate pricing — no meter surprises',
        'Outstation cabs from Mumbai to Pune, Nashik, Lonavala, Goa, Shirdi',
      ]}
    />
  );
}

export default MumbaiTaxiServicePage;
